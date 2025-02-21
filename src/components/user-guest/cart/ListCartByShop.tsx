import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CartItem from './CartItem';
import { GetGuestApi } from '../../../untils/Api';
import Checkbox from '@mui/material/Checkbox';

interface ListCartByShopProps {
    shop: any;
    setTotalPrice: any;
    setTotalItem: any;
    toggleDrawer:any;
}
const ListCartByShop: React.FC<ListCartByShopProps> = (props) => {
    const { shop, setTotalPrice, setTotalItem ,toggleDrawer} = props;
    const [shopCurrent, setShopCurrent] = useState<any>(undefined);
    //
    const getIsCheck = () => {
        const listProductDetail = JSON.parse(localStorage.getItem('listCart') || '[]');
        const listProductDetailId = shop.productDetails.map((item: any) => item.id);
        if (listProductDetail.length > 0) {
            const new_list = listProductDetail.filter((item: any) =>
                listProductDetailId.includes(item.productDetailId),
            );
            return new_list.every((item: any) => item.isCheck == true);
        } else {
            return false;
        }
    };
    //
    const [isCheckAll, setIsCheckAll] = useState<boolean>(getIsCheck());
    const getDataShop = async () => {
        const shopRes = await GetGuestApi(`/api/shop/${shop.shopId}`);
        if (shopRes.data.message == 'Success') {
            setShopCurrent(shopRes.data.shop);
        }
    };
    useEffect(() => {
        getDataShop();
    }, [shop.shopId]);
    return (
        <div className="relative">
            <div className="mt-2 mb-2 font-bold ml-3">SHOP : {shopCurrent ? shopCurrent.name : null}</div>
            <div style={{ left: -35, top: -10 }} className="absolute">
                <Checkbox
                    checked={isCheckAll}
                    onChange={() => {
                        if (isCheckAll) {
                            const listProductDetail = JSON.parse(localStorage.getItem('listCart') || '[]');
                            listProductDetail.map((item: any) => (item.isCheck = false));
                            localStorage.setItem('listCart', JSON.stringify(listProductDetail));
                        }
                        setIsCheckAll((prev) => !prev);
                    }}
                />
            </div>
            <AnimatePresence>
                {shop.productDetails.length > 0
                    ? shop.productDetails.map((productDetail: any, index: number) => (
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
                              <CartItem
                                  key={productDetail.id}
                                  productDetail={productDetail}
                                  setTotalPrice={setTotalPrice}
                                  setTotalItem={setTotalItem}
                                  isCheck_F={isCheckAll}
                                  setIsCheckAll={setIsCheckAll}
                                  getIsCheck={getIsCheck}
                                  toggleDrawer={toggleDrawer}
                              />
                          </motion.li>
                      ))
                    : null}
            </AnimatePresence>
        </div>
    );
};

export default ListCartByShop;
