import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GetGuestApi } from '../../../untils/Api';
import { formatPrice, shortedString } from '../../../untils/Logic';
import WarningIcon from '@mui/icons-material/Warning';
import ReviewsIcon from '@mui/icons-material/Reviews';
import OrderReview from './OrderReview';
import { HOST_BE } from '../../../common/Common';
import OrderReport from './OrderReport';
import { useSelector } from 'react-redux';
import { ReducerProps } from '../../../reducers/ReducersProps';
interface OrderDetailItemProps {
    orderDetail: any;
    orderStatus: any;
}
const OrderDetailItem: React.FC<OrderDetailItemProps> = (props) => {
    const { orderDetail, orderStatus } = props;
    const { t } = useTranslation();
    const [openReview, setOpenReview] = useState(false);
    const [openReport, setOpenReport] = useState(false);
    const [isReview, setIsReview] = useState(false);
    const user = useSelector((state: ReducerProps) => state.user);
    const [productDetail, setProductDetail] = useState<any>(undefined);
    const getData = async () => {
        const productDetailRes = await GetGuestApi(`/api/product-detail/${orderDetail.productDetailId}`);
        if (productDetailRes.data.message == 'Success') {
            setProductDetail(productDetailRes.data.productDetail);
        }
    };
    useEffect(() => {
        getData();
    }, []);
    return (
        <div className="p-3">
            {productDetail ? (
                <a
                    href={`/product/${productDetail.productId}`}
                    className="grid grid-cols-3 cursor-pointer hover:opacity-60 transition-all duration-500 relative"
                >
                    <div className="col-span-3 sm:col-span-2 xl:col-span-1 flex">
                        <img
                            className="rounded-xl"
                            style={{ height: 180, objectFit: 'cover', width: '80%' }}
                            src={
                                productDetail.images[0].startsWith('upload')
                                    ? `${HOST_BE}/${productDetail.images[0]}`
                                    : productDetail.images[0]
                            }
                        />
                    </div>
                    <div className="pt-2 col-span-3 sm:col-span-1 xl:col-span-2  font-normal text-sm xl:text-lg pb-6 sm:pb-0">
                        <div className="lg:mb-6 ">{shortedString(productDetail.name, 90)}</div>
                        {orderDetail.discountPrice ? (
                            <div>
                                <span className="line-through">{formatPrice(orderDetail.price)}</span>
                                <span className="font-bold text-red-400 ml-1 lg:ml-3">
                                    {formatPrice(orderDetail.price - orderDetail.discountPrice)}
                                </span>
                                <span className="ml-1 lg:ml-3"> x {orderDetail.quantity}</span>
                            </div>
                        ) : (
                            <div>
                                <span>{formatPrice(orderDetail.price)}</span>
                                <span className="ml-1 lg:ml-3"> x {orderDetail.quantity}</span>
                            </div>
                        )}
                    </div>
                    <div className="absolute bottom-0 xl:bottom-6 right-0 sm:right-6 lg:right-12 text-red-400 text-sm xl:text-lg">
                        {t('product.Total')} :{' '}
                        {formatPrice(
                            (orderDetail.price - (orderDetail.discountPrice ? orderDetail.discountPrice : 0)) *
                                orderDetail.quantity,
                        )}
                    </div>
                </a>
            ) : null}
            {orderStatus != 'PROCESSED' ? null : (
                <div className="flex space-x-8">
                    {orderDetail.reviewId == null && !isReview ? (
                        <div className="mt-6 text-blue-400 flex justify-center items-center text-sm underline cursor-pointer hover:opacity-80 space-x-2">
                            <div onClick={() => setOpenReview(true)}>{t('order.SendReview')}</div> <ReviewsIcon />
                        </div>
                    ) : (
                        <div className="mt-6 text-green-400 flex justify-center items-center text-sm select-none hover:opacity-80 space-x-2">
                            <div>{t('order.Reviewed')}</div>
                        </div>
                    )}
                    { user && !user.orderDetailReportIdList.includes(orderDetail.id) ? (
                        <div
                            onClick={() => setOpenReport(true)}
                            className="mt-6 text-red-400 flex justify-center items-center text-sm underline cursor-pointer hover:opacity-80 space-x-2"
                        >
                            <div>{t('order.SendReport')}</div> <WarningIcon />
                        </div>
                    ) : (
                        <div
                       
                        className="mt-6 text-green-400 flex justify-center items-center text-sm  space-x-2 select-none"
                    >
                        <div>{t('order.SendedReport')}</div>
                    </div>
                    )}
                </div>
            )}

            {orderStatus != 'PROCESSED' ? null : (
                <>
                    <OrderReview
                        orderDetail={orderDetail}
                        productDetail={productDetail}
                        open={openReview}
                        setOpen={setOpenReview}
                        setIsReview={setIsReview}
                    />
                    {user && !user.orderDetailReportIdList.includes(orderDetail.id) && (
                        <OrderReport orderDetail={orderDetail} open={openReport} setOpen={setOpenReport} />
                    )}
                </>
            )}
        </div>
    );
};

export default OrderDetailItem;
