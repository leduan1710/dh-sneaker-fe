import React, { useEffect, useState } from 'react';
import { GetGuestApi } from '../../../untils/Api';
import { HOST_BE } from '../../../common/Common';
import { Divider, Rating } from '@mui/material';
import { useSelector } from 'react-redux';
import { ReducerProps } from '../../../reducers/ReducersProps';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { enUS } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
interface ProductReviewItemProps {
    review: any;
}
const ProductReviewItem: React.FC<ProductReviewItemProps> = (props) => {
    const { review } = props;
    const [userReview, setUserReview] = useState<any>(undefined);
    const user = useSelector((state: ReducerProps) => state.user);
    const { t } = useTranslation();
    const getUserReview = async () => {
        const res = await GetGuestApi(`/api/user-review/${review.userId}`);
        if (res.data.message == 'Success') {
            setUserReview(res.data.user);
        }
    };
    const lng = useSelector((state: ReducerProps) => state.lng);
    useEffect(() => {
        getUserReview();
    }, []);
    return (
        <div className="font-normal select-none">
            <div className="pl-6">
                {userReview ? (
                    <div className="flex col-span-1 grid grid-cols-4 xl:grid-cols-5">
                        <div className="col-span-1  pt-3 pl-3 border-r border-gray-300">
                            <div className="flex">
                                <img
                                    className="rounded-xl"
                                    style={{
                                        width: 50,
                                        height: 50,
                                        objectFit: 'cover',
                                    }}
                                    src={`${HOST_BE}/${userReview.image}`}
                                />
                                <div className="ml-3">
                                    <div className="font-bold ">
                                        {review.userId == user.id ? 'You' : userReview.email}
                                    </div>
                                    <div>
                                        {lng == 'vn'
                                            ? formatDistanceToNow(review.createDate, {
                                                  addSuffix: true,
                                                  locale: vi,
                                              })
                                            : formatDistanceToNow(review.createDate, {
                                                  addSuffix: true,
                                                  locale: enUS,
                                              })}
                                    </div>
                                </div>
                            </div>
                            <div className="text-xs mt-1 ml-1">
                                {t('product.NumberReview')} {userReview.reviewIdList.length}
                            </div>
                        </div>
                        <div className="text-sm col-span-3 xl:col-span-4 ml-6">
                            <div>
                                <Rating precision={0.1} name="disabled" value={review.rate} disabled />
                            </div>
                            <div className="review-style mt-1 text-sm">
                                <div dangerouslySetInnerHTML={{ __html: review.content }} />
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>
            <div className="mt-3 mb-3">
                <Divider />
            </div>
            
        </div>
    );
};

export default ProductReviewItem;
