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

export type ENTITY_DATA = {
    id: string,
    lastAction: LAST_ACTION,
    version: number,

    collectionVersion?: number
};

export type ENTITY_ARR = any; // TODO change

