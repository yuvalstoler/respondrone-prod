import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MAP} from '../../../../types';

@Component({
  selector: 'app-description-panel',
  templateUrl: './description-panel.component.html',
  styleUrls: ['./description-panel.component.scss']
})
export class DescriptionPanelComponent implements OnInit {

  @Input() description: string;
  @Input() descriptionId: string;
  @Output() panelOpenState: EventEmitter<MAP<boolean>> = new EventEmitter<MAP<boolean>>();

  constructor() {
  }

  ngOnInit(): void {
  }

  onOpenPanel = () => {
    this.panelOpenState.emit({[this.descriptionId]: true});
  };

  onClosePanel = () => {
    this.panelOpenState.emit({[this.descriptionId]: false});
  };

}
