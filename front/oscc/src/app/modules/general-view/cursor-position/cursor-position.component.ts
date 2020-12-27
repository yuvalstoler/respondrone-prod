import {Component, OnInit} from '@angular/core';
import * as _ from 'lodash';
import {ApplicationService} from '../../../services/applicationService/application.service';

@Component({
  selector: 'app-cursor-position',
  templateUrl: './cursor-position.component.html',
  styleUrls: ['./cursor-position.component.scss']
})
export class CursorPositionComponent implements OnInit {

  // lat = 0.0;
  // lng = 0.0;

  constructor(public applicationService: ApplicationService) {
    // this.get();
  }

  ngOnInit() {}


  get = () => {
    // this.lat = this.applicationService.cursorPosition.latitude;
    // this.lng = this.applicationService.cursorPosition.longitude;
    // this.mapService.cursorPosition$.subscribe(result => {
    //   const latlng = _.get(result, 'latlng', false);
    //   if (latlng) {
    //     this.lng = latlng.lng;
    //     this.lat = latlng.lat;
    //   }
    // });
  }

}
