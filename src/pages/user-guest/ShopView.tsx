import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { GetGuestApi, PostApi, PostGuestApi } from '../../untils/Api';
import { Button } from '../../components/ComponentsLogin';
import AddIcon from '@mui/icons-material/Add';
import ChatIcon from '@mui/icons-material/Chat';
import { checkIsFollow, formatNumber, toastWarning } from '../../untils/Logic';
import { useSelector, useStore } from 'react-redux';
import { ReducerProps } from '../../reducers/ReducersProps';
import CheckIcon from '@mui/icons-material/Check';
import { HOST_BE, typeRole } from '../../common/Common';
import { change_is_loading, change_is_open_chat, change_opposite_current, change_user } from '../../reducers/Actions';
import { useTranslation } from 'react-i18next';
import MultiCaroselProduct from '../../components/user-guest/product/MultiCaroselProduct';
import Footer from '../../components/user-guest/footer/Footer';
import SkeletonProductItem from '../../components/user-guest/product/SkeletonProductItem';
import Skeleton from '@mui/material/Skeleton';
import DiscountItem from '../../components/user-guest/shop/DiscountItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBolt } from '@fortawesome/free-solid-svg-icons';
import ListProductShop from '../../components/user-guest/shop/ListProductShop';
import ClearIcon from '@mui/icons-material/Clear';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { enUS } from 'date-fns/locale';
import { AlertLogin } from '../../components/alert/Alert';
import Report from '../../components/user-guest/shop/Report';
import ListVoucher from '../../components/user-guest/shop/ListVoucher';

interface ShopViewProps {}

const ShopView: React.FC<ShopViewProps> = (props) => {
    const { shopId } = useParams();
    const [shop, setShop] = useState<any>(undefined);
    const [isFollow, setIsFollow] = useState<boolean | undefined>(undefined);
    const [products, setProducts] = useState<any>([]);
    const [topProducts, setTopProducts] = useState<any>([]);
    const [discounts, setDiscounts] = useState<any>(undefined);
    const [discountCurrent, setDiscountCurrent] = useState<any>(undefined);
    const user = useSelector((state: ReducerProps) => state.user);
    const role = useSelector((state: ReducerProps) => state.role);
    const lng = useSelector((state: ReducerProps) => state.lng);
    const [vouchers, setVouchers] = useState<any>(undefined);
    const store = useStore();
    const { t } = useTranslation();
    const getData = async () => {
        store.dispatch(change_is_loading(true));

        if (shopId) {
            const resVoucher = await GetGuestApi(`/api/get-voucher/${shopId}`);
            if (resVoucher.data.message == 'Success') {
                setVouchers(resVoucher.data.voucher);
            }
            const resShop = await GetGuestApi(`/api/shop/${shopId}`);
            if (resShop.data.message == 'Success') {
                setShop(resShop.data.shop);
            }
            const resDiscount = await GetGuestApi(`/api/shop-discount/${shopId}`);
            if (resDiscount.data.message == 'Success') {
                setDiscounts(resDiscount.data.discounts);
            }
            ///
            const resProducts = await GetGuestApi(`/api/product-by-shop/${shopId}`);
            if (resProducts.data.message == 'Success') {
                setProducts(resProducts.data.products);
            }
            store.dispatch(change_is_loading(false));
        }
    };
    const getDataTopProduct = async () => {
        const listProductsId = products.slice(0, 15).map((product: any) => product.productId);
        const resTopProducts = await PostGuestApi(`/api/top-product-by-shop/${shopId}`, { listProductsId });
        if (resTopProducts.data.message == 'Success') {
            setTopProducts(resTopProducts.data.topProducts);
        }
    };
    const handleFollowShop = async () => {
        store.dispatch(change_is_loading(true));
        if (role == typeRole.CTV || role == typeRole.SHOP) {
            if (user.id != shop.userId) {
                const resFollow = await PostApi('/user/follow-shop', localStorage.getItem('token'), {
                    shopId: shop.id,
                });
                if (resFollow.data.message == 'Success') {
                    store.dispatch(change_user(resFollow.data.user));
                    setShop(resFollow.data.shop);
                }
            } else {
                toastWarning('Not allowed');
            }
        }
        store.dispatch(change_is_loading(false));
    };
    const handleUnFollowShop = async () => {
        store.dispatch(change_is_loading(true));

        if (role == typeRole.CTV || role == typeRole.SHOP) {
            if (user.id != shop.userId) {
                const resFollow = await PostApi('/user/un-follow-shop', localStorage.getItem('token'), {
                    shopId: shop.id,
                });
                if (resFollow.data.message == 'Success') {
                    store.dispatch(change_user(resFollow.data.user));
                    setShop(resFollow.data.shop);
                }
            } else {
                toastWarning('Not allowed');
            }
        }
        store.dispatch(change_is_loading(false));
    };
    const getTotalSold = () => {
        const total = products.reduce((total: any, product: any) => {
            return total + product._sum.numberSold;
        }, 0);
        return formatNumber(total);
    };

    useEffect(() => {
        getData();
    }, []);
    useEffect(() => {
        if (shop) {
            setIsFollow(checkIsFollow(shop, user.id));
        }
    }, [shop, user]);
    useEffect(() => {
        if (products.length > 0) {
            getDataTopProduct();
        }
    }, [products]);
    return (
        <div>
            {shop ? (
                shop.active == true ? (
                    <div
                        className="container"
                        style={{
                            marginTop: 120,
                        }}
                    >
                        <div className="grid grid-cols-8 box-shadow rounded p-3">
                            <div className="col-span-8 lg:col-span-3 border border-gray-300 rounded bg-gray-200 relative">
                                <div className="p-3 flex items-center ">
                                    <img
                                        className="rounded"
                                        style={{
                                            height: 100,
                                            width: '30%',
                                            objectFit: 'cover',
                                        }}
                                        src={
                                            shop.image
                                                ? shop.image.startsWith('uploads')
                                                    ? `${HOST_BE}/${shop.image}`
                                                    : shop.image
                                                : ''
                                        }
                                    />
                                    <div className="ml-6">
                                        <div className="font-bold">{shop.name}</div>
                                        <div className="grid grid-cols-2  mt-3">
                                            {isFollow ? (
                                                <Button
                                                    onClick={handleUnFollowShop}
                                                    className="font-bold text-sm flex items-center justify-center"
                                                    style={{
                                                        backgroundColor: 'white',
                                                        color: 'black',
                                                        maxWidth: '80%',
                                                        padding: 2,
                                                    }}
                                                >
                                                    <CheckIcon sx={{ width: 20, height: 20 }} /> {t('shop.UnFollow')}
                                                </Button>
                                            ) : (
                                                <Button
                                                    onClick={handleFollowShop}
                                                    className="font-bold text-sm flex items-center justify-center"
                                                    style={{
                                                        backgroundColor: 'white',
                                                        color: 'black',
                                                        maxWidth: '80%',
                                                        padding: 2,
                                                    }}
                                                >
                                                    <AddIcon sx={{ width: 20, height: 20 }} /> {t('shop.Follow')}
                                                </Button>
                                            )}
                                            <Button
                                                onClick={() => {
                                                    if (user.id) {
                                                        if (user.shopId == shop.id) {
                                                            return;
                                                        }
                                                        store.dispatch(change_is_open_chat(true));
                                                        store.dispatch(
                                                            change_opposite_current({
                                                                id: shop.id,
                                                                name: shop.name,
                                                                image: shop.image,
                                                            }),
                                                        );
                                                    } else {
                                                        AlertLogin();
                                                    }
                                                }}
                                                style={{ maxWidth: '80%' }}
                                                className="font-bold text-sm ml-3 flex items-center justify-center"
                                            >
                                                <ChatIcon sx={{ width: 20, height: 20 }} /> Chat
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                                {user.shopReportIdList && shop ? (
                                    !user.shopReportIdList.includes(shop.id) ? (
                                        <Report top={0} right={0} left={undefined} bottom={undefined} shop={shop} />
                                    ) : null
                                ) : null}
                            </div>
                            <div className="col-span-8 lg:col-span-5 p-3 ml-6">
                                <div className="grid grid-cols-2">
                                    <div>
                                        {products.length > 0 ? (
                                            <div className="flex items-center">
                                                <div className="font-bold">{t('product.Sold')} : &nbsp;</div>
                                                <div className="text-red-400">{getTotalSold()}</div>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="flex items-center">
                                                    <div className="font-bold">{t('product.Sold')} : &nbsp;</div>
                                                    <div className="text-red-400">
                                                        <Skeleton variant="text" sx={{ fontSize: '1rem', width: 40 }} />
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                        {shop ? (
                                            <div className="flex items-center mt-3">
                                                <div className="font-bold">{t('shop.Followed')} : &nbsp;</div>
                                                <div className="text-red-400">{shop.userFollowIdList.length}</div>
                                            </div>
                                        ) : null}
                                        {shop ? (
                                            <div className="flex items-center mt-3">
                                                <div className="font-bold">{t('shop.point')} : &nbsp;</div>
                                                <div className="text-red-400">{shop.point}/1000</div>
                                            </div>
                                        ) : null}
                                        {products.length > 0 ? (
                                            <div className="flex items-center mt-3">
                                                <div className="font-bold">{t('product.Product')} : &nbsp;</div>
                                                <div className="text-red-400">{products.length}</div>
                                            </div>
                                        ) : (
                                            <div className="flex items-center mt-3">
                                                <div className="font-bold">{t('product.Product')} : &nbsp;</div>
                                                <div className="text-red-400">
                                                    <Skeleton variant="text" sx={{ fontSize: '1rem', width: 40 }} />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        {discounts ? (
                                            <div className="flex">
                                                <div className="font-bold">{t('product.NumberDiscount')} : &nbsp;</div>
                                                <div className="text-red-400">{discounts.length}</div>
                                            </div>
                                        ) : (
                                            <div className="flex">
                                                <div className="font-bold">{t('product.NumberDiscount')} : &nbsp;</div>
                                                <div className="text-red-400">
                                                    <Skeleton variant="text" sx={{ fontSize: '1rem', width: 40 }} />
                                                </div>
                                            </div>
                                        )}
                                        {shop ? (
                                            <div className="flex mt-3">
                                                <div className="font-bold">{t('shop.StartDay')} : &nbsp;</div>
                                                <div className="text-red-400">
                                                    {lng == 'vn'
                                                        ? formatDistanceToNow(shop.createDate, {
                                                              addSuffix: true,
                                                              locale: vi,
                                                          })
                                                        : formatDistanceToNow(shop.createDate, {
                                                              addSuffix: true,
                                                              locale: enUS,
                                                          })}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex">
                                                <div className="font-bold">{t('shop.StartDay')} : &nbsp;</div>
                                                <div className="text-red-400">
                                                    <Skeleton variant="text" sx={{ fontSize: '1rem', width: 40 }} />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {discounts ? (
                            <>
                                {/* ```````````````````````````````````VOUCHER `````````````````````````````````````````*/}
                                {vouchers && (
                                    <>
                                        <div>
                                            <div className="mt-8 border-b border-gray-300 flex">
                                                <div
                                                    style={{
                                                        borderBottomWidth: 3,
                                                    }}
                                                    className="font-bold text-2xl border-b border-solid  border-blue-500"
                                                >
                                                    {t('Voucher')}{' '}
                                                    {/* <FontAwesomeIcon icon={faBolt} beatFade style={{ color: '#1291f3' }} /> */}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="pl-6">
                                            <ListVoucher vouchers={vouchers} />
                                        </div>
                                    </>
                                )}

                                {/* ```````````````````````````````````SALE `````````````````````````````````````````*/}

                                <div>
                                    <div className="mt-8 border-b border-gray-300 flex">
                                        <div
                                            style={{
                                                borderBottomWidth: 3,
                                            }}
                                            className="font-bold text-2xl border-b border-solid  border-blue-500"
                                        >
                                            {t('Sale')}{' '}
                                            {/* <FontAwesomeIcon icon={faBolt} beatFade style={{ color: '#1291f3' }} /> */}
                                        </div>
                                    </div>
                                </div>
                                <div className="pl-6 mt-6 grid grid-cols-3 lg:grid-cols-5 gap-4">
                                    {discounts.map((discount: any) => (
                                        <DiscountItem
                                            key={discount.id}
                                            discount={discount}
                                            shopId={shopId}
                                            setDiscountCurrent={setDiscountCurrent}
                                        />
                                    ))}
                                </div>
                            </>
                        ) : null}

                        <div>
                            <div className="mt-8 border-b border-gray-300 flex">
                                <div
                                    style={{
                                        borderBottomWidth: 3,
                                    }}
                                    className="font-bold text-2xl border-b border-solid  border-blue-500"
                                >
                                    {t('shop.TopProduct')}
                                </div>
                            </div>
                            <div className="mt-6">
                                {topProducts.length > 0 ? (
                                    <MultiCaroselProduct listProduct={topProducts} />
                                ) : (
                                    <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
                                        <SkeletonProductItem />
                                        <SkeletonProductItem />
                                        <SkeletonProductItem />
                                        <SkeletonProductItem />
                                        <SkeletonProductItem />
                                        <SkeletonProductItem />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div>
                            <div className="mt-8 border-b border-gray-300 flex">
                                <div
                                    style={{
                                        borderBottomWidth: 3,
                                    }}
                                    className="font-bold text-2xl border-b border-solid  border-blue-500"
                                >
                                    {t('product.Describe')}
                                </div>
                            </div>
                        </div>

                        <div className="mt-8">
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: shop ? shop.describeShop : null,
                                }}
                            ></div>
                        </div>

                        <div id="product-shop">
                            {shopId ? (
                                <ListProductShop
                                    shopId={shopId}
                                    discountCurrent={discountCurrent}
                                    setDiscountCurrent={setDiscountCurrent}
                                />
                            ) : null}
                        </div>
                    </div>
                ) : (
                    <div style={{ marginTop: 120 }}>
                        <div className="text-center">
                            This shop is ban
                            <div className="mt-3">
                                <Button onClick={() => (window.location.href = '/')}>Home</Button>
                            </div>
                        </div>
                    </div>
                )
            ) : null}

            {topProducts.length > 0 ? <Footer /> : null}
        </div>
    );
};

export default ShopView;
