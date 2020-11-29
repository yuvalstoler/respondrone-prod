import {IRest} from './IRest';

export type REST_ROUTER_CONFIG = { class: IRest, path: string };
export type ID_TYPE = string;

export enum LAST_ACTION {
    Insert = 'Insert',
    Update = 'Update',
    Delete = 'Delete',
}

// ====================================

export type GENERAL_RESPONSE = {
    success: boolean,
    description: string
};

export type REP_ENT_GEN_RESPONSE = {
    id: string,
    entVersion: number,
    collectionVersion: number
};

export type REP_COLLECTION_GEN_RESPONSE = {
    collectionVersion: number
};

// =====================================
export enum DISCOVERY_STATUS {
    Ok = 'Ok',
    Down = 'Down',
    Partial = 'Partial',
    Fault = 'Fault'
}

export type ENTITY_DATA = {
    id: string;
    name: string;
    api: string;
    ip: string;
    port: string;
    status: DISCOVERY_STATUS;
    system: string;
    lastAction: LAST_ACTION;
    version: number;
    keepAliveStatus: DISCOVERY_STATUS;

    collectionVersion?: number
};

export type ENTITY_ARR = any; // TODO change

export type ASYNC_RESPONSE<T = any> = { success: boolean, description?: string, data?: T };

export type LOG_DATA = {
    url: string,
    data: any,
    response: any,
    date: number
}
