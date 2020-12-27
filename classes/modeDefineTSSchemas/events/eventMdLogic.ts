import {EVENT_DATA_MD, EVENT_DATA_UI, LOCATION_TYPE, PRIORITY, TABLE_DATA_MD} from '../../typings/all.typings';

import {IModeDefine} from '../IModeDefine';
import {MDClass} from "../mdClass";

export class EventMdLogic implements IModeDefine {

    constructor() {
    }

    public static validate(data: EVENT_DATA_UI): EVENT_DATA_MD {
        const obj: EVENT_DATA_MD = {
            styles: {
                // icon
                mapIcon: EventMdLogic.getMapIcon(data).data,
                iconSize: EventMdLogic.getIconSize(data),
                // polygon
                color: EventMdLogic.getColor(data),
                fillColor: EventMdLogic.getFillColor(data),
                // common
                hoverText: undefined,
                labelText: EventMdLogic.getLabelText(data),
                labelBackground: undefined,
                labelOffset: EventMdLogic.getLabelOffset(data),
                // other
                icon: EventMdLogic.getPriorityIcon(data).data,
                mapIconSelected: EventMdLogic.getMapIconSelected(data).data,
            },
            tableData: EventMdLogic.tableData(data)
        };
        return obj;
    }

    private static getMapIcon = (data: EVENT_DATA_UI): TABLE_DATA_MD => {
        let res: TABLE_DATA_MD = {type: 'image', data: '', color: ''};
        if (data.priority === PRIORITY.high) {
            res.data = '../../../../../assets/mapPriorityHigh.png';
        } else if (data.priority === PRIORITY.middle) {
            res.data = '../../../../../assets/mapPriorityMiddle.png';
        } else if (data.priority === PRIORITY.low) {
            res.data = '../../../../../assets/mapPriorityLow.png';
        }
        return res;
    };

    private static getMapIconSelected = (data: EVENT_DATA_UI): TABLE_DATA_MD => {
        let res: TABLE_DATA_MD = {type: 'image', data: '', color: ''};
        if (data.priority === PRIORITY.high) {
            res.data = '../../../../../assets/mapPriorityHighSelected.png';
        } else if (data.priority === PRIORITY.middle) {
            res.data = '../../../../../assets/mapPriorityMiddleSelected.png';
        } else if (data.priority === PRIORITY.low) {
            res.data = '../../../../../assets/mapPriorityLowSelected.png';
        }
        return res;
    };

    private static getPriorityIcon = (data: EVENT_DATA_UI): TABLE_DATA_MD => {
        let res: TABLE_DATA_MD = {type: 'image', data: '', color: ''};
        if (data.priority === PRIORITY.high) {
            res.data = '../../../../../assets/priorityHigh.png';
        } else if (data.priority === PRIORITY.middle) {
            res.data = '../../../../../assets/priorityMiddle.png';
        } else if (data.priority === PRIORITY.low) {
            res.data = '../../../../../assets/priorityLow.png';
        }
        return res;
    };


    private static tableData = (data: EVENT_DATA_UI) => {
        let res = {
            id: {
                type: 'text',
                data: data.idView
            } as TABLE_DATA_MD,
            time: {
                type: 'date',
                data: data.time
            } as TABLE_DATA_MD,
            message: {
                type: 'text',
                data: data.comments.length > 0 ? '' + data.comments.length : ''
            } as TABLE_DATA_MD,
            priority: EventMdLogic.getPriorityIcon(data),
            link: {
                type: 'matIcon',
                data: data.reports.length > 0 ? 'link' : '',
                color: MDClass.colors.darkGray
            } as TABLE_DATA_MD,
            map: {
                type: 'matIcon',
                data: data.locationType !== LOCATION_TYPE.none ? 'location_on' : '',
                color: MDClass.colors.darkGray
            } as TABLE_DATA_MD
        };
        return res;
    };

    private static getColor = (data: EVENT_DATA_UI): string => {
        let res: string = MDClass.colors.yellow;
        return res;
    };

    private static getFillColor = (data: EVENT_DATA_UI): string => {
        let res: string = MDClass.colors.yellowOpacity;
        return res;
    };

    private static getLabelOffset = (data: EVENT_DATA_UI): {x: number, y: number} => {
        return {x: 0, y: 0};
    };

    private static getLabelText = (data: EVENT_DATA_UI): string => {
        let res;
        if (data.locationType === LOCATION_TYPE.polygon) {
            res = data.title
        }
        return res;
    };


    private static getIconSize = (data: EVENT_DATA_UI): {width: number, height: number} => {
        return {width: 30, height: 30};
    };

}
