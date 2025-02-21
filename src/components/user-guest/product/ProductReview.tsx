import React, { useEffect, useState } from 'react';
import { GetGuestApi } from '../../../untils/Api';
import ProductReviewItem from './ProductReviewItem';

interface ProductReviewProps {
    productId: any;
}
const ProductReview: React.FC<ProductReviewProps> = (props) => {
    const { productId } = props;
    const [reviews, setReviews] = useState<any>(undefined);
    const [take, setTake] = useState<number>(60);
    const [skip, setSkip] = useState<number>(0);
    const getData = async () => {
        const res = await GetGuestApi(`/api/review-by-product/${productId}/${take}/${skip}`);
        if (res.data.message == 'Success') {
            setReviews(res.data.reviews);
        }
    };
    useEffect(() => {
        getData();
    }, []);
    return (
        <div className="">
            {reviews ? reviews.map((review: any) => <ProductReviewItem review={review} key={review.id} />) : null}
        </div>
    );
};

export default ProductReview;
