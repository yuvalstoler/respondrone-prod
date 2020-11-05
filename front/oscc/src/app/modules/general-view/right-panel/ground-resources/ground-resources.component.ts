import {Component, Input, OnInit} from '@angular/core';
import {FRService} from '../../../../services/frService/fr.service';
import {ApplicationService} from '../../../../services/applicationService/application.service';

@Component({
  selector: 'app-ground-resources',
  templateUrl: './ground-resources.component.html',
  styleUrls: ['./ground-resources.component.scss']
})
export class GroundResourcesComponent implements OnInit {

  @Input() optionSelected: string;

  constructor(public frService: FRService,
              public applicationService: ApplicationService) { }

  ngOnInit(): void {
  }

}
