import {Injectable} from '@angular/core';
import {
  AV_DATA_UI, EVENT_DATA_UI,
  MISSION_TYPE, POINT, REPORT_DATA_UI
} from '../../../../../../classes/typings/all.typings';
import {MatMenuTrigger} from '@angular/material/menu';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContextMenuService {

  //for all mat-menu as context
  // public matMenuTrigger: MatMenuTrigger[] = [];
  matMenuTrigger$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  //for linkedToWindow
  private _isOpenLinkToMenu = false;

  selectedLinkTo: REPORT_DATA_UI | EVENT_DATA_UI;
  type: 'report' | 'event';

  //for ContextMenu
  isOpenBlob = false;
  selectedBlob: {missionType: MISSION_TYPE, airVehicle: AV_DATA_UI, options: {selectedId: number, point: POINT}};

  isOpenFRContextMenu = false;

  singleTooltip: { top: string, left: string } = {top: '-100em', left: '-100em'};


  constructor() {
  }

  get isOpenLinkToMenu(): boolean {
    return this._isOpenLinkToMenu;
  }

  openLinkToMenu = (clickPosition, linkTo: REPORT_DATA_UI | EVENT_DATA_UI, type: 'report' | 'event') => {
    this.selectedLinkTo = linkTo;
    this.type = type;
    this._isOpenLinkToMenu = true;

    this.singleTooltip.top = clickPosition.y + 'px';
    this.singleTooltip.left = clickPosition.x + 'px';

  };

  closeLinkToMenu = () => {
    this._isOpenLinkToMenu = false;
  };

  public openFRContextMenu = () => {
    this.isOpenFRContextMenu = true;
  };

  public closeContextMenu = () => {
    this.isOpenFRContextMenu = false;
    this.isOpenBlob = false;
    this.matMenuTrigger$.next(false);
  };


}
