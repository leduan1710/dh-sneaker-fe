import React, { useEffect, useState } from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import ProductItem from './ProductItem';
import { PostGuestApi } from '../../../untils/Api';
import { useTranslation } from 'react-i18next';
import { useSelector, useStore } from 'react-redux';
import { ReducerProps } from '../../../reducers/ReducersProps';
interface MultiCaroselProductJVProps {}
const responsive = {
    superLargeDesktop: {
        breakpoint: { max: 4000, min: 1024 },
        items: 6,
    },
    desktop: {
        breakpoint: { max: 1280, min: 1024 },
        items: 4,
    },
    tablet: {
        breakpoint: { max: 1024, min: 500 },
        items: 3,
    },
    mobile: {
        breakpoint: { max: 500, min: 0 },
        items: 2,
    },
};
const MultiCaroselProductJV: React.FC<MultiCaroselProductJVProps> = (props) => {
    const [listProduct, setListProduct] = useState<any>([]);
    const { t } = useTranslation();
    const store = useStore();
    const listProductJustView = useSelector((state: ReducerProps) => state.listProductJustView);
    const getListProduct = async (listProductId: any) => {
        const products = await PostGuestApi('/api/product-lstId', { listProductId: listProductId });
        if (products.data.message == 'Success') {
            setListProduct(products.data.products);
        }
    };
    useEffect(() => {
        const listProductId = JSON.parse(sessionStorage.getItem('pd-jv') || '[]');
        if (listProductId.length > 0) {
            getListProduct(listProductId);
        }
    }, [listProductJustView]);

    return (
        <>
            {listProduct.length > 0 ? (
                <div className='container'>
                    <div className="mt-6 ">
                        <div className=" border-b border-gray-300 flex mt-6">
                            <div
                                style={{
                                    borderBottomWidth: 3,
                                }}
                                className="font-bold text-2xl border-b border-solid  border-red-500"
                            >
                                {t('product.JV')}
                            </div>
                        </div>
                    </div>
                    <Carousel
                    className='mt-6'
                        swipeable={false}
                        draggable={false}
                        showDots={false}
                        responsive={responsive}
                        ssr={true}
                        infinite={true}
                        autoPlay={true}
                        autoPlaySpeed={3000}
                        keyBoardControl={true}
                        customTransition="transform 500ms ease-in-out"
                        transitionDuration={1000}
                        containerClass="carousel-container"
                        itemClass="carousel-item-padding-40-px"
                    >
                        {listProduct.map((product: any, index: number) => (
                            <ProductItem key={index} product={product} />
                        ))}
                    </Carousel>
                </div>
            ) : null}
        </>
    );
};
export default MultiCaroselProductJV;
