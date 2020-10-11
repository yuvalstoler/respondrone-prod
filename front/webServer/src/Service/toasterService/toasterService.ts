import {SocketIO} from '../../websocket/socket.io';
import { NOTIFICATION_UI } from '../../../../../classes/typings/all.typings';

export class ToasterService {
    // private static socketServer: SocketIO;

    public static setSocketServer(_socketClient: SocketIO) {
        // ToasterService.socketServer = _socketClient;
    }

    /*  Usage Example:                                         *\
        const data: NOTIFICATION = { ... }
        ToasterService.sendToaster(data);
    \*                                                         */
    public static sendToaster = (dataToSend: NOTIFICATION_UI) => {
        // if (ToasterService.socketServer) {
            try {
               SocketIO.emit('proxy_ui_toaster', dataToSend);
            } catch (e) {
            }
        // }

    };


}
