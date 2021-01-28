import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FRService} from '../../../../services/frService/fr.service';
import {ApplicationService} from '../../../../services/applicationService/application.service';
import {FR_DATA_UI, ID_TYPE, TASK_DATA_UI} from '../../../../../../../../classes/typings/all.typings';
import {HEADER_BUTTONS} from '../../../../../types';
import {TaskDialogComponent} from '../../../../dialogs/task-dialog/task-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {TasksService} from '../../../../services/tasksService/tasks.service';
import {GeoInstructionsService} from '../../../../services/geoInstructionsService/geo-instructions.service';
import {ResponsiveService} from '../../../../services/responsiveService/responsive.service';
import {MatMenuTrigger} from '@angular/material/menu';
import {ChatService} from '../../../../services/chatService/chat.service';

@Component({
  selector: 'app-ground-resources',
  templateUrl: './ground-resources.component.html',
  styleUrls: ['./ground-resources.component.scss']
})
export class GroundResourcesComponent implements OnInit, OnDestroy {

  @Input() optionSelected: {type: string, field: string };
  @Input() screenWidth: number;
  @ViewChild(MatMenuTrigger, {static: false}) matMenuTrigger: MatMenuTrigger;
  menuTopLeftPosition =  {x: '0', y: '0'};
  selectedElement: string;
  subscription;

  constructor(public frService: FRService,
              public applicationService: ApplicationService,
              public dialog: MatDialog,
              public geoInstructionsService: GeoInstructionsService,
              public responsiveService: ResponsiveService,
              public tasksService: TasksService,
              private chatService: ChatService) {

  }

  ngOnInit(): void {
    this.subscription = this.frService.changeSelected$.subscribe((selectedId: ID_TYPE) => {
      if (this.applicationService.screen.showGrandResources) {
        const element = document.getElementById(this.frService.getId(selectedId));
        if (element) {
          element.scrollIntoView({behavior: 'smooth', block: 'center', inline : 'center'});
        }
      }
    });
  }

  onSendMenu = (type: string, fr: FR_DATA_UI) => {
    if (type === 'task') {
      this.applicationService.selectedHeaderPanelButton = HEADER_BUTTONS.missionControl;
      // open panel
      this.applicationService.screen.showLeftPanel = true;
      this.applicationService.screen.showMissionControl = true;
      // choose missionTab on MissionControl
      this.applicationService.currentTabIndexMissionControl = 0; /*(0 = TaskTab, 1 = MissionTab)*/
      //close others
      this.applicationService.screen.showSituationPicture = false;
      this.applicationService.screen.showVideo = false;

      this.applicationService.selectedTasks = [];
      const title = 'Create new task';
      this.openTaskPanel(title, fr);

    } else if (type === 'message') {
     if (fr) {
       this.chatService.startConversation(fr.id);
     }
    }
  };

  private openTaskPanel = (title: string, fr: FR_DATA_UI) => {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      maxWidth: '90%',
      disableClose: true,
      data: {title: title, fr: fr}
    });
    this.applicationService.isDialogOpen = true;
    dialogRef.afterClosed().subscribe((result: TASK_DATA_UI) => {
      if (result) {
        this.tasksService.createTask(result);
        this.applicationService.geoCounter = 0;
        this.geoInstructionsService.removeGeoInstructionsFromMap(result.geographicInstructions);
      }
    });
  };

  onSelect = (item: FR_DATA_UI) => {
    if (this.matMenuTrigger) {
      this.matMenuTrigger.closeMenu();
    }
    this.frService.unselectIcon(this.frService.selectedElement);
    this.frService.selectedElement = (this.frService.selectedElement && this.frService.selectedElement.id === item.id) ? undefined : item;
    if (this.frService.selectedElement) {
      this.frService.selectIcon(this.frService.selectedElement);
      this.frService.flyToObject(item);
    }
  };

  onRightClick = (event: any, id: string) => {
   if (this.selectedElement === undefined) {
     this.selectedElement = id;
   }
    event.preventDefault();
    this.menuTopLeftPosition.x = event.clientX + 'px';
    this.menuTopLeftPosition.y = event.clientY + 'px';

    if (this.matMenuTrigger) {
      this.matMenuTrigger.menu.focusFirstItem('mouse');

      if (this.matMenuTrigger['_menuOpen']) {
        this.matMenuTrigger.closeMenu();
        if (this.selectedElement !== id) {
          this.selectedElement = id;
          this.matMenuTrigger.openMenu();
        }
      } else {
        this.matMenuTrigger.openMenu();
      }
    }
  };

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
