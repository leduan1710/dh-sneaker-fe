import React, { useEffect, useState } from 'react';
import { checkIsFavorite, convertToPercentage, formatPrice, shortedString } from '../../../untils/Logic';
import Heart from '../product/Heart';
import { useSelector } from 'react-redux';
import { ReducerProps } from '../../../reducers/ReducersProps';
import { useNavigate } from 'react-router-dom';
import { HOST_BE } from '../../../common/Common';

interface FavoriteItemProps {
    product: any;
}
const FavoriteItem: React.FC<FavoriteItemProps> = (props) => {
    const { product } = props;
    const user = useSelector((state: ReducerProps) => state.user);
    const [productCurrent, setProductCurrent] = useState<any>(product);
    const [isFavorite, setIsFavorite] = useState<boolean>(true);
    const nav = useNavigate();
    useEffect(() => {
        if (user.id) {
            setIsFavorite(checkIsFavorite(user, productCurrent.id));
        }
    }, [user]);
    return (
        <div className="mt-1 bg-gray-100 relative select-none">
            <div className="absolute bottom-12 right-3">
                {productCurrent.percentDiscountTop ? (
                    <div className="font-bold text-red-500">
                        - {convertToPercentage(productCurrent.percentDiscountTop)}
                    </div>
                ) : null}
            </div>
            <a
                href={`/product/${product.id}`}
                className="grid grid-cols-3 p-3 hover:bg-gray-200 transition-all duration-500 cursor-pointer"
            >
                <div className="col-span-1">
                    <img
                        className="rounded-xl"
                        style={{
                            height: 120,
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
                <div className="col-span-2">
                    <div className="font-bold">{shortedString(product.name, 60)}</div>
                    {productCurrent.percentDiscountTop != 0 ? (
                        <div className="flex">
                            <div className="line-through">{formatPrice(productCurrent.price)}</div>
                            <div className="ml-1 text-red-400">
                                {formatPrice(
                                    productCurrent.price - productCurrent.price * productCurrent.percentDiscountTop,
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="text-red-400">{formatPrice(productCurrent.price)}</div>
                    )}
                </div>
            </a>
            <div>
                <Heart
                    bottom={3}
                    right={3}
                    left={undefined}
                    top={undefined}
                    productCurrent={product}
                    setProductCurrent={setProductCurrent}
                    isFavorite={isFavorite}
                />
            </div>
        </div>
    );
};

export default FavoriteItem;
