'use client'
import RealtimeData from '@/components/RealtimeData'
import SensorDataTrend from '@/components/SensorDataTrend'
import { ACTUATOR_IDS } from '@/constants'
import { triggerDevice } from '@/servers'
import { getLastActions } from '@/servers/actions'
import { ping } from '@/servers/device'
import { getRecentSensorData } from '@/servers/sensor-data'
import { IRecentSensorData } from '@/types'
import { Spin, Switch } from 'antd'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useEffect, useState } from 'react'
import { useLocalStorage } from 'usehooks-ts'
import toast from 'react-hot-toast'


dayjs.extend(relativeTime);

export interface SensorData {
    temperature: number
    humidity: number
    light: number
}

const HomePage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [waitingConnect, setWaitingConnect] = useState(false);


    // Device control states
    const [isSwitchingLed, setIsSwitchingLed] = useState(false);
    const [isSwitchingFan, setIsSwitchingFan] = useState(false);
    const [isSwitchingAirConditioner, setIsSwitchingAirConditioner] = useState(false);

    const [isLedOn, setIsLedOn] = useState(false);
    const [isFanOn, setIsFanOn] = useState(false);
    const [isAirConditionerOn, setIsAirConditionerOn] = useState(false);

    const [lastChangeLed, setLastChangeLed] = useLocalStorage<Date | null>('lastChangeLed', null);
    const [lastChangeFan, setLastChangeFan] = useLocalStorage<Date | null>('lastChangeFan', null);
    const [lastChangeAirConditioner, setLastChangeAirConditioner] = useLocalStorage<Date | null>('lastChangeAirConditioner', null);

    const [recentSensorData, setRecentSensorData] = useState<IRecentSensorData>({humidity: [], light: [], temperature: []} as IRecentSensorData);

    const handleSetLastStates = async () => {
        const lastActions = await getLastActions();

        const ledAction = lastActions.find(action => action.actuatorId === ACTUATOR_IDS.LED);
        const fanAction = lastActions.find(action => action.actuatorId === ACTUATOR_IDS.FAN);
        const airConditionerAction = lastActions.find(action => action.actuatorId === ACTUATOR_IDS.AIR_CONDITIONER);

        if (ledAction?.state === 'on') {
            setIsLedOn(true);
        } else {
            setIsLedOn(false);
        }

        if (fanAction?.state === 'on') {
            setIsFanOn(true);
        } else {
            setIsFanOn(false);
        }

        if (airConditionerAction?.state === 'on') {
            setIsAirConditionerOn(true);
        } else {
            setIsAirConditionerOn(false);
        }
    }

    const fetchRecentData = async () => {
        try {
            const data = await getRecentSensorData();
            setRecentSensorData(data);
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        (async () => {
            try {
                setIsLoading(true);
                const isConnected = await ping();

                if (isConnected) {
                    await Promise.all([handleSetLastStates(), fetchRecentData()]);
                } else {
                    setWaitingConnect(true);

                    const interval = setInterval(async () => {
                        const isConnected = await ping();
                        if (isConnected) {
                            clearInterval(interval);
                            await Promise.all([handleSetLastStates(), fetchRecentData()]);
                            setWaitingConnect(false);
                        }
                    }, 5000);
                }
            } catch (e) {
                console.log(e);
                setWaitingConnect(true);
            } finally {
                setIsLoading(false);
            }
        })()
    }, [])

    useEffect(() => {
        const interval = setInterval(async () => {
            const isConnected = await ping();
            if (!isConnected) {
                setWaitingConnect(true);
            } else if (waitingConnect) {
                console.log('im here')
                setWaitingConnect(false);
                await handleSetLastStates();
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [waitingConnect])



    const handleSwitchLed = async (isTurnOn: boolean) => {
        try {
            setIsSwitchingLed(true);
            const res = await triggerDevice({
                actionId: isTurnOn ? 1 : 2,
                actuatorId: 3
            })

            if (!res.status) {
                throw new Error('Failed to trigger device');
            }

            setIsLedOn(isTurnOn);

            setLastChangeLed(new Date());
            toast.success(`LED turned ${isTurnOn ? 'on' : 'off'}`);
        } catch (e) {
            console.log(e);
            toast.error('Failed to switch LED');
        } finally {
            setIsSwitchingLed(false);
        }
    }

    const handleSwitchFan = async (isTurnOn: boolean) => {
        try {
            setIsSwitchingFan(true);

            const res = await triggerDevice({
                actionId: isTurnOn ? 3 : 4,
                actuatorId: 4
            })

            if (!res.status) {
                throw new Error('Failed to trigger device');
            }
            setIsFanOn(isTurnOn);

            setLastChangeFan(new Date());
            toast.success(`Fan turned ${isTurnOn ? 'on' : 'off'}`);
        } catch (e) {
            console.log(e);
            toast.error('Failed to switch Fan');
        } finally {
            setIsSwitchingFan(false);
        }
    }

    const handleSwitchAirConditioner = async (isTurnOn: boolean) => {
        try {
            setIsSwitchingAirConditioner(true);

            const res = await triggerDevice({
                actionId: isTurnOn ? 5 : 6,
                actuatorId: 5
            })

            if (!res.status) {
                throw new Error('Failed to trigger device');
            }
            setIsAirConditionerOn(isTurnOn);

            setLastChangeAirConditioner(new Date());
            toast.success(`Air Purifier turned ${isTurnOn ? 'on' : 'off'}`);
        } catch (e) {
            console.log(e);
            toast.error('Failed to switch Air Purifier');
        } finally {
            setIsSwitchingAirConditioner(false);
        }
    }

    if (isLoading) {
        return (
            <div className='h-screen w-screen grid place-items-center'>
                <Spin size='large' />
            </div>
        )
    }

    if (waitingConnect) {
        return (
            <div className='h-screen w-screen grid place-items-center'>
                <div className='flex flex-col gap-y-8'>
                    <Spin size='large' />
                    <p className='text-gray-500'>Waiting for device to connect...</p>
                </div>
            </div>
        )
    }

    return (
        <main className="flex-1 flex flex-col gap-6 p-6 bg-gray-50 h-screen">
            {/* Cards grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <RealtimeData setRecentSensorData={setRecentSensorData} />
            </div>
            {/* Chart section */}
            <div className='gap-6 flex-1 grid grid-cols-3'>
                <div className='col-span-2'>
                    <SensorDataTrend recentSensorData={recentSensorData} />
                </div>
                <div className='gap-6 grid grid-rows-3'>
                    {/* Lamp control card */}
                    <div className="bg-white rounded-xl p-6 card-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Led</p>
                                <p className="mt-1 text-lg font-semibold text-gray-900">
                                    Led Room
                                </p>
                            </div>
                            <Switch checked={isLedOn} onChange={handleSwitchLed} loading={isSwitchingLed} />
                        </div>
                        <div className="mt-4">
                            {lastChangeLed &&
                                <div className="flex items-center text-sm text-gray-500">
                                    <i className="fas fa-clock mr-1" />
                                    <span>Last changed: {dayjs(lastChangeLed).fromNow()}</span>
                                </div>
                            }
                        </div>
                    </div>
                    {/* Fan control card */}
                    <div className="bg-white rounded-xl p-6 card-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Fan</p>
                                <p className="mt-1 text-lg font-semibold text-gray-900">
                                    Bedroom
                                </p>
                            </div>
                            <Switch checked={isFanOn} onChange={handleSwitchFan} loading={isSwitchingFan} />
                        </div>
                        <div className="mt-4">
                            {lastChangeFan && (
                                <div className="flex items-center text-sm text-gray-500">
                                    <i className="fas fa-clock mr-1" />
                                    <span>Last changed: {dayjs(lastChangeFan).fromNow()}</span>
                                </div>
                            )}
                        </div>
                    </div>
                    {/* Air control card */}
                    <div className="bg-white rounded-xl p-6 card-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Air Conditioner</p>
                                <p className="mt-1 text-lg font-semibold text-gray-900">Office</p>
                            </div>
                            <Switch checked={isAirConditionerOn} onChange={handleSwitchAirConditioner} loading={isSwitchingAirConditioner} />
                        </div>
                        <div className="mt-4">
                            {lastChangeAirConditioner && (
                                <div className="flex items-center text-sm text-gray-500">
                                    <i className="fas fa-clock mr-1" />
                                    <span>Last changed: {dayjs(lastChangeAirConditioner).fromNow()}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default HomePage