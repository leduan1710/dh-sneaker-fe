import React, { useEffect, useState } from 'react';
import { GetApi, GetGuestApi, PostApi } from '../../../untils/Api';
import { useSelector, useStore } from 'react-redux';
import { change_is_loading } from '../../../reducers/Actions';
import SubtitlesIcon from '@mui/icons-material/Subtitles';
import { useTranslation } from 'react-i18next';
import OrderDetailItem from './OrderDetailItem';
import { formatPrice, toastSuccess, toastWarning } from '../../../untils/Logic';
import { Button } from '../../ComponentsLogin';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';
import { AlertChangeOrder, AlertChangeOrderRefund } from '../../alert/Alert';
import { Divider } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { ReducerProps } from '../../../reducers/ReducersProps';
interface OrderItemProps {
    order: any;
    setValueTabs: any;
    setIsReq: any;
}
const OrderItem: React.FC<OrderItemProps> = (props) => {
    const { order, setValueTabs, setIsReq } = props;
    const { t } = useTranslation();
    const [listOrderDetail, setListOrderDetail] = useState<any>(undefined);
    const [shop, setShop] = useState<any>(undefined);
    const [ship, setShip] = useState<any>(undefined);
    const [totalPrice, setTotalPrice] = useState<any>(undefined);
    const user = useSelector((state: ReducerProps) => state.user);
    const store = useStore();
    const handleCancleOrder = async () => {
        const orderRes = await PostApi(`/user/cancle-order/${order.id}`, localStorage.getItem('token'), {
            orderDetailIdList: order.orderDetailIdList,
        });
        if (orderRes.data.message == 'Success') {
            setValueTabs(4);
            setIsReq(true);
        }
        if (orderRes.data.message == 'MORE REQUEST') {
            toastWarning(t('order.PleaseWait'));
        }
    };
    const handleReOrder = async () => {
        const orderRes = await PostApi(`/user/re-order/${order.id}`, localStorage.getItem('token'), {
            orderDetailIdList: order.orderDetailIdList,
        });
        if (orderRes.data.message == 'Success') {
            setValueTabs(0);
            setIsReq(true);
        }
        if (orderRes.data.message == 'MORE REQUEST') {
            toastWarning(t('order.PleaseWait'));
        }
        if (orderRes.data.message == 'Voucher used') {
            toastWarning(t('toast.VoucherHasUsed'));
        }
        if (orderRes.data.message == 'Voucher not found') {
            toastWarning(t('toast.VoucherNotFound'));
        }
        if (orderRes.data.message == 'Voucher run out of') {
            toastWarning(t('toast.VoucherOutOfStock'));
        }
    };
    const handleRefund = async () => {
        if (user.walletId) {
            store.dispatch(change_is_loading(true));
            const res = await PostApi(`/user/refund/${order.id}`, localStorage.getItem('token'), {
                total: totalPrice,
                priceShip: ship.price,
                priceVoucher: order.priceVoucher,
                priceMember: order.priceMember,
            });
            if (res.data.message == 'Success') {
                toastSuccess(t('auth.Success'));
                setValueTabs(0);
                setIsReq(true);
            }
            store.dispatch(change_is_loading(false));
        } else {
            toastWarning(t('toast.NeedCreateWalletFirst'));
        }
    };
    const getData = async () => {
        store.dispatch(change_is_loading(true));
        ///
        const orderDetails = await PostApi('/user/order-detail-many', localStorage.getItem('token'), {
            orderDetailIdList: order.orderDetailIdList,
        });
        if (orderDetails.data.message == 'Success') {
            setListOrderDetail(orderDetails.data.orderDetails);
        }
        //
        const shopRes = await GetGuestApi(`/api/shop/${order.shopId}`);
        if (shopRes.data.message == 'Success') {
            setShop(shopRes.data.shop);
        }
        //
        const shipRes = await GetGuestApi(`/api/ship/${order.shipId}`);
        if (shipRes.data.message == 'Success') {
            setShip(shipRes.data.ship);
        }
        //
        const totalPriceRes = await GetApi(`/user/get-price-order/${order.id}`, localStorage.getItem('token'));
        if (totalPriceRes.data.message == 'Success') {
            setTotalPrice(totalPriceRes.data.price);
        }
        store.dispatch(change_is_loading(false));
    };
    useEffect(() => {
        getData();
    }, []);
    return (
        <div className="p-6 mt-6 mb-6 box-shadow rounded-xl">
            <div className="font-normal flex items-center mb-3 text-blue-500">
                <SubtitlesIcon /> &nbsp; {t('order.Code')} : {order.id}
            </div>
            <Divider />
            <div className="grid grid-cols-12 mt-4">
                <div className="col-span-8 lg:col-span-9">
                    {listOrderDetail ? (
                        <div className="p-6">
                            {listOrderDetail.map((orderDetail: any, index: number) => {
                                if (index != listOrderDetail.length - 1) {
                                    return (
                                        <>
                                            <OrderDetailItem
                                                key={orderDetail.id}
                                                orderDetail={orderDetail}
                                                orderStatus={order.status}
                                            />
                                            <Divider />
                                        </>
                                    );
                                } else {
                                    return (
                                        <OrderDetailItem
                                            key={orderDetail.id}
                                            orderDetail={orderDetail}
                                            orderStatus={order.status}
                                        />
                                    );
                                }
                            })}
                        </div>
                    ) : null}
                </div>
                <div style={{ minHeight: 400 }} className="col-span-4 lg:col-span-3 bg-gray-100 rounded-xl relative">
                    {order.status == 'PROCESSED' ? (
                        <>
                            <div className="mt-6 text-center text-green-400">
                                <CheckCircleIcon sx={{ width: 50, height: 50 }} />
                            </div>
                        </>
                    ) : (
                        <div
                            className={` w-full text-xl text-center p-3 ${
                                order.paid ? 'text-green-400' : 'text-blue-400'
                            }`}
                        >
                            {order.paid ? t('order.Paid') : t('order.NotPaid')}
                            <div>{order.paid ? <PriceCheckIcon /> : <ErrorOutlineIcon />}</div>
                        </div>
                    )}

                    <div style={{ bottom: 180 }} className={`absolute w-full text-center`}>
                        {order.status == 'PROCESSING' || order.status == 'CONFIRMED' ? (
                            order.paid ? (
                                <Button
                                    title={`${
                                        new Date(new Date(order.updateDate).getTime() + order.coolDown * 1000) >
                                        new Date()
                                            ? 'Vui lòng chờ'
                                            : ''
                                    }`}
                                    onClick={() => {
                                        AlertChangeOrderRefund(handleRefund);
                                    }}
                                    style={{ padding: '6px 30px' }}
                                >
                                    {t('action.Refund')}
                                </Button>
                            ) : (
                                <Button
                                    title={`${
                                        new Date(new Date(order.updateDate).getTime() + order.coolDown * 1000) >
                                        new Date()
                                            ? 'Vui lòng chờ'
                                            : ''
                                    }`}
                                    onClick={() => {
                                        AlertChangeOrder(handleCancleOrder);
                                    }}
                                    style={{ padding: '6px 30px' }}
                                >
                                    {t('action.Cancel')}
                                </Button>
                            )
                        ) : order.status == 'CANCEL' ? (
                            <Button
                                title={`${
                                    new Date(new Date(order.updateDate).getTime() + order.coolDown * 1000) > new Date()
                                        ? 'Vui lòng chờ'
                                        : ''
                                }`}
                                style={{ padding: '6px 30px' }}
                                onClick={() => {
                                    AlertChangeOrder(handleReOrder);
                                }}
                            >
                                {t('action.ReOrder')}
                            </Button>
                        ) : null}
                    </div>
                    <div
                        style={{ bottom: 70 }}
                        className="absolute w-full text-center font-normal p-3 border-t border-b border-blue-200"
                    >
                        <div className="font-bold">{ship ? ship.name : null}</div>
                        <div className="font-normal text-sm">{t('order.PriceShip')}</div>
                        <div className="text-sm">{ship ? formatPrice(ship.price) : null}</div>
                    </div>
                    <div className="text-blue-400  w-full text-center p-3 bg-blue-100">
                        {t('Voucher')} : {order ? `- ${formatPrice(order.priceVoucher)}` : null}
                    </div>
                    <div className="text-blue-400  w-full text-center p-3 bg-gray-300">
                        {t('Member')} : {order ? `- ${formatPrice(order.priceMember)}` : null}
                    </div>
                    <div className="text-red-400 absolute bottom-0 w-full text-center p-3 bg-blue-100 rounded-tl-full rounded-tr-full">
                        {t('product.Total')} :{' '}
                        {totalPrice
                            ? formatPrice(totalPrice + ship.price - order.priceVoucher - order.priceMember)
                            : null}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderItem;
