import { Injectable } from '@angular/core';
import {DISPLAY_ON_SCREEN} from 'src/types';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  selectedHeaderPanelButton = undefined;
  screen: DISPLAY_ON_SCREEN;
  
  
  constructor() {
    this.screen = {
      showLeftPanel: false
    };
  }
}
