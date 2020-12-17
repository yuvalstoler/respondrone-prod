import {IRest} from "../dataClasses/interfaces/IRest";


export type MAP<T> = { [key: string]: T };

export type LOGIN_UI = {
    name: string;
    password: string;
    token?: string;
};

export type TOASTER_OPTIONS = Partial<{ timeOut: number, extendedTimeOut: number, positionClass: string, preventDuplicates: boolean, closeButton: boolean }>;

export type ID_TYPE = string;
export type ID_OBJ = { id: ID_TYPE };
export type IDs_OBJ = { ids: ID_TYPE[] };


export type ASYNC_RESPONSE<T = any> = { success: boolean, description?: string, data?: T };
export type REST_ROUTER_CONFIG = { class: IRest, path: string };


export enum NOTIFICATION_TYPE {success = 'success', error = 'error', info = 'info', warning = 'warning'}

export type NOTIFICATION = { type?: NOTIFICATION_TYPE, message: string, title: string };
export type NOTIFICATION_UI = NOTIFICATION & { options?: TOASTER_OPTIONS };

export type VERSION = {
    name: string,
    lastUpdate: string,
    lastUpdateNumber: number,
};

export type CARTESIAN1 = { x: number };
export type CARTESIAN2 = { x: number, y: number };
export type CARTESIAN3 = { x: number, y: number, z: number };

export type CARTESIAN2_VECTOR = [CARTESIAN2, CARTESIAN2];
export type CARTESIAN3_VECTOR = [CARTESIAN2, CARTESIAN2, CARTESIAN2];

export type GEOMETRY = { coordinates: POINT | POINT3D, type?: string };


// region Location
export type YXZ = { y: number, x: number, z: number };
export type YXZW = YXZ & { w: number };
export type POINT = [number, number];
export type SIZE = {width: number, height: number};
// @ts-ignore
export type POINT3D = [number, number, number?];
export type VECTOR = [POINT3D, POINT3D];
export type RECTANGLE = [POINT3D, POINT3D, POINT3D, POINT3D];

export enum BOOLEAN_NUMBER {
    true = 1,
    false = 0,
}

export type GEOPOINT = { latitude: number, longitude: number };
export type GEOPOINT3D_SHORT = { lat: number, lon: number, alt: number };
export type GEOPOINT3D = GEOPOINT & { altitude?: number };
export type ADDRESS = string;
export type POLYGON_GEOPOINT = GEOPOINT3D[];


export enum REPORT_TYPE {
//     unclassified = 'Unclassified',
//     fireAlarm = 'Fire Alarm',
//     flood = 'Flood',
//     roadAccident = 'road Accident',
//     roadBlock = 'road Block',
//     attackReport = 'Attack Report',
//     explosionReport = 'Explosion Report',
//
}

//
export enum EVENT_TYPE { // TODO - change data fields
//     general = 'general',
//     emergency = 'emergency',
//     criminal = 'criminal',
//     terror = 'terror',
//     accident = 'accident',
//     info = 'info',
}

export enum SOURCE_TYPE { // TODO - change data fields
    MRF = 'MFR',
    OSCC = 'OSCC',
}

export enum LOCATION_NAMES {
    noLocation = 'No location',
    address = 'Add an address',
    locationPoint = 'Add a location point',
    polygon = 'Create a polygon'
}

export enum PRIORITY {
    low = 'Low',
    middle = 'Medium',
    high = 'High'
}

export enum LOCATION_TYPE {
    none = 'none',
    address = 'address',
    locationPoint = 'locationPoint',
    polygon = 'polygon'
}

export type COMMENT = {
    source: string,
    time: number,
    text: string
}

export type REPORT_DATA = {
    id?: ID_TYPE,
    source: SOURCE_TYPE;
    time: number;
    createdBy: string,
    type: string, // REPORT_TYPE,
    priority: PRIORITY,
    description: string,
    locationType: LOCATION_TYPE;
    location?: GEOPOINT3D,
    address?: ADDRESS,
    media: FILE_FS_DATA[],
    mediaFileIds: MAP<boolean>,
    eventIds: string[],
    comments: COMMENT[],
    idView: string
};
export type REPORT_DATA_UI = REPORT_DATA & {
    events: LINKED_EVENT_DATA[],
    comments: COMMENT[],
    modeDefine: REPORT_DATA_MD,
};
export type LINKED_REPORT_DATA = {
    id: ID_TYPE,
    time: number,
    createdBy: string,
    type: string, // REPORT_TYPE,
    description: string,
    idView: string,
    modeDefine: REPORT_DATA_MD,
}
export type REPORT_DATA_MD = {
    styles: {
        icon: string,
        mapIcon: string,
        selectedIcon: string,
        iconSize: number
    },
    tableData: {
        id: TABLE_DATA_MD,
        time: TABLE_DATA_MD,
        message: TABLE_DATA_MD,
        priority: TABLE_DATA_MD,
        link: TABLE_DATA_MD,
        map: TABLE_DATA_MD,
        attachment: TABLE_DATA_MD,
    }
}

export type TABLE_DATA_MD = {
    type: 'image' | 'matIcon' | 'text' | 'date',
    data: any,
    color?: string
}

export type EVENT_DATA = { // TODO - change data fields
    id?: ID_TYPE,
    time: number,
    createdBy: string,
    title: string,
    type: string; // EVENT_TYPE,
    priority: PRIORITY,
    description: string,
    locationType: LOCATION_TYPE,
    location: GEOPOINT3D,
    address: ADDRESS,
    polygon: POINT3D[],
    reportIds: string[],
    comments: COMMENT[],
    idView: string
};
export type EVENT_DATA_UI = EVENT_DATA & {
    reports: LINKED_REPORT_DATA[],
    comments: COMMENT[],
    modeDefine: EVENT_DATA_MD,
};
export type LINKED_EVENT_DATA = {
    id: ID_TYPE,
    time: number,
    createdBy: string,
    type: string; // EVENT_TYPE,
    description: string,
    idView: string,
    modeDefine: EVENT_DATA_MD,
}
export type EVENT_DATA_MD = {
    styles: {
        icon: string,
        mapIcon: string,
        selectedIcon: string,
        iconSize: number
    },
    tableData: {
        id: TABLE_DATA_MD,
        time: TABLE_DATA_MD,
        message: TABLE_DATA_MD,
        priority: TABLE_DATA_MD,
        link: TABLE_DATA_MD,
        map: TABLE_DATA_MD,
    }
}

export type COMMENT_DATA = { // TODO - change data fields
    id?: ID_TYPE,
    source: string,
    time: number,
    createdBy: string,
    text: string,

};

export type TIMESTAMP = {
    timestamp: number
}


export type FR_DATA_TELEMETRY_REP = {
    timestamp: TIMESTAMP,
    FRs: FR_DATA_REP[],
}
export type FR_DATA_REP = {
    id: ID_TYPE;
    callSign: string;
    type: FR_TYPE;
    location: GEOPOINT3D_SHORT;
    lastUpdated: TIMESTAMP;
    online: boolean;
    status: FR_STATUS;
}
export type FR_DATA_TELEMETRY = {
    timestamp: TIMESTAMP,
    FRs: FR_DATA[]
}
export type FR_DATA = {
    id: ID_TYPE;
    callSign: string;
    type: FR_TYPE;
    location: GEOPOINT3D;
    lastUpdated: TIMESTAMP;
    online: boolean;
    status: FR_STATUS;
}
export type FR_DATA_UI = FR_DATA & {
    modeDefine: FR_DATA_MD,
}
export type FR_DATA_MD = {
    styles: {
        mapIcon: string,
        color: string,
        dotColor: string,
        iconSize: number
    },
    tableData: {
        id: TABLE_DATA_MD,
        status: TABLE_DATA_MD,
    }
}


export type AV_DATA_TELEMETRY_REP = {
    timestamp: TIMESTAMP,
    drones: AV_DATA_REP[]
}
export type AV_DATA_REP = {
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
    routeId?: string;
    name: string;
}
export type AV_DATA_TELEMETRY = {
    timestamp: TIMESTAMP,
    drones: AV_DATA[]
}
export type AV_DATA = {
    id: ID_TYPE;
    type: AIR_VEHICLE_TYPE;
    location: GEOPOINT3D;
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
}
export type AV_DATA_UI = AV_DATA & {
    modeDefine: AV_DATA_MD;
    missionRequestId: ID_TYPE;
}
export type AV_DATA_MD = {
    styles: {
        mapIcon: string,
        statusColor: string,
        iconSize: number,
        gpsIcon: string,
        gpsDescription: string,
        isDisabled: boolean,
    },
    data: {
        missionName: string,
        missionOptions: AV_OPTIONS
    }
}


export type GIMBAL_DATA_TELEMETRY = {
    timestamp: TIMESTAMP,
    gimbals: GIMBAL_DATA[]
}
export type GIMBAL_DATA = {
    id: ID_TYPE;
    droneId: ID_TYPE;
    AIMode: number;
    gimbalParameters: GIMBAL_PARAMS;
    visibleCameraParameters: VISIBLE_CAMERA_PARAMS;
    infraredCameraParameters: INFRARED_CAMERA_PARAMS;
    trackedEntity: number;
    cameraLookAtPoint: GEOPOINT3D_SHORT;
    cameraFootprint: { coordinates: GEOPOINT3D_SHORT[] };
    opticalVideoURL: string;
    infraredVideoURL: string;
}
export type GIMBAL_DATA_UI = GIMBAL_DATA & {
    modeDefine: GIMBAL_DATA_MD,
    lineFromAirVehicle: GEOPOINT3D_SHORT[]
};
export type GIMBAL_DATA_MD = {
    styles: {
        mapIcon: string,
        iconSize: number,
        color: string,
        fillColor: string
    }
}

export type MISSION_MODEL_UI = {
    missionType: MISSION_TYPE,
    airResources: ID_TYPE[],
    location: GEOPOINT3D_SHORT,
    polygon: POINT3D[],
    polyline: POINT3D[],
    frs: FR_DATA_UI[],
    frIds: ID_TYPE[],
    communicationType: COMM_RELAY_TYPE,
    missionDetails: {
        azimuth: number,
        distance: number,
        scan: {
            speed: SCAN_SPEED,
            overlapPercent: number,
            cameraFov: number
        }
    }
    description: string,
    comments: COMMENT[]
}


export enum MISSION_TYPE {
    CommRelay = 'CommRelay',
    Patrol = 'Patrol',
    Observation = 'Observation',
    Scan = 'Scan',
    Servoing = 'Servoing',
    Delivery = 'Delivery',
}

export type AV_OPTIONS = {
    [MISSION_TYPE.CommRelay]?: boolean,
    [MISSION_TYPE.Patrol]?: boolean,
    [MISSION_TYPE.Observation]?: boolean,
    [MISSION_TYPE.Scan]?: boolean,
    [MISSION_TYPE.Servoing]?: boolean,
    [MISSION_TYPE.Delivery]?: boolean
}

export enum MISSION_TYPE_TEXT {
    CommRelay = 'Communications relay mission request',
    Patrol = 'Patrol mission request',
    Observation = 'Observation mission request',
    Scan = 'Scan mission request',
    Servoing = 'Follow entity mission request',
    Delivery = 'Cargo drop mission request',
}


export type REP_RESPONSE =
    { success: boolean, description: string }
    | { id: string, entVersion: number, collectionVersion: number }


export enum COLLECITON_VERSION_TYPE {
    Mission = 'Mission',
    MissionRoute = 'MissionRoute',
    GraphicOverlay = 'GraphicOverlay',
};

export type COLLECTION_VERSIONS = {
    [MISSION_TYPE.CommRelay]: number,
    [MISSION_TYPE.Patrol]: number,
    [MISSION_TYPE.Observation]: number,
    [MISSION_TYPE.Scan]: number,
    [MISSION_TYPE.Servoing]: number,
    [MISSION_TYPE.Delivery]: number,
    [COLLECITON_VERSION_TYPE.Mission]: number,
    [COLLECITON_VERSION_TYPE.MissionRoute]: number
    [COLLECITON_VERSION_TYPE.GraphicOverlay]: number
}


export enum REP_ARR_KEY {
    CommRelay = 'commRelayMissionRequests',
    Patrol = 'followPathMissionRequests',
    Observation = 'observationMissionRequests',
    Scan = 'scanMissionRequests',
    Servoing = 'servoingMissionRequests',
    Delivery = 'deliveryMissionRequests',
    Mission = 'missions',
    MissionRoute = 'missionRoutes',
    GraphicOverlay = 'graphicOverlays'
}

export enum REP_OBJ_KEY {
    CommRelay = 'commRelayMissionRequest',
    Patrol = 'followPathMissionRequest',
    Observation = 'observationMissionRequest',
    Scan = 'scanMissionRequest',
    Servoing = 'servoingMissionRequest',
    Delivery = 'deliveryMissionRequest',
}


export type REP_ENTITY = {
    id: ID_TYPE;
    version: number;
    lastAction: LAST_ACTION;
}
export type COMM_RELAY_MISSION_REQUEST_REP = REP_ENTITY & {
    commRelayMissionRequest: COMM_RELAY_MISSION_REQUEST;
}
export type FOLLOW_PATH_MISSION_REQUEST_REP = REP_ENTITY & {
    followPathMissionRequest: FOLLOW_PATH_MISSION_REQUEST;
}
export type OBSERVATION_MISSION_REQUEST_REP = REP_ENTITY & {
    observationMissionRequest: OBSERVATION_MISSION_REQUEST;
}
export type SCAN_MISSION_REQUEST_REP = REP_ENTITY & {
    scanMissionRequest: SCAN_MISSION_REQUEST;
}
export type SERVOING_MISSION_REQUEST_REP = REP_ENTITY & {
    servoingMissionRequest: SERVOING_MISSION_REQUEST;
}
export type DELIVERY_MISSION_REQUEST_REP = REP_ENTITY & {
    deliveryMissionRequest: DELIVERY_MISSION_REQUEST;
}

export type MISSION_REQUEST_DATA = REP_ENTITY & {
    missionType: MISSION_TYPE,
    description: string,
    comments: COMMENT[],
    createdBy: string,
    time: number,
    idView: string,
    missionStatus: MISSION_STATUS_UI;
    source: SOURCE_TYPE;

    commRelayMissionRequest?: COMM_RELAY_MISSION_REQUEST;
    followPathMissionRequest?: FOLLOW_PATH_MISSION_REQUEST;
    observationMissionRequest?: OBSERVATION_MISSION_REQUEST;
    scanMissionRequest?: SCAN_MISSION_REQUEST;
    servoingMissionRequest?: SERVOING_MISSION_REQUEST;
    deliveryMissionRequest?: DELIVERY_MISSION_REQUEST;
}

export type MISSION_REQUEST_ACTION_OBJ = {
    missionRequestId: ID_TYPE,
    action: MISSION_REQUEST_ACTION,
    avIds?: string
}

export enum MISSION_REQUEST_ACTION {
    Accept = 'Accept',
    Approve = 'Approve',
    Reject = 'Reject',
    Cancel = 'Cancel',
    Complete = 'Complete',
}


export type MISSION_REQUEST_DATA_UI = MISSION_REQUEST_DATA & {
    modeDefine: MISSION_REQUEST_DATA_MD,
}

export type MISSION_ACTION_OPTIONS = {
    [MISSION_REQUEST_ACTION.Accept]?: boolean,
    [MISSION_REQUEST_ACTION.Approve]?: boolean,
    [MISSION_REQUEST_ACTION.Complete]?: boolean,
    [MISSION_REQUEST_ACTION.Cancel]?: boolean,
    [MISSION_REQUEST_ACTION.Reject]?: boolean,
}

export type MISSION_REQUEST_DATA_MD = {
    styles: {
        mapIcon: string,
        textColor: string,
        dotColor: string,
        iconSize: number,
        color: string,
        fillColor: string
    },
    tableData: {
        id: TABLE_DATA_MD,
        missionType: TABLE_DATA_MD,
        time: TABLE_DATA_MD,
        message: TABLE_DATA_MD,
        map: TABLE_DATA_MD
    },
    data: {
        textUI: { title: string, value: string }[],
        actionOptions: MISSION_ACTION_OPTIONS
    }
}


export type COMM_RELAY_MISSION_REQUEST = {
    droneId: ID_TYPE,
    commRelayType: COMM_RELAY_TYPE,
    // missionData:
    //     { point: GEOPOINT3D_SHORT } |
    //     { area: {coordinates: GEOPOINT3D_SHORT[]}} |
    //     { FRs: string[]},

    missionData: {
        point?: GEOPOINT3D_SHORT,
        area?: { coordinates: GEOPOINT3D_SHORT[] },
        FRs?: string[]
    },
    status: MISSION_STATUS
}
export type FOLLOW_PATH_MISSION_REQUEST = {
    droneId: ID_TYPE,
    polyline: { coordinates: GEOPOINT3D_SHORT[] },
    yawOrientation: YAW_ORIENTATION,
    gimbalAzimuth: number,
    status: MISSION_STATUS
}
export type OBSERVATION_MISSION_REQUEST = {
    droneId: ID_TYPE,
    observationPoint: GEOPOINT3D_SHORT,
    altitudeOffset: number,
    observationAzimuth: number,
    status: MISSION_STATUS
}
export type SCAN_MISSION_REQUEST = {
    droneId: ID_TYPE,
    polygon: { coordinates: GEOPOINT3D_SHORT[] },
    scanAngle: number,
    scanSpeed: SCAN_SPEED,
    overlapPercent: number,
    cameraFOV: number,
    status: MISSION_STATUS
}
export type SERVOING_MISSION_REQUEST = {
    droneId: ID_TYPE,
    targetId: ID_TYPE,
    targetType?: TARGET_TYPE,
    status: MISSION_STATUS
}
export type DELIVERY_MISSION_REQUEST = {
    droneId: ID_TYPE,
    status: MISSION_STATUS
}

export enum TARGET_TYPE {
    FR = 'FR',
    VideoTarget = 'VideoTarget',
}


export type MISSION_ROUTE_DATA_REP = {
    collectionVersion: number,
    [REP_ARR_KEY.MissionRoute]: MISSION_ROUTE_DATA[]
}
export type MISSION_ROUTE_DATA = REP_ENTITY & {
    requestId: ID_TYPE;
    missionId: ID_TYPE;
    missionType: MISSION_TYPE;
    route: PointOfRoute[];
    status: ROUTE_STATUS;
    time: number;
}
export type MISSION_ROUTE_DATA_UI = MISSION_ROUTE_DATA & {
    modeDefine: MISSION_ROUTE_DATA_MD
}
export type PointOfRoute = {
    point: GEOPOINT3D_SHORT,
    velocity: number,
    heading: number
}

export enum ROUTE_STATUS {
    Active = 'Active',
    NotActive = 'NotActive',
}

export type MISSION_ROUTE_DATA_MD = {
    styles: {
        isDotted: boolean,
        color: string
    },
    data: {
        missionName: string
    }
}

export type MISSION_DATA_REP = {
    collectionVersion: number,
    [REP_ARR_KEY.Mission]: MISSION_DATA[]
}
export type MISSION_DATA = REP_ENTITY & {
    requestId: ID_TYPE;
    missionType: MISSION_TYPE;
    missionMapOverlay: MISSION_MAP_OVERLAY;
    status: MISSION_STATUS;
    description: string;
}
export type MISSION_DATA_UI = MISSION_DATA & {
    modeDefine: MISSION_DATA_MD;
}
export type MISSION_DATA_MD = {
    styles: {
        mapIcon: string;
        polygonColor: string;
        iconSize: number;
    }
}


export type GRAPHIC_OVERLAY_DATA_REP = {
    collectionVersion: number,
    [REP_ARR_KEY.GraphicOverlay]: GRAPHIC_OVERLAY_DATA[]
}
export type GRAPHIC_OVERLAY_DATA = REP_ENTITY & {
    name: string;
    // shape: GEOPOINT3D_SHORT | {coordinates: GEOPOINT3D_SHORT[]};
    shape: {
        lat?: number,
        lon?: number,
        alt?: number,
        coordinates?: GEOPOINT3D_SHORT[]
    }
    color: GRAPHIC_OVERLAY_COLOR;
    type: GRAPHIC_OVERLAY_TYPE;
    creationTime: TIMESTAMP;
    lastUpdateTime: TIMESTAMP;
    metadata: METADATA_OBJ[]
}
export type GRAPHIC_OVERLAY_DATA_UI = GRAPHIC_OVERLAY_DATA & {
    modeDefine: GRAPHIC_OVERLAY_DATA_MD;
}
export type GRAPHIC_OVERLAY_DATA_MD = {
    styles: {
        mapIcon: string;
        iconSize: number;
        color: string;
        fillColor: string;
    }
}
export type METADATA_OBJ = {
    name: string,
    value: string
}

export enum GRAPHIC_OVERLAY_COLOR {
    Red = 'Red',
    Green = 'Green',
    Blue = 'Blue',
    Black = 'Black',
    White = 'White',
    Yellow = 'Yellow',
    Grey = 'Grey',
    Default = 'Default',
}

export enum GRAPHIC_OVERLAY_TYPE {
    FireLine = 'FireLine',
    Person = 'Person',
    Vehicle = 'Vehicle',
    NetworkCoverage = 'NetworkCoverage',
    General = 'General',
    Building = 'Building'
}


export type TMM_RESPONSE = {
    success: boolean;
    description: boolean,
    entityId: ID_TYPE,
}

export type MISSION_MAP_OVERLAY = {
    areas: { coordinates: GEOPOINT3D_SHORT[] }[];
    point: GEOPOINT3D_SHORT;
}

export enum COMM_RELAY_TYPE {
    Fixed = 'Fixed',
    Area = 'Area',
    Follow = 'Follow',
}

export enum COMM_RELAY_TYPE_TEXT {
    Fixed = 'Fixed location',
    Area = 'Area coverage',
    Follow = 'Follow FRs',
}

export enum YAW_ORIENTATION {
    Body = 'Body',
    North = 'North'
}

export enum LAST_ACTION {
    Insert = 'Insert',
    Update = 'Update',
    Delete = 'Delete',
}


export enum MISSION_STATUS {
    Pending = 'Pending',
    InProgress = 'InProgress',
    Completed = 'Completed',
    Cancelled = 'Cancelled'
}

export enum MISSION_STATUS_UI {
    Pending = 'Pending',
    InProgress = 'InProgress',
    Completed = 'Completed',
    Cancelled = 'Cancelled',

    New = 'New',
    WaitingForApproval = 'WaitingForApproval',
    Approved = 'Approved',
    Rejected = 'Rejected'

}

export enum SCAN_SPEED {
    Low = 'Low',
    Medium = 'Medium',
    High = 'High'
}


export enum FR_TYPE {
    police = 'Police',
    fireFighter = 'FireFighter',
    paramedic = 'Med'
}

export enum AIR_VEHICLE_TYPE {
    Alpha = 'Alpha',
    Dji = 'Dji',
    Pixhawk = 'Pixhawk',
}

export enum COMM_STATUS {
    OK = 'OK',
    NoComm = 'NoComm',
}

export enum OPERATIONAL_STATUS {
    Ready = 'Ready',
    OnMission = 'OnMission',
    NotActive = 'NotActive',
    Fail = 'Fail',
    RH = 'RH',
    Land = 'Land',
    Emergency = 'Emergency',
}

export enum CAPABILITY {
    Surveillance = 'Surveillance',
    Patrol = 'Patrol',
    Scan = 'Scan',
    Delivery = 'Delivery',
    CommRelay = 'CommRelay',
}


export type GIMBAL_PARAMS = {
    pitch: number;
    yaw: number;
}

export type VISIBLE_CAMERA_PARAMS = {
    zoomVisibleCamera: number;
}

export type INFRARED_CAMERA_PARAMS = {
    zoomInfraredCamera: number;
    colorPaletteInfraredCamera: COLOR_PALETTE_INFRARED_CAMERA
}

export enum COLOR_PALETTE_INFRARED_CAMERA {
    WhiteHot = 'WhiteHot',
    BlackHot = 'BlackHot',
    Rainbow = 'Rainbow',
    RainHC = 'RainHC',
    IronBow = 'IronBow',
    Lava = 'Lava',
    Arctic = 'Arctic',
    GlowBow = 'GlowBow',
    GradedFire = 'GradedFire',
    Hottest = 'Hottest',
}

export type GIMBAL_ACTION = {
    droneId: string,
    requestorID: string,
    parameters: GIMBAL_PARAMS | VISIBLE_CAMERA_PARAMS | INFRARED_CAMERA_PARAMS
}

export enum FR_STATUS {
    busy = 'Busy',
    available = 'Available',
}

export enum TASK_ACTION {
    accept = 'accept',
    reject = 'reject',
    complete = 'complete',
    cancel = 'cancel'
}

export type USER_TASK_ACTION = {
    userId: ID_TYPE,
    taskId: ID_TYPE,
    action: TASK_ACTION
}

export type OSCC_TASK_ACTION = {
    taskId: ID_TYPE,
    action: TASK_ACTION
}

export type TASK_DATA = {
    id: ID_TYPE;
    time: number;
    createdBy: string;
    title: string;
    type: string; // TASK_TYPE;
    priority: PRIORITY;
    description: string;
    resources: string;
    status: TASK_STATUS;
    geographicInstructions: GEOGRAPHIC_INSTRUCTION[];
    assigneeIds: ID_TYPE[];
    comments: COMMENT[]
    idView: string;
    isSendToMobile: boolean;
    taskActionByUser: MAP<TASK_ACTION> // key - userId
}

export type TASK_DATA_UI = TASK_DATA & {
    assignees: FR_DATA_UI[],
    modeDefine: TASK_DATA_MD,
}
export type TASK_DATA_MD = {
    styles: {
        dotColor: string,
        textColor: string,
    },
    tableData: {
        priority: TABLE_DATA_MD,
        assignees: TABLE_DATA_MD,
    }
}

export type GEOGRAPHIC_INSTRUCTION_MD = {
    styles: {
        mapIcon: string,
        iconSize: number
    }
}

export enum GEOGRAPHIC_INSTRUCTION_TYPE {
    arrow = 'Arrow',
    address = 'Address',
    point = 'Point',
    polygon = 'Polygon',
    polyline = 'Polyline'
}

export type GEOGRAPHIC_INSTRUCTION = {
    id: string,
    type: GEOGRAPHIC_INSTRUCTION_TYPE,
    location: GEOPOINT3D,
    description: string,
    address: ADDRESS,
    arrow: POINT[] | POINT3D[],
    polygon: POINT3D[],
    polyline: POINT3D[],
    modeDefine: GEOGRAPHIC_INSTRUCTION_MD
}

export enum TASK_STATUS {
    pending = 'Pending',
    inProgress = 'InProgress',
    rejected = 'Rejected',
    completed = 'Completed',
    cancelled = 'Cancelled'
}


// export enum TASK_TYPE { // TODO - change data fields
//     general = 'general',
//     rescue = 'rescue',
//     fire = 'fire'
// }

export enum MEDIA_TYPE {
    unknown = 'unknown',
    image = 'image',
    video = 'video',
}

export type FILE_FS_DATA = {
    thumbnail: string,
    url: string,
    id: ID_TYPE,
    type: MEDIA_TYPE,

    fullUrl?: string,
    fullThumbnail?: string
};

export enum FILE_STATUS {
    unknown = 'unknown',
    inProcess = 'inProcess',
    downloaded = 'downloaded',
    error = 'error',
    notFund = 'notFund',
    needToDownload = 'needToDownload',
}

export type FILE_DB_DATA = {
    id: ID_TYPE,
    type: MEDIA_TYPE,
    fileName: string,
    fsName: string,
    fsPath: string,
    fileStatus: FILE_STATUS,
};

export type FILE_DB_FS_DATA = {
    fileDbData: FILE_DB_DATA,
    fileFsData: FILE_FS_DATA
} ;

export type UPDATE_FILE_STATUS = {
    id: ID_TYPE,
    fileStatus: FILE_STATUS,

};
export type FILE_GW_DATA = FILE_DB_DATA & {
    byteArray: string,

};

export enum TASK_TYPE {
    fireInTheCity = 'fireInTheCity',
    carAccident = 'carAccident',
    forestFire = 'forestFire',
};


export enum SOCKET_IO_CLIENT_TYPES {
    MG = 'MG',
    CCG = 'CCG',
    FRS = 'FRS',
    MS = 'MS',
    GS = 'GS',
    VideoServer = 'VideoServer'
}

export enum SOCKET_CLIENT_TYPES {
    DroneTelemetrySenderRep = 'DroneTelemetrySenderRep',
    FRTelemetryReceiverRep = 'FRTelemetryReceiverRep',
    GimbalTelemetrySenderRep = 'GimbalTelemetrySenderRep',
}

export type BLOB = {
    trackId: string,
    trackBB: {
        xMin: number,
        xMax: number,
        yMin: number,
        yMax: number
    }
}

export type BLOB_DATA = {
    time: string,
    unixtimestamp: string,
    width: number,
    height: number,
    bb: BLOB[],
    droneGPS: GEOPOINT3D_SHORT
}
