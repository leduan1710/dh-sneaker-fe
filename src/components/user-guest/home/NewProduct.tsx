import React, { useEffect, useState } from 'react';
import { Container, Typography, Box } from '@mui/material';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { PostGuestApi } from '../../../untils/Api';
import { HOST_BE } from '../../../common/Common';
import { formatPrice } from '../../../untils/Logic';
import { Link } from 'react-router-dom';

const NewProducts = () => {
    const [listProduct, setListProduct] = useState<any>([]);
    const getNewProduct = async () => {
        const resProducts = await PostGuestApi(`/api/get-new-product/${20}/${1}`, {
            options: {
                sort: null,
            },
        });
        if (resProducts.data.message == 'Success') {
            const filterProduct = resProducts.data.products.filter((product: any) => product != null);
            setListProduct(filterProduct);
        }
    };
    useEffect(() => {
        getNewProduct();
    }, []);

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
        <Container sx={{ mb: 5, mt: 5, textAlign: 'center' }}>
            <Typography variant="h2" mb={5} fontSize={35} fontWeight={600} color={'#111'}>
                🌻HÀNG MỚI🌻
            </Typography>
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
                {listProduct.map((product: any) => (
                    <div key={product.id} style={{ display: 'flex', justifyContent: 'center', minHeight: "365px", paddingTop: "8px" }}>
                        <Link
                            to={`/product/${product.id}`}
                            style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                            <Box
                                sx={{
                                    border: '1px solid #ddd',
                                    borderRadius: '8px',
                                    padding: 0,
                                    boxShadow: 2,
                                    maxWidth: '230px',
                                    height: '340px',
                                    position: 'relative',
                                    transition: 'box-shadow 0.3s, transform 0.3s',
                                    overflow: 'hidden',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    '&:hover': {
                                        boxShadow: '0px 6px 10px rgba(0, 0, 0, 0.2)',
                                        transform: 'scale(1.05)',
                                    },
                                }}
                            >
                                <Typography
                                    variant="caption"
                                    sx={{
                                        position: 'absolute',
                                        top: 8,
                                        right: 8,
                                        color: 'rgba(10, 70, 127, 0.89)',
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        fontWeight: 'bold',
                                        fontSize: '16px',
                                    }}
                                >
                                    MỚI
                                </Typography>
                                <img
                                    src={
                                        product.image.startsWith('uploads')
                                            ? `${HOST_BE}/${product.image}`
                                            : product.image
                                    }
                                    alt={product.name}
                                    style={{
                                        width: '100%',
                                        height: 'auto',
                                        borderRadius: '8px',
                                    }}
                                />
                                <Typography
                                    variant="h6"
                                    sx={{
                                        mt: 0, // Set margin top to 0
                                        mb: 0, // Set margin bottom to 0
                                        textAlign: 'left',
                                        mx: 1.5,
                                        height: '40px',
                                        fontSize: '14px',
                                    }}
                                >
                                    {product.name}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{ color: '#111111', fontWeight: 'bold', textAlign: 'left', mx: 1.5, mb: 3 }}
                                >
                                    {formatPrice(product.sellPrice)}
                                </Typography>
                            </Box>
                        </Link>
                    </div>
                ))}
            </Carousel>
        </Container>
    );
};

export default NewProducts;
