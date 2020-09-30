import {WebSocketLoggerClient} from '../websocket/webSocketLoggerClient';
const date = new Date();
const suffix = `${date.getFullYear()}-${(date.getMonth()+1<10)?'0'+(date.getMonth()+1):(date.getMonth()+1)}-${(date.getDate()<10)?'0'+date.getDate():date.getDate()}`;
//-${(date.getHours()<10)?'0'+date.getHours():date.getHours()}-${(date.getSeconds()<10)?'0'+date.getSeconds():date.getSeconds()}
const fs = require('fs');
Date.prototype.toISOString = function() {
    var tzo = -this.getTimezoneOffset(),
        dif = tzo >= 0 ? '+' : '-',
        pad = function(num) {
            var norm = Math.floor(Math.abs(num));
            return (norm < 10 ? '0' : '') + norm;
        };
    return this.getFullYear() +
        '-' + pad(this.getMonth() + 1) +
        '-' + pad(this.getDate()) +
        'T' + pad(this.getHours()) +
        ':' + pad(this.getMinutes()) +
        ':' + pad(this.getSeconds()) +
        dif + pad(tzo / 60) +
        ':' + pad(tzo % 60);
};

const jsonfile = require('jsonfile');
let file = '';
if (process.platform === 'win32') {
    file = 'c:\\logs\\';

    if (!fs.existsSync(file)) {
        fs.mkdirSync(file);
    }

} else {
    //todo
}

let suf = 'droneService';

export class Logger {
    static logger = {};

    static init(prefix) {
        Logger.logger[prefix] = prefix;
    }

    static trace(prefix, message) {
        if (!Logger.logger.hasOwnProperty(prefix)) {
            Logger.init(prefix);
        }

        const data = {prefix: prefix, timeStamp: Date.now(), logLevel: 'trace', data: message};
        WebSocketLoggerClient.emit(data);
    }

    static debug(prefix, message) {
        if (!Logger.logger.hasOwnProperty(prefix)) {
            Logger.init(prefix);
        }
        const data = {prefix: prefix, timeStamp: Date.now(), logLevel: 'debug', data: message};
        WebSocketLoggerClient.emit(data);

    }

    static error(prefix, message) {
        if (!Logger.logger.hasOwnProperty(prefix)) {
            Logger.init(prefix);
        }
        //Logger.logger[prefix].error(message);
        const data = {prefix: prefix, timeStamp: Date.now(), logLevel: 'error', data: message};
        WebSocketLoggerClient.emit(data);
    }

    static info(prefix, message) {
        if (!Logger.logger.hasOwnProperty(prefix)) {
            Logger.init(prefix);
        }
        //Logger.logger[prefix].info(message);
        const data = {prefix: prefix, timeStamp: Date.now(), logLevel: 'info', data: message};
        WebSocketLoggerClient.emit(data);
    }


    static fatal(prefix, message) {
        if (!Logger.logger.hasOwnProperty(prefix)) {
            Logger.init(prefix);
        }
        //Logger.logger[prefix].fatal(message);
        const data = {prefix: prefix, timeStamp: Date.now(), logLevel: 'fatal', data: message};
        WebSocketLoggerClient.emit(data);
        Logger.json(prefix, message);

    }

    static json(prefix, data) {

        let date = new Date();
        // if(prefix === 'ReturnToLauncherFlyt') debugger

        // jsonfile.readFile(file + prefix + '_' + suffix + '.json', (err, obj) => {
        // if (err) {
        //      obj = {}
        //     console.log(err);
        //  }
        let obj = {};


        obj[date.toISOString()] = data;
        jsonfile.writeFile(file + suffix+ '_' +suf+'_'+prefix   + '.json', obj, {spaces: 2, flag: 'a'}, (err) => {
            if (err) console.error(err);
        });


        //  });
    }

    static logWSRooms(header, rooms) {
        const green = '\x1b[32m%s';
        const blue = "\x1b[34m";
        const reset = '\x1b[0m';

        console.log(green, header, blue);
        console.log(rooms.join('\n'));
        console.log(reset);
    };
}
