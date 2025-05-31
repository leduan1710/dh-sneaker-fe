import React, { useEffect, useState } from 'react';
import { convertToPercentage, formatNumber, formatPrice, shortedString } from '../../../untils/Logic';

import { useSelector, useStore } from 'react-redux';

import { ReducerProps } from '../../../reducers/ReducersProps';

import Heart from './Heart';
import { useTranslation } from 'react-i18next';
import { PostGuestApi } from '../../../untils/Api';
import { add_list_product_just_view } from '../../../reducers/Actions';
import { HOST_BE } from '../../../common/Common';

interface ProductItemProps {
    product: any;
}
const ProductItem: React.FC<ProductItemProps> = (props) => {
    const { product } = props;
    const { t } = useTranslation();
    const [productCurrent, setProductCurrent] = useState<any>(product);
    const [discountTop, setDiscountTop] = useState<any>(undefined);
    const user = useSelector((state: ReducerProps) => state.user);
    const store = useStore();
    const [isFavorite, setIsFavorite] = useState<boolean>(false);
    const handleClickProduct = () => {
        //
        const pd_jv = JSON.parse(sessionStorage.getItem('pd-jv') || '[]');
        const indx = pd_jv.findIndex((productId: any) => productId == product.id);
        console.log(indx);
        if (indx == -1) {
            console.log('here');
            sessionStorage.setItem('pd-jv', JSON.stringify([...pd_jv, product.id]));
            store.dispatch(add_list_product_just_view(product.id));
        }
        window.location.href = `/product/${product.id}`;
    };
    const getDiscountTop = async () => {
        setDiscountTop(productCurrent.percentDiscountTop);
    };

    useEffect(() => {
        if (product.percentDiscountTop) {
            getDiscountTop();
        }
    }, []);
    return (
        <div className="relative ">
            <a href={`/product/${product.id}`} onClick={handleClickProduct}>
                <div
                    style={{ height: 340 }}
                    className="relative p-3 border border-gray-200 m-1 transition-transform transform cursor-pointer hover:scale-105 duration-500 bg-white rounded-xl"
                >
                    <div>
                        <img
                            className="rounded-xl"
                            style={{ height: 170, objectFit: 'cover', width: '100%' }}
                            src={
                                productCurrent.image
                                    ? productCurrent.image.startsWith('uploads')
                                        ? `${HOST_BE}/${productCurrent.image}`
                                        : productCurrent.image
                                    : ''
                            }
                        />
                    </div>
                    <div className="font-bold mt-1" style={{ height: 80 }}>
                        {shortedString(productCurrent.name, 50)}
                    </div>
                    <div
                        style={{
                            fontSize: 12,
                        }}
                        className="fot-thin"
                    >
                        {t('product.Sold')} : {formatNumber(product.numberSold ? product.numberSold : 0)}
                    </div>
                    {discountTop ? (
                        <div className="flex">
                            <div className="line-through">{formatPrice(productCurrent.price)}</div>
                            <div className="ml-1 text-red-400">
                                {formatPrice(productCurrent.price * (1 - discountTop))}
                            </div>
                        </div>
                    ) : (
                        <div className="text-red-400">{formatPrice(productCurrent.price)}</div>
                    )}
                </div>
            </a>
            <div className="absolute bottom-12 right-3">
                {discountTop ? (
                    <div className="font-bold text-red-500">- {convertToPercentage(discountTop)}</div>
                ) : null}
            </div>
            <Heart
                productCurrent={productCurrent}
                setProductCurrent={setProductCurrent}
                isFavorite={isFavorite}
                bottom={4}
                right={3}
                top={undefined}
                left={undefined}
            />
        </div>
    );
};
export default ProductItem;
