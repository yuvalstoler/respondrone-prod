import {Converting} from '../../../../../classes/applicationClasses/utility/converting';

import {MS_API} from '../../../../../classes/dataClasses/api/api_enums';

import {RequestManager} from '../../AppService/restConnections/requestManager';

import {
    ASYNC_RESPONSE,
    LAST_ACTION,
    GRAPHIC_OVERLAY_DATA,
    GRAPHIC_OVERLAY_DATA_UI,
    MISSION_REQUEST_DATA,
    MISSION_STATUS,
    MISSION_TYPE, TASK_DATA
} from '../../../../../classes/typings/all.typings';
import {SocketIO} from '../../websocket/socket.io';
import {GraphicOverlay} from "../../../../../classes/dataClasses/graphicOverlay/graphicOverlay";
import {GraphicOverlayMdLogic} from "../../../../../classes/modeDefineTSSchemas/graphicOverlay/graphicOverlayMdLogic";

const _ = require('lodash');

const services = require('./../../../../../../../../config/services.json');
const url_FS = services.FS.protocol + '://' + services.FS.host + ':' + services.FS.port;
const url_VideoStreamService = services.VSS.protocol + '://' + services.VSS.host + ':' + services.VSS.port;


export class GraphicOverlayManager {


    private static instance: GraphicOverlayManager = new GraphicOverlayManager();


    graphicOverlays: GraphicOverlay[] = [];

    private constructor() {
        this.getGraphicOverlayFromMS();
    }

    private getGraphicOverlayFromMS = () => {
        RequestManager.requestToMS(MS_API.readAllGraphicOverlay, {})
            .then((data: ASYNC_RESPONSE<GRAPHIC_OVERLAY_DATA[]>) => {
                if ( data.success ) {
                    this.graphicOverlays = Converting.Arr_GRAPHIC_OVERLAY_DATA_to_Arr_GraphicOverlay(data.data);
                }
                else {
                    //todo logger
                    console.log('error getGraphicOverlaysFromMS', JSON.stringify(data));
                }
            })
            .catch((data: ASYNC_RESPONSE<MISSION_REQUEST_DATA[]>) => {
                //todo logger
                console.log('error getGraphicOverlaysFromMS', JSON.stringify(data));
            });
    };

    private getGraphicOverlays = (): GRAPHIC_OVERLAY_DATA[] => {
        const res: GRAPHIC_OVERLAY_DATA[] = [];
        this.graphicOverlays.forEach((graphicOverlay: GraphicOverlay) => {
            res.push(graphicOverlay.toJson());
        });
        return res;
    }


    private readAllGraphicOverlay = (requestData): Promise<ASYNC_RESPONSE<GRAPHIC_OVERLAY_DATA[]>> => {
        return new Promise((resolve, reject) => {
            const res: ASYNC_RESPONSE = {success: true, data: []};
            res.data = this.getDataForUI();
            resolve(res);
        });
    }



    private getDataForUI = (): GRAPHIC_OVERLAY_DATA_UI[] => {
        const res: GRAPHIC_OVERLAY_DATA_UI[] = [];
        this.graphicOverlays.forEach((graphicOverlay: GraphicOverlay) => {
            const graphicOverlayDataUI: GRAPHIC_OVERLAY_DATA_UI = graphicOverlay.toJsonForUI();
            graphicOverlayDataUI.modeDefine = GraphicOverlayMdLogic.validate(graphicOverlayDataUI);

            res.push(graphicOverlayDataUI);
        });
        return res;
    };

    private updateAllGraphicOverlays = (data: GRAPHIC_OVERLAY_DATA[]): Promise<ASYNC_RESPONSE> => {
        return new Promise((resolve, reject) => {
            const res: ASYNC_RESPONSE = {success: false};
            this.graphicOverlays = Converting.Arr_GRAPHIC_OVERLAY_DATA_to_Arr_GraphicOverlay(data);
            res.success = true;
            this.sendDataToUI();
            resolve(res);

        });
    }


    private sendDataToUI = (): void => {
        const jsonForSend: GRAPHIC_OVERLAY_DATA_UI[] = this.getDataForUI();
        SocketIO.emit('webServer_graphicOverlays', jsonForSend);
    };

    // region API uncions

    public static getGraphicOverlays = GraphicOverlayManager.instance.getGraphicOverlays;
    public static readAllGraphicOverlay = GraphicOverlayManager.instance.readAllGraphicOverlay;
    public static updateAllGraphicOverlays = GraphicOverlayManager.instance.updateAllGraphicOverlays;


    public static sendDataToUI = GraphicOverlayManager.instance.sendDataToUI;


    // endregion API uncions

}
