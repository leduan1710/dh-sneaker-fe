import React, { useState, useEffect } from 'react';
import {
    Box,
    IconButton,
    Avatar,
    Button,
    MenuItem,
    FormHelperText,
    FormControl,
    Select,
    Stack,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    TextField,
    SelectChangeEvent,
    styled,
    DialogActions,
} from '@mui/material';

import UploadTwoToneIcon from '@mui/icons-material/UploadTwoTone';

import { CategoryModel } from '../../../../models/category';
import { HOST_BE } from '../../../../common/Common';
import { toastSuccess, toastWarning } from '../../../../untils/Logic';
import axios from 'axios';
import { useSelector, useStore } from 'react-redux';
import { GetApi, PostApi } from '../../../../untils/Api';
import { useTranslation } from 'react-i18next';
import InventoryIcon from '@mui/icons-material/Inventory';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SportsScoreIcon from '@mui/icons-material/SportsScore';
import FollowTheSignsIcon from '@mui/icons-material/FollowTheSigns';
import { change_is_loading } from '../../../../reducers/Actions';
import { ReducerProps } from '../../../../reducers/ReducersProps';
import CategoryIcon from '@mui/icons-material/Category';
const Input = styled('input')({
    display: 'none',
});

interface DetailDialogProps {
    onClose: () => void;
    open: boolean;
    categories: Array<any>;
    category?: any;
}

const DetailDialog: React.FC<DetailDialogProps> = (props) => {
    const { t } = useTranslation();
    const store = useStore();
    const { onClose, open, categories, category } = props;
    const [selectImage, setSelectImage] = useState<File | null>(null);
    const [numberOrder, setNumberOrder] = useState<number>(0);
    const [numberProduct, setNumberProduct] = useState<number>(0);
    const isLoading = useSelector((state: ReducerProps) => state.isLoading);
    const categoryLvl1s = categories.filter((cate) => !cate.previousId);

    const getData = async () => {
        if (category) {
            store.dispatch(change_is_loading(true));
            const resOrders = await GetApi(`/admin/get/number-order/${category.id}`, localStorage.getItem('token'));
            const resSales = await GetApi(`/admin/get/number-product/${category.id}`, localStorage.getItem('token'));
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
                        <DialogTitle sx={{ textTransform: 'capitalize' }}>{t('shop.Detail')}</DialogTitle>
                        <DialogContent>
                            <TextField
                                margin="dense"
                                id="name"
                                name="name"
                                label={t('shop.Name')}
                                type="text"
                                fullWidth
                                InputProps={{
                                    readOnly: true,
                                }}
                                value={category ? category.name : '...'}
                                variant="outlined"
                                sx={{ mb: 1 }}
                                // onChange={(event: ChangeEvent<HTMLInputElement>) =>{setCategoryName(event.target.value)}}
                            />
                            <TextField
                                margin="dense"
                                id="phone"
                                name="phone"
                                label={t('shop.Phone')}
                                type="phone"
                                fullWidth
                                InputProps={{
                                    readOnly: true,
                                }}
                                value={category ? category.phoneShop : '...'}
                                variant="outlined"
                                sx={{ mb: 1 }}
                                // onChange={(event: ChangeEvent<HTMLInputElement>) =>{setCategoryName(event.target.value)}}
                            />
                            <div className="pb-12">
                                {t('shopProfile.Describe')}: {category?.describeShop ? category?.describeShop : '...'}
                            </div>
                            <div className="grid grid-cols-2 gap-6 mt-2">
                                <div className="p-3 flex items-center box-shadow rounded-xl">
                                    <InventoryIcon />
                                    {t('admin.NumberOrder')}:&nbsp;
                                    <div className="font-bold text-blue-500"> {numberOrder}</div>
                                </div>
                                <div className="p-3 flex items-center box-shadow rounded-xl">
                                    <CategoryIcon />
                                    {t('product.Product')}:&nbsp;
                                    <div className="font-bold text-blue-500">{numberProduct}</div>
                                </div>
                                <div className="p-3 flex items-center box-shadow rounded-xl">
                                    <SportsScoreIcon />
                                    {t('admin.Point')}:&nbsp;
                                    <div className="font-bold text-blue-500">{category?.point}</div>
                                </div>
                                <div className="p-3 flex items-center box-shadow rounded-xl">
                                    <FollowTheSignsIcon />
                                    {t('admin.Follow')}:&nbsp;
                                    <div className="font-bold text-blue-500">{category?.userFollowIdList.length}</div>
                                </div>
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
                                        category && category.image
                                            ? category.image.startsWith('uploads')
                                                ? `${HOST_BE}/${category.image}`
                                                : category.image
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
