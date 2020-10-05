import { Component, OnInit } from '@angular/core';
import {ApplicationService} from '../../../services/applicationService/application.service';

@Component({
  selector: 'app-left-narrow-panel',
  templateUrl: './left-narrow-panel.component.html',
  styleUrls: ['./left-narrow-panel.component.scss']
})
export class LeftNarrowPanelComponent implements OnInit {
  
  
  constructor(public applicationService: ApplicationService) {
   
  }

  ngOnInit(): void {
  }

}
