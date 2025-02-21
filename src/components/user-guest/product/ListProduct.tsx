import React, { useEffect, useState } from 'react';
import ProductItem from './ProductItem';

import { useTranslation } from 'react-i18next';

interface ListProductProps {
    listProduct: any;
}
const ListProduct: React.FC<ListProductProps> = (props) => {
    const { t } = useTranslation();

    let { listProduct } = props;
    return (
        <div className="relative container">
            <div
                style={{
                    top: -30,
                    right: 0,
                }}
                className="absolute"
            ></div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
                {listProduct.map((product: any, index: number) => {
                    if (product != null) return <ProductItem key={product.id} product={product} />;
                })}
            </div>
        </div>
    );
};

export default ListProduct;
