import React from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import ProductItem from './ProductItem';
interface MultiCaroselProductProps {
    listProduct: any;
}
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
const MultiCaroselProduct: React.FC<MultiCaroselProductProps> = (props) => {
    const { listProduct } = props;
    return (
        <Carousel
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
    );
};
export default MultiCaroselProduct;
