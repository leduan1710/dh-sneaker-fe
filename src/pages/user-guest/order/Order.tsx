import React, { useEffect, useState } from 'react';
import LeftNav from '../../../components/user-guest/info-user/LeftNav';
import { useSelector, useStore } from 'react-redux';
import { ReducerProps } from '../../../reducers/ReducersProps';
import { PostApi } from '../../../untils/Api';
import OrderTabs from '../../../components/user-guest/order/OrderTabs';
import { change_is_loading } from '../../../reducers/Actions';
import { socket_IO_Client } from '../../../routes/MainRoutes';

const Order: React.FC<any> = (props) => {
    const user = useSelector((state: ReducerProps) => state.user);
    const [listOrder, setListOrder] = useState<any>([]);
    const [isReq, setIsReq] = useState<boolean>(false);
    const store = useStore();
    const getDataOrder = async () => {
        store.dispatch(change_is_loading(true));
        const orders = await PostApi('/user/order-many', localStorage.getItem('token'), {
            listOrderId: user.orderIdList,
        });
        if (orders.data.message == 'Success') {
            setListOrder(orders.data.orders);
        }
        setIsReq(false);
        store.dispatch(change_is_loading(false));
    };
    useEffect(() => {
        if (user.id && user.orderIdList) {
            getDataOrder();
        }
    }, [user]);

    // useEffect(() => {
    //     socket_IO_Client.on('reqNotification', (data) => {
    //         setIsReq(true);
    //     });
    // }, []);
    // useEffect(() => {
    //     if (user.id && user.orderIdList) {
    //         getDataOrder();
    //     }
    // }, [isReq]);

    return (
        <>
            <div className="container marginTop">
                <div className="grid grid-cols-4 gap-4">
                    <div className="hidden lg:block col-span-1 bg-white box-shadow rounded-xl">
                        <LeftNav index={3} />
                    </div>
                    <div className="col-span-4 lg:col-span-3">
                        {listOrder.length > 0 ? (
                            <OrderTabs listOrder={listOrder} getDataOrder={getDataOrder} />
                        ) : (
                            <>Chưa có đơn hàng nào</>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Order;
