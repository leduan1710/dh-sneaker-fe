import React from 'react';
import { useTranslation } from 'react-i18next';

interface FooterProps {}
const Footer: React.FC<FooterProps> = (props) => {
    const {t} = useTranslation();
    return (
        <>
            <div className="bg-black mt-12 p-6 ">
                <div
                    style={{
                        height: 300,
                    }}
                    className="grid grid-cols-2 lg:grid-cols-4 container text-white p-3 gap-6"
                >
                    <div className="info">
                        <div className="text-xl">{t('footer.Contact')}</div>
                        
                    </div>
                    <div className="info pl-4">
                        <h1 className="text-xl">{t('footer.Services')}</h1>
                        <div className="mt-6">
                            <strong>Chính sách đổi/trả</strong>
                        </div>
                        <div className="mt-6">
                            <strong>Hướng dẫn chọn size</strong>
                        </div>
                    </div>
                    <div className="info pl-4">
                        <h1 className="text-xl">{t('footer.AboutUs')}</h1>
                        <div className="mt-6">
                            <strong>Nhận diện</strong>
                        </div>
                        <div className="mt-6">
                            <strong>Giá trị cốt lõi</strong>
                        </div>
                    </div>
                    <div className="info pl-4 relative">
                        <h1 className="text-xl">{t('footer.Payment')}</h1>
                        <div className="mt-6">
                            <strong>Ví wallet</strong>
                        </div>
                        <div className="mt-6">
                            <strong>Paypal</strong>
                        </div>
                        <img className='absolute bottom-0 right-10' src="https://cdn.pixabay.com/photo/2015/05/26/09/37/paypal-784404_1280.png" />
                    </div>
                </div>
            </div>
        </>
    );
};
export default Footer;
