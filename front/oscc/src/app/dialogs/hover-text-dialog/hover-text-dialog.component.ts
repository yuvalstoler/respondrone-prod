import { Component, OnInit } from '@angular/core';
import {ApplicationService} from "../../services/applicationService/application.service";

@Component({
  selector: 'app-hover-text-dialog',
  templateUrl: './hover-text-dialog.component.html',
  styleUrls: ['./hover-text-dialog.component.scss']
})
export class HoverTextDialogComponent implements OnInit {

  constructor(public applicationService: ApplicationService) { }

  ngOnInit(): void {
  }

}
