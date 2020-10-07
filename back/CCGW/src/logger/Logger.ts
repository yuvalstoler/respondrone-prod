const log4js = require('log4js');
let file = '';
const fs = require('fs');
if ( process.platform === 'win32' ) {
    file = 'c:\\logs\\';

    if ( !fs.existsSync(file) ) {
        fs.mkdirSync(file);
    }

}
else {
    // todo
}
const date = new Date();

const suffix = `${date.getFullYear()}-${(date.getMonth() + 1 < 10) ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)}-${(date.getDate() < 10) ? '0' + date.getDate() : date.getDate()}`;
// -${(date.getHours() < 10) ? '0' + date.getHours() : date.getHours()}-${(date.getSeconds() < 10) ? '0' + date.getSeconds() : date.getSeconds()}
const suf = '_webService';

const fileName = file + suffix + suf + '.log';

export class Logger {

    static configure = {};
    static logger = {};

    static init(prefix) {
        Logger.configure['appenders'] = {};
        Logger.configure['appenders'][prefix] = {
            type: 'file',
            filename: fileName,
            layout: {type: 'pattern', pattern: '[%d{ISO8601_WITH_TZ_OFFSET}]  [%p]  [%c] [%m]%n'}
        };
        Logger.configure['categories'] = {};
        Logger.configure['categories']['default'] = {};
        Logger.configure['categories']['default'] ['appenders'] = [prefix];
        Logger.configure['categories']['default'] ['level'] = ['info'];
        log4js.configure(Logger.configure);
        Logger.logger[prefix] = log4js.getLogger(prefix);
    }

    // ISO8601_WITH_TZ_OFFSET
    static trace(prefix, message) {
        if ( !Logger.logger.hasOwnProperty(prefix) ) {
            Logger.init(prefix);
        }
        Logger.logger[prefix].trace(message);
    }

    static debug(prefix, message) {
        if ( !Logger.logger.hasOwnProperty(prefix) ) {
            Logger.init(prefix);
        }
        Logger.logger[prefix].debug(message);
    }

    static error(prefix, message) {
        if ( !Logger.logger.hasOwnProperty(prefix) ) {
            Logger.init(prefix);
        }
        Logger.logger[prefix].error(message);
    }

    static info(prefix, message, consoleWrite?: boolean) {
        if ( !Logger.logger.hasOwnProperty(prefix) ) {
            Logger.init(prefix);
        }

        Logger.logger[prefix].info(message);
        if ( consoleWrite ) {
            // console.log(message);
        }
    }


    static logKeys(manager, routes) {
        const green = '\x1b[32m%s';
        const blue = '\x1b[34m';
        const reset = '\x1b[0m';

        // console.log(green, manager, blue);
        // console.log(Object.keys(routes).join('\n'));
        // console.log(reset);
    }

    static logValues(manager, rooms) {
        const green = '\x1b[32m%s';
        const blue = '\x1b[34m';
        const reset = '\x1b[0m';

        // console.log(green, manager, blue);
        // console.log(Object.values(rooms).join('\n'));
        // console.log(reset);
    }
}
