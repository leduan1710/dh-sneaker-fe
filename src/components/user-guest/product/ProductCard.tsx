import React from 'react';
import { Box, Typography } from '@mui/material';
import { HOST_BE } from '../../../common/Common';
import { formatPrice } from '../../../untils/Logic';
import { Link } from 'react-router-dom';

interface ProductCardProps {
    productId: any;
    imageUrl: any;
    title: any;
    price: any;
    salePrice: any;
    rating: any;
    color: any;
}

const ProductCard: React.FC<ProductCardProps> = ({ imageUrl, title, price, rating, color, salePrice, productId }) => {
    return (
        <Link to={`/product/${productId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <Box
                sx={{
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    padding: 0,
                    boxShadow: 2,
                    maxWidth: '260px',
                    height: {md: '460px', xs: '360px'},
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column', // Sắp xếp theo cột
                    justifyContent: 'space-between', // Đảm bảo các phần tử cách đều
                    transition: 'box-shadow 0.3s, transform 0.3s',
                    '&:hover': {
                        boxShadow: '0px 6px 10px rgba(0, 0, 0, 0.2)',
                        transform: 'scale(1.02)',
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
                    src={imageUrl.startsWith('uploads') ? `${HOST_BE}/${imageUrl}` : imageUrl}
                    alt={title}
                    style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
                />
                <Box sx={{ padding: '16px', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ color: 'black' }}>
                            {rating}
                        </Typography>
                    </Box>
                    <Typography
                        variant="h6"
                        sx={{ marginTop: 1, textAlign: 'left', fontSize: '14px', height: '30px', mb: 2 }}
                    >
                        {title}
                    </Typography>
                    <Box
                        sx={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            border: '1px solid rgba(200, 200, 200, 0.7)',
                            backgroundColor: color,
                            marginY: 1.5,
                        }}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Typography variant="body2" sx={{ color: salePrice ? 'red' : '#111111', fontWeight: 'bold' }}>
                            {formatPrice(price)}
                        </Typography>
                        {salePrice > 0 && (
                            <Typography
                                variant="body2"
                                sx={{
                                    marginLeft: 1,
                                    textDecoration: 'line-through',
                                    fontWeight: '600',
                                }}
                            >
                                {formatPrice(salePrice)}
                            </Typography>
                        )}
                    </Box>
                </Box>
            </Box>
        </Link>
    );
};

export default ProductCard;