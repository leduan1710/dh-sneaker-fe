import React, { useEffect, useState } from 'react';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import { GetGuestApi } from '../../untils/Api';
import { HOST_BE } from '../../common/Common';
interface BannerShopProps {}
const BannerShop: React.FC<BannerShopProps> = (props) => {
    const [banners, setBanners] = useState<any>([]);
    const getDataBanner = async () => {
        const res = await GetGuestApi('/api/get-banner-common');
        if (res.data.message == 'Success') {
            setBanners(res.data.banner);
            console.log(res.data.banner);
        }
    };
    useEffect(() => {
        getDataBanner();
    }, []);
    return (
        <div>
            {banners.length >= 3 ? (
                <div className="mt-12 grid grid-cols-6">
                    <div
                        onClick={() => (window.location.href = banners[0].link)}
                        className="col-span-6 lg:col-span-2 flex justify-center cursor-pointer"
                    >
                        <img
                            className="rounded"
                            style={{ objectFit: 'contain', width: '90%' }}
                            src={
                                banners[0].image
                                    ? banners[0].image.startsWith('uploads')
                                        ? `${HOST_BE}/${banners[0].image}`
                                        : banners[0].image
                                    : ''
                            }
                        />
                    </div>
                    <div
                        onClick={() => (window.location.href = banners[1].link)}
                        className="col-span-3 mt-12 lg:mt-0 lg:col-span-2 flex justify-center cursor-pointer"
                    >
                        <img
                            className="rounded"
                            style={{ objectFit: 'contain', width: '90%' }}
                            src={
                                banners[1].image
                                    ? banners[1].image.startsWith('uploads')
                                        ? `${HOST_BE}/${banners[1].image}`
                                        : banners[1].image
                                    : ''
                            }
                        />
                    </div>
                    <div
                        onClick={() => (window.location.href = banners[2].link)}
                        className="col-span-3 mt-12 lg:mt-0 lg:col-span-2 flex justify-center cursor-pointer"
                    >
                        <img
                            className="rounded"
                            style={{ objectFit: 'contain', width: '90%' }}
                            src={
                                banners[2].image
                                    ? banners[2].image.startsWith('uploads')
                                        ? `${HOST_BE}/${banners[2].image}`
                                        : banners[2].image
                                    : ''
                            }
                        />
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default BannerShop;
