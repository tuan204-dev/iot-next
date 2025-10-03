export interface IActionHistory {
    id: number;
    action_id: number;
    actuator_id: number;
    timestamp: string;
    status: string;
    action: {
        id: number;
        device_id: number;
        name: string;
        state: string;
    };
    actuator: {
        id: number;
        device_id: number;
        name: string;
        state: string;
    };
}