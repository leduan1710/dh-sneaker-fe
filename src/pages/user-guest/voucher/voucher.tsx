import React, { useEffect, useState } from 'react';
import LeftNav from '../../../components/user-guest/info-user/LeftNav';
import { useTranslation } from 'react-i18next';
import { Divider } from '@mui/material';
import { GetApi } from '../../../untils/Api';
import { useSelector } from 'react-redux';
import { ReducerProps } from '../../../reducers/ReducersProps';
import { formatPrice } from '../../../untils/Logic';
import { formatDistanceToNow } from 'date-fns';
import { enUS, vi } from 'date-fns/locale';

interface VoucherProps {}
const Voucher: React.FC<VoucherProps> = (props) => {
    const { t } = useTranslation();
    const [vouchers, setVouchers] = useState<any>(undefined);
    const getData = async () => {
        const res = await GetApi('/user/get-voucher-by-user', localStorage.getItem('token'));
        if (res.data.message == 'Success') {
            setVouchers(res.data.vouchers);
        }
    };
    const user = useSelector((state: ReducerProps) => state.user);
    const lng = useSelector((state: ReducerProps) => state.lng);

    useEffect(() => {
        getData();
    }, []);
    return (
        <>
            <div className="container marginTop">
                <div className="grid grid-cols-4 gap-4">
                    <div className="hidden lg:block col-span-1 bg-white box-shadow rounded-xl">
                        <LeftNav index={4} />
                    </div>
                    <div className="col-span-4 lg:col-span-3 mt-12 lg:mt-0 box-shadow rounded-xl p-3  border-light">
                        <h1 className="text-center text-2xl pb-3">{t('user.YourVoucher')}</h1>
                        <Divider />
                        <div className="mt-3 grid grid-cols-4 gap-4">
                            {vouchers && user.id? (
                                vouchers.map((voucher: any) => (
                                    <>
                                        <div className="col-span-2 xl:col-span-1 voucher box-shadow rounded-xl p-3 select-none relative">
                                            <h2 className="voucher-title text-center">{voucher.name}</h2>
                                            <p className="voucher-discount  absolute top-3 left-0 text-sm opacity-70">
                                                - {formatPrice(voucher.reduce)}
                                            </p>
                                            <p className="text-sm text-center">
                                                {t('shop.Condition')} : {formatPrice(voucher.condition)}
                                            </p>
                                            <p
                                                style={{
                                                    backgroundColor: user
                                                        ? user.voucherIdList.includes(voucher.id)
                                                            ? 'gray'
                                                            : undefined
                                                        : undefined,
                                                }}
                                                className={`voucher-code text-center cursor-pointer transition-all duration-500 ${
                                                    user
                                                        ? user.voucherIdList.includes(voucher.id)
                                                            ? 'cursor-not-allowed'
                                                            : 'hover:opacity-80'
                                                        : ''
                                                }`}
                                            >
                                                Code: <strong>{voucher.code}</strong>
                                            </p>
                                            <p className="voucher-expiry text-center">
                                                {t('shop.Expery')}:
                                                {lng == 'vn'
                                                    ? formatDistanceToNow(voucher.expired, {
                                                          addSuffix: true,
                                                          locale: vi,
                                                      })
                                                    : formatDistanceToNow(voucher.expired, {
                                                          addSuffix: true,
                                                          locale: enUS,
                                                      })}
                                            </p>
                                            {user ? (
                                                user.voucherIdList.includes(voucher.id) ? (
                                                    <div className="absolute top-1 right-1">
                                                        <img
                                                            style={{ width: 50, height: 50, objectFit: 'cover' }}
                                                            src={require('../../../static/claimed.png')}
                                                        />
                                                    </div>
                                                ) : null
                                            ) : null}
                                        </div>
                                    </>
                                ))
                            ) : (
                                <></>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Voucher;
