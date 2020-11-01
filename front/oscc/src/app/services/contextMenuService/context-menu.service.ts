import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ContextMenuService {

  private _isOpenSingleMenu = false;
  singleTooltip: { top: string, left: string } = {top: '-100em', left: '-100em'};
  selectedField = false;

  constructor() {
  }

  get isOpenSingleMenu(): boolean {
    return this._isOpenSingleMenu;
  }

  openSingleMenu = (clickPosition) => {
    // this.selectedField = true;
    this._isOpenSingleMenu = true;

    this.singleTooltip.top = clickPosition.y + 'px';
    this.singleTooltip.left = clickPosition.x + 'px';

  };

  closeSingleMenu = () => {
    this._isOpenSingleMenu = false;
  };

}
