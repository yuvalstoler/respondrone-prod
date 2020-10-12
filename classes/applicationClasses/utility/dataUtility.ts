import {
    get,
    set
} from './safe';
import { MAP } from '../../typings/all.typings';


export class DataUtility {


    public static setValues = (objForUpdate, data, saveConfig: Object) => {
        for ( const key in saveConfig ) {
            if ( saveConfig.hasOwnProperty(key) && get(() => data[saveConfig[key]]) !== undefined ) {
                set(objForUpdate, key, get(() => data[saveConfig[key]]));
            }
        }
    };
    public static convertTo_CSV = (log: object[]): string => {
        if ( !log || !log.length ) {
            return;
        }
        const separator = ',';
        const keys: string[] = Object.keys(log[0]);
        const csvContent: string =
            keys.join(separator) +
            '\n' +
            log.map(row => {
                return keys.map(k => {
                    let cell = row[k] === null || row[k] === undefined ? '' : row[k];
                    cell = cell instanceof Date
                        ? cell.toLocaleString()
                        : cell.toString().replace(/"/g, '""');
                    if ( cell.search(/("|,|\n)/g) >= 0 ) {
                        cell = `"${cell}"`;
                    }
                    return cell;
                }).join(separator);
            }).join('\n');
        return csvContent;
    }

    public static generateID(): string {
        return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 10);
    }

    public static checkIsNumber = (num) => {
        return Number.isFinite(num);
    };

    public static arrToMAP = (objArr: any[], fieldName: string): MAP<any> => {
        const res: MAP<any> = {};
        if ( Array.isArray(objArr) ) {
            objArr.forEach((obj) => {
                if ( obj.hasOwnProperty(fieldName) ) {
                    res[obj[fieldName]] = obj;
                }
            });
        }
        return res;
    };

    public static arrPrimitivesToMAP_boolean = (objArr: any[]): MAP<any> => {
        const res: MAP<any> = {};
        if ( Array.isArray(objArr) ) {
            objArr.forEach((primitive) => {
                res[primitive] = true;
            });
        }
        return res;
    };

    public static mapToArr = (obj: MAP<any>): any[] => {
        const res: any[] = [];
        if ( obj ) {
            for ( const id in obj ) {
                if ( obj.hasOwnProperty(id) ) {
                    res.push(obj[id]);
                }
            }
        }
        return res;
    };

    public static mapMapToArr = (obj: MAP<MAP<any>>): any[] => {
        const res: any[] = [];
        if ( obj ) {
            for ( const firstId in obj ) {
                if ( obj.hasOwnProperty(firstId) ) {
                    const internalMap = obj[firstId] || {};
                    for ( const secondId in internalMap ) {
                        if ( internalMap.hasOwnProperty(secondId) ) {
                            res.push(obj[firstId][secondId]);
                        }
                    }
                }
            }
        }
        return res;
    };

    public static mapMapToMap = (obj: MAP<MAP<any>>): MAP<any> => {
        const res: MAP<any> = {};
        if ( obj ) {
            for ( const firstId in obj ) {
                if ( obj.hasOwnProperty(firstId) ) {
                    const internalMap = obj[firstId] || {};
                    for ( const secondId in internalMap ) {
                        if ( internalMap.hasOwnProperty(secondId) ) {
                            res[secondId] = obj[firstId][secondId];
                        }
                    }
                }
            }
        }
        return res;
    };

    public static validConfigParams = (parameters: any[]): boolean => {
        let res = true;
        if ( Array.isArray(parameters) ) {
            for ( let i = 0; i < parameters.length; i++ ) {
                if ( parameters[i] === undefined ) {
                    res = false;
                    i = parameters.length;
                }
            }
            parameters.forEach((parameter) => {
                if ( parameter === undefined ) {
                    res = false;
                }
            });
        }
        else {
            res = false;
        }
        return res;
    }

    public static mapMapToMap_secondId = (obj: MAP<MAP<any>>): MAP<any> => {
        const res: MAP<any> = {};
        if ( obj ) {
            for ( const firstId in obj ) {
                if ( obj.hasOwnProperty(firstId) ) {
                    const internalMap = obj[firstId] || {};
                    for ( const secondId in internalMap ) {
                        if ( internalMap.hasOwnProperty(secondId) ) {
                            res[secondId] = obj[firstId][secondId];
                        }
                    }
                }
            }
        }
        return res;
    };

    public static prepareTimeStamp = (date): string => {
        let res = '';
        if ( date ) {
            date = new Date(date);
            const year = date.getFullYear();
            const month = (date.getMonth() + 1 < 10) ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
            const day = (date.getDate() < 10) ? '0' + date.getDate() : date.getDate();
            const hours = (date.getHours() < 10) ? '0' + date.getHours() : date.getHours();
            const minutes = (date.getMinutes() < 10) ? '0' + date.getMinutes() : date.getMinutes();
            const seconds = (date.getSeconds() < 10) ? '0' + date.getSeconds() : date.getSeconds();
            res = `${year}-${month}-${day}-${hours}-${minutes}-${seconds}`;
        }

        return res;
    };

}
