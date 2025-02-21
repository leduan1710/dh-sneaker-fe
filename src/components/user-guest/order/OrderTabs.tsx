import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useTranslation } from 'react-i18next';
import { blue } from '@mui/material/colors';
import OrderItem from './OrderItem';
import { useLocation } from 'react-router-dom';
interface OrderTabsProps {
    listOrder: any;
    getDataOrder: any;
}
const OrderTabs: React.FC<OrderTabsProps> = (props) => {
    const { listOrder, getDataOrder } = props;
    const location = useLocation();
    const indexTabs = location.state ? location.state.indexTabs : 0;
    const [listOrderCurrent, setListOrderCurrent] = useState<any>(listOrder);
    const { t } = useTranslation();
    const [value, setValue] = React.useState(indexTabs);
    const [isReq, setIsReq] = useState<boolean>(false);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
    const getListOrderByStatus = (status: string) => {
        return listOrderCurrent.filter((item: any) => item.status == status);
    };

    const listOrder_Show = (value: number) => {
        let listOrderByStatus: any = [];
        if (value == 0) {
            listOrderByStatus = getListOrderByStatus('PROCESSING');
        } else if (value == 1) {
            listOrderByStatus = getListOrderByStatus('CONFIRMED');
        } else if (value == 2) {
            listOrderByStatus = getListOrderByStatus('DELIVERING');
        } else if (value == 3) {
            listOrderByStatus = getListOrderByStatus('PROCESSED');
        } else if (value == 4) {
            listOrderByStatus = getListOrderByStatus('CANCEL');
        }
        return (
            <div>
                {listOrderByStatus.length > 0 ? (
                    listOrderByStatus.map((order: any, index: number) => (
                        <OrderItem key={order.id} order={order} setValueTabs={setValue} setIsReq={setIsReq} />
                    ))
                ) : (
                    <div className="flex items-center justify-center box-shadow rounded-xl mt-6 pb-6 pt-6">
                        <img src={require('../../../static/empty-order.png')} />
                    </div>
                )}
            </div>
        );
    };
    useEffect(() => {
        if (isReq) {
            getDataOrder();
            setIsReq(false);
        }
    }, [isReq]);
    useEffect(() => {
        setListOrderCurrent(listOrder);
    }, [listOrder]);
    useEffect(() => {
        if (location.state) {
            const { indexTabs, ...newState } = location.state;
            location.state = newState;
        }
        if (indexTabs != undefined) setValue(indexTabs);
    }, [indexTabs]);
    return (
        <>
            <div className="pb-8 border-b border-gray-300 box-shadow rounded-br-full rounded-bl-full bg-blue-100">
                <Box sx={{ width: '100%' }}>
                    <Tabs value={value} onChange={handleChange} centered>
                        <Tab style={{ textTransform: 'none', fontWeight: 'bold' }} label={t('order.Processing')} />
                        <Tab style={{ textTransform: 'none', fontWeight: 'bold' }} label={t('order.Confirmed')} />
                        <Tab style={{ textTransform: 'none', fontWeight: 'bold' }} label={t('order.Delivering')} />
                        <Tab style={{ textTransform: 'none', fontWeight: 'bold' }} label={t('order.Processed')} />
                        <Tab style={{ textTransform: 'none', fontWeight: 'bold' }} label={t('order.Cancel')} />
                    </Tabs>
                </Box>
            </div>
            <div className=""> {listOrder_Show(value)}</div>
        </>
    );
};

export default OrderTabs;
