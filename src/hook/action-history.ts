import { getDeviceCountDay } from '@/servers/action-history';
import useSWR from 'swr';

export const useDayCount = () => {
    const { data, error, isLoading, isValidating, mutate } = useSWR('/action-histories/device-counts-today', getDeviceCountDay);

    return {
        deviceCount: data,
        isLoading,
        isError: !!error,
        isValidating,
        mutate
    };
}