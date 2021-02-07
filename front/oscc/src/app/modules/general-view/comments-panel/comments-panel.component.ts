import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {COMMENT} from '../../../../../../../classes/typings/all.typings';
import {ApplicationService} from '../../../services/applicationService/application.service';
import {LoginService} from '../../../services/login/login.service';
import {MAP} from '../../../../types';
//https://github.com/scttcper/ngx-emoji-mart#i18n - Emoji

@Component({
  selector: 'app-comments-panel',
  templateUrl: './comments-panel.component.html',
  styleUrls: ['./comments-panel.component.scss']
})
export class CommentsPanelComponent implements OnInit {

  @Input() comments: COMMENT[];
  @Input() description: string;
  @Input() descriptionId: string;
  @Input() isShowTitle: boolean = true;
  @Output() changeComments = new EventEmitter<COMMENT[]>();
  @Input() isOpenDescription: {id: string, isOpen: boolean};
  comment = '';
  name = '';

  constructor(public applicationService: ApplicationService,
              private loginService: LoginService) {
    this.name = this.loginService.getUserName();
   // console.log(this.isOpenDescription);
  }

  ngOnInit(): void {
  }

  onSendComment = () => {
    if (this.comment !== '' && this.comment !== undefined) {
      const newComment = {source: '', time: Date.now(), text: this.comment};
      this.changeComments.emit([...this.comments, ...[newComment]]);
      this.comment = '';
    }
  };

  addEmoji = (event) => {
    console.log(event.emoji);
    this.comment = this.comment + event.emoji.native;
  };

  getIsOpenDescription = () => {
    let res = 'CommentDescriptionOpen';
    if (this.descriptionId !== undefined) {
      if (this.isOpenDescription[this.descriptionId]) {
        res = 'CommentDescriptionOpen';
      } else if (!this.isOpenDescription[this.descriptionId]) {
        res = 'CommentDescriptionClose';
      }
    }
    return res;
  };

}
