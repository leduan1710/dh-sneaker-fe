import React, { useCallback, useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useTranslation } from 'react-i18next';
import { Divider } from '@mui/material';
import { TextField } from '@mui/material';
import {
    addCheckout,
    addCheckoutBuyAll,
    filterSpecialInput,
    formatPrice,
    toastWarning,
    unCheck,
} from '../../../untils/Logic';
import SearchIcon from '@mui/icons-material/Search';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { async } from '@firebase/util';
import Hot from './Hot';
import Suggestion from './Suggestion';
import { GetGuestApi, PostGuestApi } from '../../../untils/Api';
import { useSelector, useStore } from 'react-redux';
import { ReducerProps } from '../../../reducers/ReducersProps';
import { add_list_item_in_cart, set_list_item_in_cart } from '../../../reducers/Actions';
import CartItem from '../cart/CartItem';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../ComponentsLogin';
import { typeRole } from '../../../common/Common';
import { AlertLogin } from '../../alert/Alert';
import { faFaceFrownOpen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Height } from '@mui/icons-material';
import ListCartByShop from '../cart/ListCartByShop';

interface DrawerCartProps {
    open: boolean;
    toggleDrawer: any;
}
const DrawerCart: React.FC<DrawerCartProps> = (props) => {
    const location = useLocation();
    const { open, toggleDrawer } = props;
    const { t } = useTranslation();
    const listItemInCart = useSelector((state: ReducerProps) => state.listItemInCart);
    const role = useSelector((state: ReducerProps) => state.role);
    const numberCart = useSelector((state: ReducerProps) => state.numberCart);
    const [discounts, setDiscounts] = useState<any>(undefined);
    const store = useStore();
    const [groupedShop, setGroupedShop] = useState<any>([]);

    const nav = useNavigate();
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [totalItem, setTotalItem] = useState<number>(0);
    //get data in cart
    const getDataInCart = async () => {
        const listCart = JSON.parse(localStorage.getItem('listCart') || '[]');
        const listProductDetailId = listCart.map((item: any) => item.productDetailId);
        const resProductDetail = await PostGuestApi(`/api/get-product-detail-many/`, {
            listProductDetailId: listProductDetailId,
        });
        if (resProductDetail.data.message == 'Success') {
            store.dispatch(set_list_item_in_cart(resProductDetail.data.productDetails));
            const discountIds = resProductDetail.data.productDetails
                .map((productDetail: any) => productDetail.discountId)
                .filter((discountId: any) => discountId !== null);
            const resDiscount = await PostGuestApi(`/api/discount-many/`, { discountIdList: discountIds });
            if (resDiscount.data.message == 'Success') {
                setDiscounts(resDiscount.data.discounts);
            }
        }
    };
    const groupedByShopId = () => {
        const new_list = listItemInCart.reduce((accumulator: any, current: any) => {
            let group = accumulator.find((g: any) => g.shopId === current.shopId);

            if (!group) {
                group = { shopId: current.shopId, productDetails: [] };
                accumulator.push(group);
            }

            // Thêm object vào nhóm tương ứng
            group.productDetails.push(current);

            return accumulator;
        }, []);
        setGroupedShop(new_list);
    };
    //
    const handleBuy = () => {
        const isAdded = addCheckoutBuyAll();
        if (isAdded) {
            toggleDrawer(false);
            if (location.pathname == '/checkout') {
                window.location.href = '/checkout';
            } else {
                nav('/checkout');
            }
        } else {
            toastWarning('');
        }
    };
    //
    const getTotalPriceAndItem = () => {
        const list_cart = JSON.parse(localStorage.getItem('listCart') || '[]');
        //total item
        const totalItem = list_cart.reduce((accumulator: any, currentValue: any) => {
            if (currentValue.isCheck) {
                return accumulator + currentValue.quantity;
            } else {
                return accumulator;
            }
        }, 0);
        setTotalItem(totalItem);
        //total price
        const totalPrice = listItemInCart.reduce((accumulator: any, currentValue: any) => {
            const inx = list_cart.findIndex((item: any) => item.productDetailId == currentValue.id);
            if (list_cart[inx].isCheck) {
                if (discounts) {
                    const inx_discount = discounts.findIndex((item: any) => item.id == currentValue.discountId);
                    if (inx_discount != -1) {
                        return (
                            accumulator +
                            list_cart[inx].quantity * currentValue.price * (1 - discounts[inx_discount].percent)
                        );
                    } else {
                        return accumulator + list_cart[inx].quantity * currentValue.price;
                    }
                } else {
                    return accumulator;
                }
            } else {
                return accumulator;
            }
        }, 0);
        setTotalPrice(totalPrice);
    };
    //
    useEffect(() => {
        if (localStorage.getItem('listCart')) getDataInCart();
    }, [numberCart]);
    useEffect(() => {
        groupedByShopId();
    }, [listItemInCart]);
    useEffect(() => {
        getTotalPriceAndItem();
    }, [numberCart, discounts]);
    const DrawerList = (
        <Box sx={{ width: '100%', minWidth: 400 }} role="presentation">
            <div className="pt-3 pl-3 pb-3 flex justify-start items-center bg-general sticky top-0 right-0 left-0 z-10">
                <KeyboardBackspaceIcon
                    className="cursor-pointer"
                    onClick={() => {
                        toggleDrawer(false);
                    }}
                />
                <span
                    className="cursor-pointer pl-3"
                    onClick={() => {
                        toggleDrawer(false);
                    }}
                >
                    {t('homepage.Exit')}
                </span>
            </div>
            <div style={{ minHeight: 1000 }} className="mt-2 mb-6 ml-9 mr-9 relative ">
                <AnimatePresence>
                    {groupedShop.length > 0
                        ? groupedShop.map((shop: any, index: number) => (
                              <motion.li
                                  style={{ listStyleType: 'none' }}
                                  key={index}
                                  initial={{ opacity: 1, height: 'auto' }}
                                  exit={{
                                      opacity: 0,
                                      height: 0,
                                      transition: { duration: 0.2 },
                                  }}
                                  transition={{ duration: 0.2 }}
                              >
                                  <ListCartByShop
                                      key={shop.shopId}
                                      shop={shop}
                                      setTotalPrice={setTotalPrice}
                                      setTotalItem={setTotalItem}
                                      toggleDrawer={toggleDrawer}
                                  />
                              </motion.li>
                          ))
                        : null}
                </AnimatePresence>
            </div>
        </Box>
    );
    return (
        <div className="relative">
            <Drawer
                anchor="right"
                open={open}
                onClose={() => {
                    toggleDrawer(false);
                }}
            >
                <div style={{ maxWidth: 640 }}> {DrawerList}</div>
                {listItemInCart.length > 0 ? (
                    <div className="sticky  z-10 bottom-0 left-0 right-auto box-shadow rounded  bg-gray-200">
                        <div className="flex justify-end p-3 items-center ">
                            <div className="font-bold mr-6">
                                {t('product.Total')}
                                {`(${totalItem})`} : {formatPrice(totalPrice)}
                            </div>
                            <Button
                                onClick={() => {
                                    if (role == typeRole.CTV || role == typeRole.SHOP) {
                                        handleBuy();
                                    } else {
                                        toggleDrawer(false);

                                        AlertLogin();
                                    }
                                }}
                            >
                                {t('product.Buy')}
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div>
                        <div className="w-full text-center mt-12">
                            <FontAwesomeIcon icon={faFaceFrownOpen} size="2xl" style={{ color: '#74C0FC' }} />
                        </div>
                    </div>
                )}
            </Drawer>
        </div>
    );
};
export default DrawerCart;
