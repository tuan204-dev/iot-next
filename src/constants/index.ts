export enum UNITS {
    '°C' = '°C',
    '%' = '%',
    'lx' = 'lx',
}

export enum ACTUATOR_IDS {
    LED = 3,
    FAN = 4,
    AIR_CONDITIONER = 5,
}

export const SENSOR_LIMITS = {
    TEMPERATURE: {
        MIN: 15,
        MAX: 30,
    },
    HUMIDITY: {
        MIN: 30,
        MAX: 80,
    },
    LIGHT: {
        MIN: 30,
        MAX: 1000,
    },
} as const


