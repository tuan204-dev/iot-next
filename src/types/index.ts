export interface IPaginatedResponse<T> {
    data: T[];
    pagination: {
        total: number;
        page: number;
        size: number;
        totalPages: number;
    }
}

export interface ISensorData {
    id: number;
    sensor_id: number;
    value: number;
    unit: string;
    timestamp: string;
    sensor: ISensor;
}

export interface ISensor {
    id: number;
    name: string;
}

export interface IRecentSensorDataItem {
    timestamp: string;
    value: number;
}

export interface IRecentSensorData {
    temperature: IRecentSensorDataItem[];
    humidity: IRecentSensorDataItem[];
    light: IRecentSensorDataItem[];
}