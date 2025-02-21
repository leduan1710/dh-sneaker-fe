import React from 'react';
import { useSelector, useStore } from 'react-redux';
import { ReducerProps } from '../../../reducers/ReducersProps';
import { Button } from '@mui/material';
import { formatPrice, toastWarning } from '../../../untils/Logic';
import { useTranslation } from 'react-i18next';
import { PostApi } from '../../../untils/Api';
import { change_is_loading, change_user } from '../../../reducers/Actions';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { enUS } from 'date-fns/locale';
import { AlertLogin } from '../../alert/Alert';
interface ListVoucherProps {
    vouchers: any;
}
const ListVoucher: React.FC<ListVoucherProps> = (props) => {
    const { vouchers } = props;
    const user = useSelector((state: ReducerProps) => state.user);
    const store = useStore();
    const { t } = useTranslation();
    const lng = useSelector((state: ReducerProps) => state.lng);
    const handleClaim = async (voucherId: any) => {
        if (!user.id) {
            AlertLogin();
            return;
        }
        if (user.voucherIdList.includes(voucherId)) {
            return;
        }
        store.dispatch(change_is_loading(true));
        const res = await PostApi(`/user/claim-voucher/${voucherId}`, localStorage.getItem('token'), {});
        if (res.data.message == 'Success') {
            store.dispatch(change_user(res.data.new_user));
        }
        if (res.data.message == 'Run out of voucher') {
            toastWarning(t('toast.VoucherOutOfStock'));
        }
        if (res.data.message == 'Voucher used') {
            toastWarning(t('toast.VoucherHasUsed'));
        }
        store.dispatch(change_is_loading(false));
    };
    return (
        <div className="grid grid-cols-5 gap-4 mt-6">
            {vouchers.map((voucher: any) => (
                // <div key={voucher.id} className="col-span-2 xl:col-span-1 bg-blue-300 rounded-xl relative">
                //     {voucher.name}
                //     {voucher.reduce}
                //     {voucher.condition}
                //     <Button>Claim</Button>
                // </div>
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
                                backgroundColor: user.id
                                    ? user.voucherIdList.includes(voucher.id)
                                        ? 'gray'
                                        : undefined
                                    : undefined,
                            }}
                            onClick={() => handleClaim(voucher.id)}
                            className={`voucher-code text-center cursor-pointer transition-all duration-500 ${
                                user.id
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
                        {user.id ? (
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
            ))}
        </div>
    );
};

export default ListVoucher;
