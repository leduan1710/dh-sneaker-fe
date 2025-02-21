import React, { useEffect, useState } from 'react';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useSelector, useStore } from 'react-redux';
import { ReducerProps } from '../../../reducers/ReducersProps';

import ReportIcon from '@mui/icons-material/Report';
import { PostApi } from '../../../untils/Api';
import { change_user } from '../../../reducers/Actions';
import { filterSpecialInput, toastInfo, toastSuccess, toastWarning } from '../../../untils/Logic';
import { Dialog, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { Button, Input } from '../../ComponentsLogin';
import { useTranslation } from 'react-i18next';
interface ReportProps {
    top: number | undefined;
    left: number | undefined;
    right: number | undefined;
    bottom: number | undefined;
    productCurrent: any;
}
const values = ['Tên hoặc hình ảnh không phù hợp', 'Sản phẩm nhạy cảm', 'Không phải sản phẩm thời trang'];
const Report: React.FC<ReportProps> = (props) => {
    const { top, left, right, bottom, productCurrent } = props;
    const store = useStore();
    const user = useSelector((state: ReducerProps) => state.user);
    const role = useSelector((state: ReducerProps) => state.role);
    const { t } = useTranslation();
    const [open, setOpen] = useState<boolean>(false);
    const [value, setValue] = useState<any>(0);
    const [valueOther, setValueOther] = useState<any>('');

    const handleReportProduct = async () => {
        if (user && role == 'SHOP' && user.shopId == productCurrent.shopId) {
        } else {
            if (user.productReportIdList.includes(productCurrent.id)) {
                toastInfo('Reported');
            } else {
                if (value == 3) {
                    if (valueOther == '') {
                        toastWarning(t('auth.Please enter complete information'));
                    } else {
                        const res = await PostApi('/user/report-product', localStorage.getItem('token'), {
                            productId: productCurrent.id,
                            describe: valueOther,
                        });
                        if (res.data.message == 'Success') {
                            toastSuccess(t('auth.Success'));
                            setOpen(false);
                            store.dispatch(change_user(res.data.new_user));
                        }
                    }
                } else {
                    const res = await PostApi('/user/report-product', localStorage.getItem('token'), {
                        productId: productCurrent.id,
                        describe: values[value],
                    });
                    if (res.data.message == 'Success') {
                        toastSuccess(t('auth.Success'));
                        setOpen(false);
                        store.dispatch(change_user(res.data.new_user));
                    }
                }
            }
        }
    };
    const handleClose = () => {
        setOpen(false);
    };
    const handleOpen = () => {
        setOpen(true);
    };
    return (
        <div
            style={{ zIndex: 100 }}
            className={`absolute bottom-${bottom} right-${right} top-${top} left-${left} flex items-center `}
        >
            <div
                onClick={handleOpen}
                className="ml-3 transition-transform transform cursor-pointer hover:scale-110 duration-300"
            >
                <ReportIcon sx={{ height: 29, width: 29 }} className="text-red-500" />
            </div>
            <React.Fragment>
                <Dialog
                    open={open}
                    keepMounted
                    onClose={handleClose}
                    PaperProps={{
                        style: {
                            padding: '30px',
                        },
                    }}
                >
                    <RadioGroup
                        aria-labelledby="demo-radio-buttons-group-label"
                        defaultValue="female"
                        name="radio-buttons-group"
                        onChange={(e: any) => setValue(e.target.value)}
                        value={value}
                    >
                        <FormControlLabel value={0} control={<Radio />} label={t('product.InappropriateNameOrImage')} />
                        <FormControlLabel value={1} control={<Radio />} label={t('product.SensitiveProduct')} />
                        <FormControlLabel value={2} control={<Radio />} label={t('product.NotAFashionProduct')} />
                        <FormControlLabel value={3} control={<Radio />} label={t('orther.Other')} />
                        {value == 3 ? (
                            <Input
                                value={valueOther}
                                onChange={(e: any) => filterSpecialInput(e.target.value, setValueOther)}
                            />
                        ) : null}
                        <Button onClick={handleReportProduct} className="mt-6">
                            {t('action.Send')}
                        </Button>
                    </RadioGroup>
                </Dialog>
            </React.Fragment>
        </div>
    );
};
export default Report;
