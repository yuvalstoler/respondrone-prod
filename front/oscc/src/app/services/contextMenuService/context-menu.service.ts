import {Injectable} from '@angular/core';
import {LINKED_EVENT_DATA, LINKED_REPORT_DATA} from '../../../../../../classes/typings/all.typings';

@Injectable({
  providedIn: 'root'
})
export class ContextMenuService {

  private _isOpenSingleMenu = false;
  singleTooltip: { top: string, left: string } = {top: '-100em', left: '-100em'};
  selectedLinkTo: LINKED_REPORT_DATA[] | LINKED_EVENT_DATA[];
  type: string = '';

  constructor() {
  }

  get isOpenSingleMenu(): boolean {
    return this._isOpenSingleMenu;
  }

  openSingleMenu = (clickPosition, linkTo: LINKED_REPORT_DATA[] | LINKED_EVENT_DATA[], type: string) => {
    this.selectedLinkTo = linkTo;
    this.type = type;
    this._isOpenSingleMenu = true;

    this.singleTooltip.top = clickPosition.y + 'px';
    this.singleTooltip.left = clickPosition.x + 'px';

  };

  closeSingleMenu = () => {
    this._isOpenSingleMenu = false;
  };

}
