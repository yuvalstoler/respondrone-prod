import {AfterViewChecked, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MatExpansionPanel} from '@angular/material/expansion';
import {ApplicationService} from '../../../services/applicationService/application.service';
import {ResponsiveService} from '../../../services/responsiveService/responsive.service';

@Component({
  selector: 'app-description-panel',
  templateUrl: './description-panel.component.html',
  styleUrls: ['./description-panel.component.scss']
})
export class DescriptionPanelComponent implements OnInit, AfterViewChecked {

  @Input() description: string;
  @Input() descriptionId: string;
  @Output() panelOpenState: EventEmitter<{ id: string, isOpen: boolean }> = new EventEmitter<{ id: '', isOpen: true }>();
  screenWidth: number;

  constructor(public applicationService: ApplicationService,
              public responsiveService: ResponsiveService
              /*private cdr: ChangeDetectorRef*/) {
    this.responsiveService.screenWidth$.subscribe(res => {
      this.screenWidth = res;
    });
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
