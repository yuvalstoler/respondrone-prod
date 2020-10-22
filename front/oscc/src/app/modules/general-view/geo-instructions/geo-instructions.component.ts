import { Component, OnInit } from '@angular/core';
import {GEOGRAPHIC_INSTRUCTION_TYPE} from '../../../../../../../classes/typings/all.typings';

@Component({
  selector: 'app-geo-instructions',
  templateUrl: './geo-instructions.component.html',
  styleUrls: ['./geo-instructions.component.scss']
})
export class GeoInstructionsComponent implements OnInit {

  panelOpenState = true;
  geoInstructions = Object.values(GEOGRAPHIC_INSTRUCTION_TYPE);
  selectedGeoInstruction: GEOGRAPHIC_INSTRUCTION_TYPE;
  GEOGRAPHIC_INSTRUCTION_TYPE = GEOGRAPHIC_INSTRUCTION_TYPE;

  constructor() { }

  ngOnInit(): void {
  }

  onAddInstruction = () => {

  };

  public expendPanelGeoInstruction = (index: boolean) => {
    // let res: GEOGRAPHIC_INSTRUCTION_TYPE;
    // switch (index) {
    //   case 1:
    //     res = GEOGRAPHIC_INSTRUCTION_TYPE.arrow;
    //     break;
    //   case 2:
    //     res = GEOGRAPHIC_INSTRUCTION_TYPE.address;
    //     break;
    //   case 3:
    //     res = GEOGRAPHIC_INSTRUCTION_TYPE.point;
    //     break;
    //   case 4:
    //     res = GEOGRAPHIC_INSTRUCTION_TYPE.polygon;
    //     break;
    //   case 5:
    //     res = GEOGRAPHIC_INSTRUCTION_TYPE.polyline;
    //     break;
    // }
    this.panelOpenState = index;
  };

  setSelectedInstruction = (item) => {
    this.selectedGeoInstruction = item;
  };
}
