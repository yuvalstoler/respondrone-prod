import {Component, OnInit} from '@angular/core';
import {FILE_FS_DATA, MEDIA_TYPE} from '../../../../../../../classes/typings/all.typings';
import {ApplicationService} from '../../../services/applicationService/application.service';

@Component({
  selector: 'app-view-media',
  templateUrl: './view-media.component.html',
  styleUrls: ['./view-media.component.scss']
})



export class ViewMediaComponent implements OnInit {

  MEDIA_TYPE = MEDIA_TYPE;
  data: FILE_FS_DATA;

  constructor( public applicationService: ApplicationService ) {
    // this.data = this.applicationService.selectedViewMedia;
  }

  onClose(): void {
   this.applicationService.screen.showViewMedia = false;
  }

  ngOnInit(): void {
  }

}
