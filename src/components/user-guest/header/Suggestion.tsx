import React, { useEffect, useState } from 'react';
import { GetGuestApi } from '../../../untils/Api';
import { formatPrice, shortedString } from '../../../untils/Logic';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFireFlameCurved } from '@fortawesome/free-solid-svg-icons';
import { HOST_BE } from '../../../common/Common';

interface SuggestionProps {
    productId: any;
}
const Suggestion: React.FC<SuggestionProps> = (props) => {
    const { productId } = props;
    const [product, setProduct] = useState<any>(undefined);
    const getDataProduct = async () => {
        const resProduct = await GetGuestApi(`/api/product/${productId}`);
        if (resProduct.status == 200) {
            setProduct(resProduct.data.product);
        }
    };
    useEffect(() => {
        if (product) {
        } else {
            getDataProduct();
        }
    });
    return (
        <div
            onClick={() => (window.location.href = `/product/${productId}`)}
            className="ml-3 mr-3 flex items-center justify-center border border-gray-300 rounded-xl select-none cursor-pointer hover:bg-gray-300 trasition-all duration-500 relative mt-3"
        >
            {product ? (
                <div className="p-3 w-full">
                    <div className="grid grid-cols-3">
                        <div className="col-span-3 xl:col-span-1 flex items-center justify-center xl:justify-start ">
                            <img
                                className="rounded-xl h-48 xl:h-32"
                                style={{
                                    width: '90%',
                                    objectFit: 'cover',
                                }}
                                src={
                                    product.image
                                        ? product.image.startsWith('uploads')
                                            ? `${HOST_BE}/${product.image}`
                                            : product.image
                                        : ''
                                }
                            />
                        </div>
                        <div className="col-span-3 xl:col-span-2">
                            <div className="font-bold text-xs lg:text-sm">{shortedString(product.name, 80)}</div>
                            <div className="font-bold text-xs lg:text-sm mt-1 lg:mt-3 text-red-400">
                                {formatPrice(product.price)}
                            </div>
                        </div>
                    </div>
                    <div className="absolute bottom-3 right-3">
                        <FontAwesomeIcon className="text-red-400" icon={faFireFlameCurved} shake />
                    </div>
                </div>
            ) : (
                <></>
            )}
        </div>
    );
};
export default Suggestion;
