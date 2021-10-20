import { Injectable } from '@angular/core';
import {ConnectionService} from '../connectionService/connection.service';
import {API_GENERAL, WS_API} from '../../../../../../classes/dataClasses/api/api_enums';
import {ASYNC_RESPONSE, CHAT_GROUP, CHAT_SERVER_DATA} from '../../../../../../classes/typings/all.typings';
import {LoginService} from '../login/login.service';
import {DataUtility} from '../../../../../../classes/applicationClasses/utility/dataUtility';
import {CustomToasterService} from '../toasterService/custom-toaster.service';

declare var JSXC: any;

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  username: string;
  domain: string;
  boshUrl: string;
  chatGroupService: string;

  jsxc;
  jid;
  a = 0;

  constructor(private connectionService: ConnectionService,
              private loginService: LoginService,
              private toasterService: CustomToasterService) {
    this.loginService.loginEvent$.subscribe(this.initChat);
  }

  initChat = (chatPassword: string) => {
    if (chatPassword) {
      this.connectionService.post(`/${API_GENERAL.general}${WS_API.getChatServerData}`, {})
        .then((data: ASYNC_RESPONSE<CHAT_SERVER_DATA>) => {
          if (data.success && data.data.domain && data.data.boshUrl && data.data.chatGroupService) {
            this.domain = data.data.domain;
            this.boshUrl = data.data.boshUrl;
            this.chatGroupService = data.data.chatGroupService;

            this.username = this.loginService.getUserId();
            this.jid = this.getUserJID(this.username);
            this.startChat(chatPassword);
          }
          else {
            console.log('error getting chat server');
          }
        })
        .catch((data: ASYNC_RESPONSE<CHAT_SERVER_DATA>) => {
          console.log('error getting chat server');
        });
    }
  }
  // ----------------
  startChat = (chatPassword: string) => {
    if (this.domain && this.boshUrl) {
      this.jsxc = new JSXC({
        loadConnectionOptions: (username1, password1) => {
          return Promise.resolve({
            rosterAppend: 'body',
            rosterVisibility: 'hidden',
            xmpp: {
              url: this.boshUrl,
              domain: this.domain,
            }
            // RTCPeerConfig: {
            //   ttl: 1000000
            // }
          });
        },
        connectionCallback : (jid, status, condition) => {
          console.log(status);
          const CONNECTED = 5;
          const ATTACHED = 8;

          if (!(status === CONNECTED || status === ATTACHED)) {
            console.log('======== FINISHED', (Date.now() - this.a) / 1000);
            this.startConnection(chatPassword);
          }
        },
        onUserRequestsToGoOnline: () => {
          this.startConnection(chatPassword);
        }
      });
      this.jsxc.enableDebugMode();

      this.startConnection(chatPassword);
    }
  }
  // ----------------
  startConnection = (chatPassword: string) => {
    this.a = Date.now();
    console.log('========= STARTED', new Date());

    this.jsxc.start(this.boshUrl, this.jid , chatPassword) // TODO change
      .then(() => {
        console.log('>>> CHAT CONNECTION READY');
      })
      .catch((err) => {
        console.log('>>> CHAT catch', err);
      });
  }
  // ----------------
  createTaskGroup = (taskName, taskId): CHAT_GROUP => {
    try {
      const account = this.jsxc.getAccount(this.jid);
      const groupJID = `${taskId}@${this.chatGroupService}.${this.domain}`;

      const multiUserContact = account.createMultiUserContact(groupJID, this.username, taskName);
      multiUserContact.addToContactList();
      multiUserContact.join();

      return {name: groupJID};
    }
    catch (e) {
      console.log(e);
      this.toasterService.error({message: 'Error creating task chat group', title: ''});
      return undefined;
    }
  }
  // ----------------
  startConversation = (username: string) => {
    try {
      const account = this.jsxc.getAccount(this.jid);

      const index = username.indexOf('@');
      const name = index === -1 ? username : username.substring(0, index);
      const contact = account.getContact(this.getUserJID(name));
      // const contact = account.getContact(this.getUserJID(username));

      contact.openChatWindowProminently();
    }
    catch (e) {
      this.toasterService.error({message: 'Error sending message', title: ''});
      console.log(e);
    }
  }
  // ----------------
  getUserJID = (username: string): string => {
    if (username) {
      return `${username.toLowerCase()}@${this.domain}`;
    }
    else {
      return undefined;
    }
  }

}
