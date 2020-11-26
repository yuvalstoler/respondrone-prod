import {Injectable} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import * as _ from 'lodash';
import {SocketService} from '../socketService/socket.service';
import {ToasterData} from '../../../../../../classes/applicationClasses/toasterData';
import {NOTIFICATION_UI, TOASTER_OPTIONS} from '../../../../../../classes/typings/all.typings';
import {take} from "rxjs/operators";
// import {MatSnackBar} from "@angular/material";

// implement toaster from:
// https://www.npmjs.com/package/ngx-toastr

@Injectable({
  providedIn: 'root'
})
export class CustomToasterService {

  options: TOASTER_OPTIONS =
    {
      timeOut: 10000,
      positionClass: 'toast-top-left',
      preventDuplicates: true,
      closeButton: true,
    };

  constructor(
    private toastr: ToastrService,
    private socketService: SocketService,
    // public snackBar: MatSnackBar
  ) {
    this.connectToWebSocket();
  }

  private connectToWebSocket = () => {
    this.socketService.connectToRoom('proxy_ui_toaster')
      .subscribe(this.showToaster);
  };


  private showToaster = (data: ToasterData) => {
    try {

      // this.snackBar.openFromComponent(PizzaPartyComponent, {
      //   duration: 500,
      // });

      this[data.type](data);
    }
    catch (e) {
    }
  };

  public success(toaster: NOTIFICATION_UI) {
    this.toastr.success(toaster.message, toaster.title, this.overrideOptions(toaster.options));
  }

  public error(toaster: NOTIFICATION_UI) {
    this.toastr.error(toaster.message, toaster.title, this.overrideOptions(toaster.options));
  }

  public info(toaster: NOTIFICATION_UI) {
    this.toastr.info(toaster.message, toaster.title, this.overrideOptions(toaster.options));
  }

  public warning(toaster: NOTIFICATION_UI) {
    this.toastr.warning(toaster.message, toaster.title, this.overrideOptions(toaster.options));
  }

  private overrideOptions(options?: TOASTER_OPTIONS) {
    return _.assign(_.clone(this.options), options);
  }

  public missionToaster(toaster: NOTIFICATION_UI, cb: Function) {
    const options = {
      enableHtml: true,
      closeButton: true,
      positionClass: 'toast-bottom-right',
      timeOut: 10000,
      // tapToDismiss: false,
    };

    this.toastr.warning(toaster.message, toaster.title, options)
      .onTap
      .pipe(take(1))
      .subscribe(() => cb());
  }
}
