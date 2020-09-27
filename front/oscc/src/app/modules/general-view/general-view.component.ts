import { Component, OnInit } from '@angular/core';
import {DISPLAY_ON_SCREEN, Header_Buttons} from 'src/types';
import {ApplicationService} from 'src/app/services/applicationService/application.service';

@Component({
  selector: 'app-general-view',
  templateUrl: './general-view.component.html',
  styleUrls: ['./general-view.component.scss']
})
export class GeneralViewComponent implements OnInit {

  Header_Buttons = Header_Buttons;

  constructor(public applicationService: ApplicationService) { }

  ngOnInit(): void {
  }

}
