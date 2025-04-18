import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { HOST_BE } from '../../../common/Common';
import { formatPrice } from '../../../untils/Logic';

interface ProductCardProps {
    imageUrl: any;
    title: any;
    price: any;
    salePrice: any;
    rating: any;
    color: any;
}

const ProductCard: React.FC<ProductCardProps> = ({ imageUrl, title, price, rating, color, salePrice }) => {
    return (
        <Box
            sx={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: 0,
                boxShadow: 2,
                maxWidth: '260px',
                height: '460px',
                position: 'relative',
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
                    color: 'rgba(7, 110, 145, 0.89)',
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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 2, ml: 1.5 }}>
                <Typography variant="body2" sx={{ color: 'black' }}>
                    {rating}
                </Typography>
            </Box>
            <Typography
                variant="h6"
                sx={{ marginTop: 1, textAlign: 'left', mx: 1.5, height: '40px', fontSize: '14px' }}
            >
                {title}
            </Typography>
            <Box
                sx={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    border: '1px solid rgba(200, 200, 200, 0.7)',
                    backgroundColor: color, // Sử dụng mã màu truyền vào
                    marginRight: 1,
                    ml: 1.5,
                    marginY: 1.5,
                }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', ml: 1.5 }}>
                <Typography variant="body2" sx={{ color: salePrice ? 'red':'#111111', fontWeight: 'bold' }}>
                    {formatPrice(price)}
                </Typography>
                {salePrice && (
                    <Typography
                        variant="body2"
                        sx={{
                            marginLeft: 1,
                            textDecoration: 'line-through',
                            fontWeight: '600'
                        }}
                    >
                        {formatPrice(salePrice)}
                    </Typography>
                )}
            </Box>
        </Box>
    );
};

export default ProductCard;
