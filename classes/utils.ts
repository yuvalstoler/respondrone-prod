import {get} from './applicationClasses/safe';

export class Utils {
    static setValues(data: Object, config: Object): Object {
        const newObject: Object = {};
        let isValid: boolean = true;

        for (const key in config) {
            if (config.hasOwnProperty(key)) {

                if (data.hasOwnProperty(key)
                    && get(() => data[key]) !== undefined) {

                    if (config[key].type === 'number') {
                        if (Utils.isNum(data[key])) {
                            newObject[key] = +data[key];
                        }
                        else {
                            if (config[key].required) {
                                newObject[key] = undefined;
                                isValid = false;
                            }
                            else {
                                newObject[key] = config[key].default;
                            }
                        }
                    }

                    else if (config[key].type === 'boolean') {
                        if (Utils.isBool(data[key])) {
                            newObject[key] = data[key];
                        }
                        else {
                            if (config[key].required) {
                                newObject[key] = undefined;
                                isValid = false;
                            }
                            else {
                                newObject[key] = config[key].default;
                            }
                        }
                    }

                    else if (config[key].type === 'string') {
                        if (Utils.isString(data[key])) {
                            newObject[key] = data[key];
                        }
                        else {
                            if (config[key].required) {
                                newObject[key] = undefined;
                                isValid = false;
                            }
                            else {
                                newObject[key] = config[key].default;
                            }
                        }
                    }

                    else if (config[key].type === 'array') {
                        if (Array.isArray(data[key]) && data[key].length >= config[key].min) {
                            newObject[key] = [];
                            data[key].forEach((el, i) => {

                                const obj: any = Utils.setValues(data[key][i], config[key].objType.config);
                                if (!obj.isValid) {
                                    isValid = obj.isValid;
                                }
                                newObject[key][i] = obj.obj;
                            });
                        }
                        else {
                            if (config[key].required) {
                                newObject[key] = undefined;
                                isValid = false;
                            }
                            else {
                                newObject[key] = config[key].default;
                            }
                        }
                    }

                    else if (config[key].type === 'object') {
                        const obj: any = Utils.setValues(data[key], config[key].objType.config);
                        if (!obj.isValid) {
                            isValid = obj.isValid;
                        }
                        if (obj.obj) {

                            newObject[key] = obj.obj;
                        }
                        else {
                            if (config[key].required) {
                                newObject[key] = undefined;
                                isValid = false;
                            }
                            else {
                                newObject[key] = config[key].default;
                            }
                        }
                    }
                    /*else if (config[key].type == 'enum') {
                        const obj: any = Utils.setValues(data[key], config[key].objType.config);
                        if (!obj.isValid) {
                            isValid = obj.isValid;
                        }
                        if (obj.obj) {

                            newObject[key] = obj.obj;
                        }
                        else {
                            if (config[key].required) {
                                newObject[key] = undefined;
                                isValid = false;
                            }
                            else {
                                newObject[key] = config[key].default;
                            }
                        }
                    }

                    else if (config[key].type === 'enum') {
                        if (Utils.isString(data[key])) {
                            newObject[key] = data[key];
                        }
                        else {
                            if (config[key].required) {
                                newObject[key] = undefined;
                                isValid = false;
                            }
                            else {
                                newObject[key] = config[key].default;
                            }
                        }
                    }*/
                }
                else {
                    if (config[key].required) {
                        newObject[key] = undefined;
                        isValid = false;
                    }
                    else {
                        newObject[key] = config[key].default;
                    }
                }
            }
        }

        return {isValid: isValid, obj: newObject};
    }

    static isNum(in_: any): boolean {
        if (typeof (in_) !== 'boolean') {
            if (+in_ < 0 || +in_ >= 0) {
                return true;
            }
        }
        return false;
    }

    static isBool(in_: any): boolean {
        if (typeof in_ === 'boolean') {
            return true;
        }
        else {
            return false;
        }
    }

    static isString(in_: any): boolean {
        if (typeof in_ === 'string' || in_ instanceof String) {
            return true;
        }
        else {
            return false;
        }
    }
}
