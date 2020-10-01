import {
    COMMENT_DATA,
    REPORT_TYPE,
} from '../../typings/all.typings';
import { DataUtility } from '../../applicationClasses/utility/dataUtility';

export class Comment {

    id: string = '';
    source: string;
    time: number;
    createdBy: string
    text: string;

    constructor(data: COMMENT_DATA) {
        if ( data ) {
            this.setValues(data, this.saveConfig);
        }
    }

    private setId = (data: any) => {
        if ( data !== undefined ) {
            const res: boolean = typeof data === 'string' || data instanceof String;
            if ( res ) {
                this.id = data;
            }
        }
        else {
            this.id = DataUtility.generateID();
        }
    };

    private setSource = (data: string) => {
        this.source = data;
    };
    private setTime = (data: number) => {
        this.time = data;
    };
    private setCreatedBy = (data: string) => {
        this.createdBy = data;
    };
    private setText = (data: string) => {
        this.text = data;
    };



    public setValues = (data: Partial<COMMENT_DATA>, saveConfig: Object = this.saveConfig) => {
        for ( const key in saveConfig ) {
            if ( saveConfig.hasOwnProperty(key) ) {
                if ( data.hasOwnProperty(key) ) {
                    if ( data[key] !== undefined ) {
                        if ( data !== undefined ) {
                            saveConfig[key](data[key]);
                        }
                    }
                    else if ( data.id === undefined ) {
                        saveConfig['id'](data['id']);
                    }
                }
            }
        }
    };


    public toJsonForSave = (): COMMENT_DATA => {
        return {
            id: this.id,
            source: this.source,
            time: this.time,
            createdBy: this.createdBy,
            text: this.text,

        };
    };

    saveConfig = {
        id: this.setId,
        source: this.setSource,
        time: this.setTime,
        createdBy: this.setCreatedBy,
        text: this.setText,

    };


}
