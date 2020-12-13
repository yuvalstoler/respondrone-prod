import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-resources-panel',
  templateUrl: './resources-panel.component.html',
  styleUrls: ['./resources-panel.component.scss']
})
export class ResourcesPanelComponent implements OnInit {

  @Input() resources: string;

  constructor() { }

  ngOnInit(): void {
  }

}
