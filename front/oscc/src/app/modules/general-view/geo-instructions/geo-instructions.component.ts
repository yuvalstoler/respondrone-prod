import {Component, Input, OnInit} from '@angular/core';
import {
  EVENT_DATA,
  GEOGRAPHIC_INSTRUCTION,
  GEOGRAPHIC_INSTRUCTION_TYPE,
  TASK_DATA_UI
} from '../../../../../../../classes/typings/all.typings';
import * as _ from 'lodash';

@Component({
  selector: 'app-geo-instructions',
  templateUrl: './geo-instructions.component.html',
  styleUrls: ['./geo-instructions.component.scss']
})
export class GeoInstructionsComponent implements OnInit {

  @Input() element: TASK_DATA_UI;
  panelOpenState = true;
  geoInstructions = Object.values(GEOGRAPHIC_INSTRUCTION_TYPE);
  selectedGeoInstruction: GEOGRAPHIC_INSTRUCTION_TYPE;
  GEOGRAPHIC_INSTRUCTION_TYPE = GEOGRAPHIC_INSTRUCTION_TYPE;
  geoInstructionModel: GEOGRAPHIC_INSTRUCTION;
  geographicInstructionsModel: GEOGRAPHIC_INSTRUCTION[] = [];
  icon: string;
  defaultModel = {
    type: undefined,
    description: '',
    location: undefined,
    styles: {icon: ''}};

  constructor() {
    this.geoInstructionModel =  _.cloneDeep(this.defaultModel);
  }

  ngOnInit(): void {
  }

  onAddInstruction = () => {

  };

  public expendPanelGeoInstruction = (index: boolean) => {
    this.panelOpenState = index;
  };

  setSelectedInstruction = (item) => {
    this.selectedGeoInstruction = item;
  };

  saveInstruction = (type: GEOGRAPHIC_INSTRUCTION_TYPE) => {
    this.geoInstructionModel.type = type;
    this.geoInstructionModel.styles.icon = this.setIcon(type);
    this.geographicInstructionsModel.push(this.geoInstructionModel);
    this.selectedGeoInstruction = undefined;
    this.geoInstructionModel = _.cloneDeep(this.defaultModel);
  };

  setIcon = (type: GEOGRAPHIC_INSTRUCTION_TYPE): string => {
    let res: string;
    switch (type) {
      case GEOGRAPHIC_INSTRUCTION_TYPE.arrow:
        res = 'arrow_forward';
        break;
      case GEOGRAPHIC_INSTRUCTION_TYPE.address:
        res = 'location_on';
        break;
      case GEOGRAPHIC_INSTRUCTION_TYPE.point:
        res = 'location_on';
        break;
      case GEOGRAPHIC_INSTRUCTION_TYPE.polygon:
        res = 'crop_5_4';
        break;
      case GEOGRAPHIC_INSTRUCTION_TYPE.polyline:
        res = 'timeline';
        break;
    }
    return res;
  };

  removeGeoInstruction = (event, index: number) => {
    event.stopPropagation();
    this.geographicInstructionsModel.splice(index, 1);
  };

}
