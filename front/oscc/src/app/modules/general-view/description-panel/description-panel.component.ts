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
import {MAP} from '../../../../types';

@Component({
  selector: 'app-description-panel',
  templateUrl: './description-panel.component.html',
  styleUrls: ['./description-panel.component.scss']
})
export class DescriptionPanelComponent implements OnInit, AfterViewChecked {

  @Input() description: string;
  @Input() descriptionId: string;

  @Output() panelOpenState: EventEmitter<MAP<boolean>> = new EventEmitter<MAP<boolean>>();

  @ViewChild('first', {static: true, read: MatExpansionPanel}) first: MatExpansionPanel;

  constructor(public applicationService: ApplicationService,
              private cdr: ChangeDetectorRef) {

  }

  ngOnInit(): void {
    if (this.description !== '' || this.description !== undefined) {
      setTimeout(() => {
          this.onOpenPanel();
          this.cdr.detectChanges();
        }, 500
      );
    }

  }

  ngAfterViewChecked() {

  }

  openPanel = () => {
    let res = false;
    if (this.description !== '' || this.description !== undefined && this.descriptionId !== undefined) {
      // this.panelOpenState.emit({[this.descriptionId]: true});
      res = true;
    }
    return res;
  };

  onOpenPanel = () => {
    this.panelOpenState.emit({[this.descriptionId]: true});
    console.log('this.onOpenPanel();', [this.descriptionId]);
  };

  onClosePanel = () => {
    this.panelOpenState.emit({[this.descriptionId]: false});
    console.log('this.onClosePanel();', [this.descriptionId]);
  };


}
