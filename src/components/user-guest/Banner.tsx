import React, { useEffect, useState } from 'react';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import { GetGuestApi } from '../../untils/Api';
import { HOST_BE } from '../../common/Common';
interface BannerProps {}
const Banner: React.FC<BannerProps> = (props) => {
    const [banners, setBanners] = useState<any>([]);
    const getDataBanner = async () => {
        const res = await GetGuestApi('/api/get-banner');
        if (res.data.message == 'Success') {
            setBanners(res.data.banner);
        }
    };
    useEffect(() => {
        // getDataBanner();
    }, []);
    return (
        <div className="rounded-lg">
            <div className="rounded-lg">
                        <img
                            className="rounded-lg"
                            style={{ objectFit: 'cover', height: 550, width: '100%' }}
                            src={require('../../static/dhsneaker-banner.png')}
                        />
                    </div>
            {banners.length > 0 ? (
                <Carousel
                    className="cursor-pointer"
                    showThumbs={false}
                    showArrows={false}
                    showStatus={false}
                    autoPlay={true}
                    infiniteLoop={true}
                    stopOnHover={true}
                >
                    {banners.map((banner: any) => (
                        <div className="rounded-lg" onClick={() => (window.location.href = banner.link)}>
                            <img
                                className="rounded-lg"
                                style={{ objectFit: 'cover', height: 550, width: '100%' }}
                                src={`${HOST_BE}/${banner.image}`}
                            />
                        </div>
                    ))}
                    {/* <div className="rounded-lg">
                        <img
                            className="rounded-lg"
                            style={{ objectFit: 'cover', height: 328, width: '100%' }}
                            src="https://salt.tikicdn.com/cache/w750/ts/tikimsp/e2/44/55/ff09c59ea0dc2ce05f26521bb29e16d6.jpg.webp"
                        />
                    </div>
                    <div className="rounded-lg">
                        <img
                            className="rounded-lg"
                            style={{ objectFit: 'cover', height: 328, width: '100%' }}
                            src="https://salt.tikicdn.com/cache/w750/ts/tikimsp/e2/44/55/ff09c59ea0dc2ce05f26521bb29e16d6.jpg.webp"
                        />
                    </div>
                    <div className="rounded-lg">
                        <img
                            className="rounded-lg"
                            style={{ objectFit: 'cover', height: 328, width: '100%' }}
                            src="https://salt.tikicdn.com/cache/w750/ts/tikimsp/e2/44/55/ff09c59ea0dc2ce05f26521bb29e16d6.jpg.webp"
                        />
                    </div>
                    <div className="rounded-lg">
                        <img
                            className="rounded-lg"
                            style={{ objectFit: 'cover', height: 328, width: '100%' }}
                            src="https://salt.tikicdn.com/cache/w750/ts/tikimsp/e2/44/55/ff09c59ea0dc2ce05f26521bb29e16d6.jpg.webp"
                        />
                    </div> */}
                </Carousel>
            ) : null}

            {/* <div className="mt-12 grid grid-cols-6">
                <div className="col-span-6 lg:col-span-2 flex justify-center">
                    <img
                        className="rounded"
                        style={{ objectFit: 'contain', width: '90%' }}
                        src="https://savani.vn/images/banners//original/banner-web1920x680-min_1728524750.webp"
                    />
                </div>
                <div className="col-span-3 mt-12 lg:mt-0 lg:col-span-2 flex justify-center">
                    <img
                        className="rounded"
                        style={{ objectFit: 'contain', width: '90%' }}
                        src="https://savani.vn/images/banners//original/banner-web1920x680-min_1728524750.webp"
                    />
                </div>
                <div className="col-span-3 mt-12 lg:mt-0 lg:col-span-2 flex justify-center">
                    <img
                        className="rounded"
                        style={{ objectFit: 'contain', width: '90%' }}
                        src="https://savani.vn/images/banners//original/banner-web1920x680-min_1728524750.webp"
                    />
                </div>
            </div> */}
        </div>
    );
};

export default Banner;
