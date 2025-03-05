import React from 'react';
import { Container } from '@mui/material';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

const HotStyle = () => {
    const items = [
        {
            id: 1,
            href: '/pages/loyalty-page',
            imgSrc: 'https://www.crocs.com.vn/cdn/shop/files/loyalty_icon_99b6d854-afa5-4299-873e-4842c70cc93d_1200x.png?v=1714113140',
            label: 'Adidas Adilette 22 Slides - Off White',
            price: '650.000 VNĐ',
        },
        {
            id: 2,
            href: '/collections/hang-moi',
            imgSrc: 'https://www.crocs.com.vn/cdn/shop/files/Home_Cate_Icon-08_4f396d6e-433c-4f03-90ca-f4167f3e2591_1200x.jpg?v=1736132641',
            label: 'Adidas Adilette 22 Slides - Light Brown',
            price: '650.000 VNĐ',
        },
        {
            id: 3,
            href: '/collections/giay-dep-crocs-de-cao',
            imgSrc: 'https://www.crocs.com.vn/cdn/shop/files/Home_Cate_Icon-02_ce1a35b4-8c79-4fae-a5f5-ec30f8f5438d_1200x.jpg?v=1736132642',
            label: 'Adidas Adilette 22 Slides - Preloved Green',
            price: '650.000 VNĐ',
        },
        {
            id: 4,
            href: '/collections/giay-dep-crocs-chinh-hang-ban-chay-nhat',
            imgSrc: 'https://www.crocs.com.vn/cdn/shop/files/Home_Cate_Icon-04_1_1200x.jpg?v=1737442915',
            label: 'Adidas Adilette 22 Slides - Cloud White',
            price: '650.000 VNĐ',
        },
    ];

    const responsive = {
        superLargeDesktop: {
            breakpoint: { max: 4000, min: 1024 },
            items: 4,
        },
        desktop: {
            breakpoint: { max: 1280, min: 1024 },
            items: 3,
        },
        tablet: {
            breakpoint: { max: 1024, min: 500 },
            items: 2,
        },
        mobile: {
            breakpoint: { max: 500, min: 0 },
            items: 1,
        },
    };

    return (
        <Container>
            <Carousel
                swipeable={true}
                draggable={false}
                showDots={false}
                responsive={responsive}
                ssr={true}
                infinite={true}
                autoPlay={true}
                autoPlaySpeed={5000}
                keyBoardControl={true}
                customTransition="transform 1000ms ease-in-out"
                containerClass="carousel-container"
                itemClass="carousel-item-padding-40-px"
            >
                {items.map((item) => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'center' }}>
                        <a href={item.href} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <div
                                style={{
                                    height: '240px',
                                    width: '240px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <img
                                    src={item.imgSrc}
                                    alt={item.label}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        borderRadius: '8px',
                                    }}
                                />
                            </div>
                        </a>
                    </div>
                ))}
            </Carousel>
        </Container>
    );
};

export default HotStyle;
