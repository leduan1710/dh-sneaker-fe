import React, { useEffect, useState } from 'react';
import { GetGuestApi } from '../../../untils/Api';
import ProductItem from './ProductItem';
import SkeletonProductItem from './SkeletonProductItem';

interface ProductTopProps {}

const ProductTop: React.FC<ProductTopProps> = (props) => {
    const [productsTop, setProductTops] = useState<any>(undefined);
    const getDataProductTop = async () => {
        const resProductTop = await GetGuestApi('/api/get-product-top');
        if (resProductTop.data.message == 'Success') {
            setProductTops(
                resProductTop.data.productsTop.sort((hight: any, low: any) => low.numberSold - hight.numberSold),
            );
        }
    };
    useEffect(() => {
        getDataProductTop();
    }, []);
    return (
        <div className="mt-6 ">
            {productsTop ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
                    {productsTop.map((product: any, index: number) => (
                        <ProductItem product={product} key={product.id} />
                    ))}
                </div>
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
                    <SkeletonProductItem />
                    <SkeletonProductItem />
                    <SkeletonProductItem />
                    <SkeletonProductItem />
                    <SkeletonProductItem />
                    <SkeletonProductItem />
                    <SkeletonProductItem />
                    <SkeletonProductItem />
                    <SkeletonProductItem />
                    <SkeletonProductItem />
                    <SkeletonProductItem />
                    <SkeletonProductItem />
                </div>
            )}
        </div>
    );
};

export default ProductTop;
