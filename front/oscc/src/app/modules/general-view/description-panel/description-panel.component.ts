import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {MatExpansionPanel} from '@angular/material/expansion';
import {ApplicationService} from '../../../services/applicationService/application.service';

@Component({
  selector: 'app-description-panel',
  templateUrl: './description-panel.component.html',
  styleUrls: ['./description-panel.component.scss']
})
export class DescriptionPanelComponent implements OnInit, AfterViewChecked {

  @Input() description: string;
  @Input() descriptionId: string;

  @Output() panelOpenState: EventEmitter<{id: string, isOpen: boolean}> = new EventEmitter<{id: '', isOpen: true}>();

  @ViewChild('first', {static: true, read: MatExpansionPanel}) first: MatExpansionPanel;

  constructor(public applicationService: ApplicationService,
              /*private cdr: ChangeDetectorRef*/) {

  }

  ngOnInit(): void {
    if (this.description !== '' || this.description !== undefined) {
      setTimeout(() => {
          this.onOpenPanel();
        }, 500
      );
    }

  }

  ngAfterViewChecked() {

  }

  onOpenPanel = () => {
    this.panelOpenState.emit({id: this.descriptionId, isOpen: true});
  };

  onClosePanel = () => {
    this.panelOpenState.emit({id: this.descriptionId, isOpen: false});
  };


}
