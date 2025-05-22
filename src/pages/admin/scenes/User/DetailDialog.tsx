import React, { useState, useEffect } from 'react';
import {
    Box,
    IconButton,
    Avatar,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    styled,
    DialogActions,
} from '@mui/material';

import { CategoryModel } from '../../../../models/category';
import { HOST_BE } from '../../../../common/Common';
import { toastSuccess, toastWarning } from '../../../../untils/Logic';
import axios from 'axios';
import { useSelector, useStore } from 'react-redux';
import { GetApi, PostApi } from '../../../../untils/Api';
import { useTranslation } from 'react-i18next';
import { change_is_loading } from '../../../../reducers/Actions';
import { ReducerProps } from '../../../../reducers/ReducersProps';

interface DetailDialogProps {
    onClose: () => void;
    open: boolean;
    users: Array<any>;
    user?: any;
}

const DetailDialog: React.FC<DetailDialogProps> = (props) => {
    const { t } = useTranslation();
    const store = useStore();
    const { onClose, open, users, user } = props;
    const [selectImage, setSelectImage] = useState<File | null>(null);
    const [numberOrder, setNumberOrder] = useState<number>(0);
    const [numberProduct, setNumberProduct] = useState<number>(0);
    const isLoading = useSelector((state: ReducerProps) => state.isLoading);

    const getData = async () => {
        if (user) {
            store.dispatch(change_is_loading(true));
            const resOrders = await GetApi(`/admin/get/number-order/${user.id}`, localStorage.getItem('token'));
            const resSales = await GetApi(`/admin/get/number-product/${user.id}`, localStorage.getItem('token'));
            if (resOrders.data.message == 'Success') {
                setNumberOrder(resOrders.data.number);
            }
            if (resSales.data.message == 'Success') {
                setNumberProduct(resSales.data.number);
            }
            store.dispatch(change_is_loading(false));
        }
    };
    useEffect(() => {
        if (open) {
            getData();
        }
    }, [open]);

    const handleClose = () => {
        onClose();
        setSelectImage(null);
    };

    return (
        <>
            {!isLoading ? (
                <Dialog onClose={handleClose} open={open}>
                    <Dialog maxWidth="md" open={open} onClose={handleClose}>
                        <DialogTitle sx={{ textTransform: 'capitalize' }}>{t('user.Profile')}</DialogTitle>
                        <DialogContent>
                            <div className="font-bold p-6">Email: {user?.email || '...'}</div>
                            <div className="font-bold p-6">
                                {t('user.Name')}: {user?.name || '...'}
                            </div>
                            <div className="font-bold p-6">
                                {t('user.Phone')}: {user?.phone || '...'}
                            </div>

                            <div style={{ width: 400 }} className="grid grid-cols-2 gap-4 mt-2 pl-6 pr-6">
                                <div className="p-2 flex items-center box-shadow rounded-xl">
                                    {t('user.Rank')}:&nbsp;
                                    <div className="font-bold text-blue-500">
                                        {' '}
                                        {user?.point < 1000
                                            ? t('user.Bronze')
                                            : user?.point < 2000
                                            ? t('user.Silver')
                                            : user?.point < 3000
                                            ? t('user.Gold')
                                            : t('user.Diamond')}
                                    </div>
                                </div>
                                <div className="p-2 flex items-center box-shadow rounded-xl">
                                    {t('user.Orders')}:&nbsp;
                                    <div className="font-bold text-blue-500">{user?.orderIdList.length}</div>
                                </div>
                                <div className="p-2 flex items-center box-shadow rounded-xl">
                                    {t('admin.Point')} :&nbsp;
                                    <div className="font-bold text-blue-500">{user?.point}</div>
                                </div>
                                {/* <div className="p-3 flex items-center box-shadow rounded-xl">
                                    <FollowTheSignsIcon />
                                    {t('admin.Follow')} :&nbsp;
                                    <div className="font-bold text-blue-500">{category?.userFollowIdList.length}</div>
                                </div> */}
                            </div>
                            <Box
                                sx={{
                                    position: 'relative',
                                    display: 'inline-flex',
                                    marginTop: 5,
                                    justifyContent: 'center',
                                    width: '100%',
                                }}
                            >
                                <Avatar
                                    variant="square"
                                    sx={{ minWidth: 200, minHeight: 200, borderRadius: '100%' }}
                                    src={
                                        user && user.image
                                            ? user.image.startsWith('uploads')
                                                ? `${HOST_BE}/${user.image}`
                                                : user.image
                                            : undefined
                                    }
                                />
                            </Box>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose}>{t('action.Close')}</Button>
                        </DialogActions>
                    </Dialog>
                </Dialog>
            ) : null}
        </>
    );
};

export default DetailDialog;
