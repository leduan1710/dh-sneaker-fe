import React from 'react';
import { Box, Typography, Button } from '@mui/material';

interface ProductCardProps {
    imageUrl: string;
    title: string;
    price: string;
    rating: string;
    reviews: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ imageUrl, title, price, rating, reviews }) => {
    return (
        <Box
            sx={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: 2,
                boxShadow: 2,
                maxWidth: '240px',
                position: 'relative',
            }}
        >
            <Typography
                variant="caption"
                sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    color: '#007bff',
                    padding: '4px 8px',
                    borderRadius: '4px',
                }}
            >
                MỚI
            </Typography>
            <img
                src={imageUrl}
                alt={title}
                style={{ width: '100%', height: 'auto', borderRadius: '4px' }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 1 }}>
                <Typography variant="body2" sx={{ color: 'gray' }}>
                    {rating}
                </Typography>
            </Box>
            <Typography variant="h6" sx={{ marginTop: 1, textAlign: 'left' }}>
                {title}
            </Typography>
            <Typography variant="body2" sx={{ color: 'gray', marginY: 1, textAlign: 'left' }}>
                {price}
            </Typography>
            <Button variant="contained" sx={{ width: '100%', backgroundColor: '#007bff', '&:hover': { backgroundColor: '#0056b3' } }}>
                Click&Collect
            </Button>
        </Box>
    );
};

export default ProductCard;