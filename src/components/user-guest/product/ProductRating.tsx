import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import { GetGuestApi } from '../../../untils/Api';
import { ContactlessOutlined } from '@mui/icons-material';

interface ProductRatingProps {
    productId: any;
}
const ProductRating: React.FC<ProductRatingProps> = (props) => {
    const { productId } = props;
    const [value, setValue] = React.useState<number | null>();
    const getAverageRating = async () => {
        const averageRating = await GetGuestApi(`/api/average-review-by-product/${productId}`);
        if (averageRating.data.message == 'Success') {
            setValue(parseFloat(averageRating.data.averageReview));
        }
    };
    useEffect(() => {
        getAverageRating();
    }, []);
    return (
        <div className="flex items-center">
            <div className="mr-3 font-normal underline">Rating : {value}</div>
            <Box sx={{ '& > legend': { mt: 2 }, display: 'flex', alignItems: 'center' }}>
                <Rating name="simple-controlled" precision={0.1} value={value ? value : 0} disabled={true} />
            </Box>
        </div>
    );
};

export default ProductRating;
