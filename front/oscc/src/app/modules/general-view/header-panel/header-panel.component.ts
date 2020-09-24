import { Component, OnInit } from '@angular/core';
import {Header_Buttons} from 'src/types';

@Component({
  selector: 'app-header-panel',
  templateUrl: './header-panel.component.html',
  styleUrls: ['./header-panel.component.scss']
})
export class HeaderPanelComponent implements OnInit {

  Header_Buttons = Header_Buttons;

  constructor(/*public applicationService: ApplicationService*/) { }

  ngOnInit(): void {
  }

  onSituationPicture = () => {
    console.log('sit pic');
  }

}
