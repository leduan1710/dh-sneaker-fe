import React, { useEffect, useState } from 'react';
import { convertToPercentage, formatPrice } from '../../../untils/Logic';
import { useNavigate } from 'react-router-dom';
import { HOST_BE } from '../../../common/Common';

interface ProductItemSearchProps {
    product: any;
}
const ProductItemSearch: React.FC<ProductItemSearchProps> = (props) => {
    const { product } = props;
    const nav = useNavigate();

    return (
        <a href={`/product/${product.id}`} className="mt-6 grid grid-cols-3 p-3 border-b border-gray-300 relative">
            <div className="absolute bottom-12 right-3">
                {product.percentDiscountTop ? (
                    <div className="font-bold text-red-500">- {convertToPercentage(product.percentDiscountTop)}</div>
                ) : null}
            </div>
            <div className="col-span-1 p-3">
                <img
                    className="rounded-xl"
                    style={{
                        width: 300,
                        height: 150,
                        objectFit: 'cover',
                    }}
                    src={product.image.startsWith('uploads') ? `${HOST_BE}/${product.image}` : product.image}
                />
            </div>
            <div className="col-span-2 p-4">
                <div className="cursor-pointer hover:text-blue-400 transition-all duration-500">{product.name}</div>
                <div className="font-bold mt-6">
                    {product.percentDiscountTop ? (
                        <div className="flex">
                            <div className="line-through">{formatPrice(product.price)}</div>
                            <div className="ml-1 text-red-400">
                                {formatPrice(product.price * (1 - product.percentDiscountTop))}
                            </div>
                        </div>
                    ) : (
                        <div className="text-red-400">{formatPrice(product.price)}</div>
                    )}
                </div>
            </div>
        </a>
    );
};

export default ProductItemSearch;
