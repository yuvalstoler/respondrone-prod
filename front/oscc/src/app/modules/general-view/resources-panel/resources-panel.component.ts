import { Component, OnInit } from '@angular/core';
import {FRService} from '../../../services/frService/fr.service';
import {ApplicationService} from '../../../services/applicationService/application.service';

@Component({
  selector: 'app-resources-panel',
  templateUrl: './resources-panel.component.html',
  styleUrls: ['./resources-panel.component.scss']
})
export class ResourcesPanelComponent implements OnInit {

  constructor(public frService: FRService,
              public applicationService: ApplicationService) {

  }

  ngOnInit(): void {
  }

}
