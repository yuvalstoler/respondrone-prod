import {Injectable} from '@angular/core';
import {LINKED_EVENT_DATA, LINKED_REPORT_DATA} from '../../../../../../classes/typings/all.typings';

@Injectable({
  providedIn: 'root'
})
export class ContextMenuService {

  private _isOpenLinkToMenu = false;
  selectedLinkTo: LINKED_REPORT_DATA[] | LINKED_EVENT_DATA[];
  type: string = '';

  private _isOpenSortGroundMenu = false;

  singleTooltip: { top: string, left: string } = {top: '-100em', left: '-100em'};


  constructor() {
  }

  get isOpenLinkToMenu(): boolean {
    return this._isOpenLinkToMenu;
  }

  openLinkToMenu = (clickPosition, linkTo: LINKED_REPORT_DATA[] | LINKED_EVENT_DATA[], type: string) => {
    this.selectedLinkTo = linkTo;
    this.type = type;
    this._isOpenLinkToMenu = true;

    this.singleTooltip.top = clickPosition.y + 'px';
    this.singleTooltip.left = clickPosition.x + 'px';

  };

  closeLinkToMenu = () => {
    this._isOpenLinkToMenu = false;
  };

  get isOpenSortGroundMenu(): boolean {
    return this._isOpenSortGroundMenu;
  }



}
