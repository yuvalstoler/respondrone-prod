import {get, set} from './safe';


export class ToasterData {

    type = 'info';

    message = '';
    title = '';

    options =
        {
            timeOut: 5000,
            positionClass: 'toast-top-right',
            preventDuplicates: true
        };

    tecnicalStatusesSaveConfig = {
        type: 'type',
        message: 'message',
        title: 'title',
        options: 'options',

        'options.timeOut': 'timeOut',
        'options.positionClass': 'positionClass',
        'options.preventDuplicates': 'preventDuplicates',

    };

    constructor(_data: Object = {}) {
        this.setValues(_data, this.tecnicalStatusesSaveConfig);
    }

    public setValues = (data, saveConfig: Object) => {
        for (const key in saveConfig) {
            if ( saveConfig.hasOwnProperty(key) && get(() => data[saveConfig[key]]) !== undefined ) {
                set(this, key, get(() => data[saveConfig[key]]));
            }
        }
    };

    public update = (data: Object) => {
        this.setValues(data, this.tecnicalStatusesSaveConfig);
    };


    public toJsonForUI = () => {
        return {
            message: this.message,
            title: this.title,
            options: this.options,
        };
    };

}
