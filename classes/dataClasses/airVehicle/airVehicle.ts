import {
    FR_STATUS,
    EVENT_DATA,
    GEOPOINT3D,
    FR_DATA,
    FR_DATA_UI,
    FR_TYPE,
    ID_TYPE,
    TIMESTAMP,
    FR_DATA_MD,
    FR_DATA_REP,
    AIR_VEHICLE_TYPE,
    OPERATIONAL_STATUS,
    COMM_STATUS,
    AV_DATA_MD,
    CAPABILITY, AV_DATA_UI, AV_DATA, AV_DATA_REP, GEOPOINT3D_SHORT,
} from '../../typings/all.typings';
import {DataUtility} from '../../applicationClasses/utility/dataUtility';

export class AirVehicle {

    id: ID_TYPE;
    type: AIR_VEHICLE_TYPE;
    location: GEOPOINT3D_SHORT;
    gpsQuality: number;
    energyLevel: number;
    remainingTimeFlight: number;
    heading: number;
    altitudeAGL: number;
    altitudeAsl: number;
    velocity: number;
    lastUpdateTimeFromDrone: TIMESTAMP;
    commStatus: COMM_STATUS;
    operationalStatus: OPERATIONAL_STATUS;
    capability: CAPABILITY[];
    routeId: string;
    name: string;

    linkedMissionId: ID_TYPE;
    modeDefine: AV_DATA_MD;

    constructor(data: AV_DATA_REP) {
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
    private setType = (data: AIR_VEHICLE_TYPE) => {
        this.type = data;
    };
    private setLocation = (data: GEOPOINT3D_SHORT) => {
        const res: boolean = true;// todo validate GEOPOINT3D | ADDRESS
        if ( res ) {
            this.location = data;
        }
    };
    private setLastUpdated = (data: TIMESTAMP) => {
        this.lastUpdateTimeFromDrone = data;
    };
    private setGpsQuality = (data: number) => {
        this.gpsQuality = data;
    };
    private setEnergyLevel = (data: number) => {
        this.energyLevel = data;
    };
    private setRemainingTimeFlight = (data: number) => {
        this.remainingTimeFlight = data;
    };
    private setHeading = (data: number) => {
        this.heading = data;
    };
    private setAltitudeAGL = (data: number) => {
        this.altitudeAGL = data;
    };
    private setAltitudeAsl = (data: number) => {
        this.altitudeAsl = data;
    };
    private setVelocity = (data: number) => {
        this.velocity = data;
    };
    private setCommStatus = (data: COMM_STATUS) => {
        this.commStatus = data;
    };
    private setOperationalStatus = (data: OPERATIONAL_STATUS) => {
        this.operationalStatus = data;
    };
    private setCapability = (data: CAPABILITY[]) => {
        this.capability = data;
    };
    private setRouteId = (data: any) => {
        this.routeId = data;
    };
    private setName = (data: string) => {
        this.name = data;
    };

    private setLinkedMissionId = (data: ID_TYPE) => {
        this.linkedMissionId = data;
    };




    public setValues = (data: Partial<AV_DATA_REP>, saveConfig: Object = this.saveConfig) => {
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



    public toJsonForUI = (): AV_DATA_UI => {
        return {
            id: this.id,
            type: this.type,
            location: this.location ? {latitude: this.location.lat, longitude: this.location.lon, altitude: this.location.alt} : undefined,
            gpsQuality: this.gpsQuality,
            energyLevel: this.energyLevel,
            remainingTimeFlight: this.remainingTimeFlight,
            heading: this.heading,
            altitudeAGL: this.altitudeAGL,
            altitudeAsl: this.altitudeAsl,
            velocity: this.velocity,
            lastUpdateTimeFromDrone: this.lastUpdateTimeFromDrone,
            commStatus: this.commStatus,
            operationalStatus: this.operationalStatus,
            capability: this.capability,
            routeId: this.routeId,
            linkedMissionId: this.linkedMissionId,
            name: this.name,

            missionName: undefined,
            modeDefine: undefined,
        };
    };


    saveConfig = {
        id: this.setId,
        type: this.setType,
        location: this.setLocation,
        gpsQuality: this.setGpsQuality,
        energyLevel: this.setEnergyLevel,
        remainingTimeFlight: this.setRemainingTimeFlight,
        heading: this.setHeading,
        altitudeAGL: this.setAltitudeAGL,
        altitudeAsl: this.setAltitudeAsl,
        velocity: this.setVelocity,
        lastUpdateTimeFromDrone: this.setLastUpdated,
        commStatus: this.setCommStatus,
        operationalStatus: this.setOperationalStatus,
        capability: this.setCapability,
        routeId: this.setRouteId,
        name: this.setName,
        linkedMissionId: this.setLinkedMissionId,
    };


}
