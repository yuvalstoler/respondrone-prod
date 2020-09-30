// use it like this:
// getSafe(() => obj.a.lot.of.properties);
//
//or add an optional default value:
// getSafe(() => obj.a.lot.of.properties, 'nothing');

function getSafe(fn: () => any, defaultVal?: any) {
    if (!fn) {
        console.warn('getSafe: undefined');
        return defaultVal;
    }

    try {
        const result =  fn();
        return (result !== undefined) ? result : defaultVal;
    } catch (e) {
        if (typeof fn !== 'function') {
            console.warn('getSafe error: \'', fn, '\' is not a function');
            return defaultVal;
        }
        const string = fn.toString();
        const search = string.substr(21, string.length - 24);
        console.warn('getSafe cant get:', search);
        return defaultVal;
    }
}

function getNoWarning(fn: () => any, defaultVal?: any) {
    try {
        return fn();
    }
    catch (e) {
        return defaultVal;
    }
}

function setSafe(obj: {}, props: string | Array<string>, value: any): boolean {
    if (typeof props == 'string') {
        props = props.split('.');
    }

    const lastProp = props.pop();
    if (!lastProp) {
        return false;
    }
    let thisProp;
    while ((thisProp = props.shift())) {
        if (typeof obj[thisProp] == 'undefined') {
            obj[thisProp] = {};
        }
        obj = obj[thisProp];
        if (!obj || typeof obj != 'object') {
            return false;
        }
    }

    try {
        obj[lastProp] = value;
    }
    catch (e) {

    }
    return true;
}


export const get = getSafe;
export const getx = getNoWarning;
export const set = setSafe;