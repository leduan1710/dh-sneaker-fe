import React, { useEffect, useState } from 'react';
import { GetGuestApi } from '../../../untils/Api';
import ProductItem from './ProductItem';
import SkeletonProductItem from './SkeletonProductItem';

interface ProductNewProps {}

const ProductNew: React.FC<ProductNewProps> = (props) => {
    const [productsNew, setProductNews] = useState<any>(undefined);
    const getDataProductNew = async () => {
        const resProductNew = await GetGuestApi('/api/get-product-new');
        if (resProductNew.data.message == 'Success') {
            setProductNews(resProductNew.data.productNews);
        }
    };
    useEffect(() => {
        getDataProductNew();
    }, []);
    return (
        <div className="mt-6">
            {productsNew ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
                    {productsNew.map((product: any, index: number) => (
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

export default ProductNew;
