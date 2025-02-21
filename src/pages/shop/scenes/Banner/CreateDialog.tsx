import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    Button,
    TextField,
    DialogContent,
    DialogContentText,
    DialogActions,
    SelectChangeEvent,
    FormControl,
    Select,
    MenuItem,
    Stack,
    FormHelperText,
    styled,
    Box,
    IconButton,
    Avatar,
    Typography,
} from '@mui/material';

import { useSelector, useStore } from 'react-redux';
import { change_is_loading } from '../../../../reducers/Actions';
import UploadTwoToneIcon from '@mui/icons-material/UploadTwoTone';
import { HOST_BE, HOST_FE } from '../../../../common/Common';
import axios from 'axios';
import { formatPrice, toastSuccess, toastWarning } from '../../../../untils/Logic';
import { useTranslation } from 'react-i18next';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { ReducerProps } from '../../../../reducers/ReducersProps';
import { PostApi } from '../../../../untils/Api';

const Input = styled('input')({
    display: 'none',
});

interface CreateBannerDialogProps {
    onClose: () => void;
    open: boolean;
    onUpdate: () => void;
}

const CreateBannerDialog: React.FC<CreateBannerDialogProps> = (props) => {
    const { t } = useTranslation();
    const store = useStore();
    const user = useSelector((state: ReducerProps) => state.user);
    const { onClose, open, onUpdate } = props;

    const [level, setLevel] = useState('COMMON');
    const [selectImage, setSelectImage] = useState<File | null>(null);
    const currentDate = new Date();
    const initialExpireDate = new Date(currentDate);
    initialExpireDate.setDate(currentDate.getDate() + 7);

    const [expireDate, setExpireDate] = useState<Date>(initialExpireDate);

    const handleClose = () => {
        onClose();
        setSelectImage(null);
        setExpireDate(initialExpireDate);
    };
    const checkProductId = async (productId: string) => {
        try {
            const response = await PostApi(`/shop/check/productId`, localStorage.getItem('token'), { productId });
            return response.data.exists;
        } catch (error) {
            console.error('Check code voucher thất bại', error);
            return false;
        }
    };
    const handleSignUpBanner = async (productId: string, image: File) => {
        store.dispatch(change_is_loading(true));
        const formData = new FormData();
        if (productId) formData.append('link', `/product/${productId}`);
        else formData.append('link', `/view-shop/${user.shopId}`);

        formData.append('level', level);
        formData.append('expired', expireDate.toISOString());
        formData.append('shopId', user.shopId);

        if (image) {
            const uniqueFilename = `image_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            const imageBlob = await fetch(URL.createObjectURL(image)).then((response) => response.blob());
            formData.append('file', imageBlob, uniqueFilename);
        }
        try {
            const res = await axios.post(`${HOST_BE}/shop/add/signup-banner`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            switch (res.data.message) {
                case 'Success':
                    toastSuccess(t('toast.Success'));
                    onUpdate();
                    break;
                case 'Not enough money':
                    toastWarning(t('toast.NotEnoughMoneyInWallet'));
                    break;
                case 'Fail':
                    toastWarning(t('toast.Fail'));
                    break;
            }
        } catch (error) {
        } finally {
            store.dispatch(change_is_loading(false));
        }
    };

    return (
        <React.Fragment>
            <Dialog onClose={handleClose} open={open}>
                <Dialog
                    maxWidth="sm"
                    fullWidth
                    open={open}
                    onClose={handleClose}
                    PaperProps={{
                        component: 'form',
                        onSubmit: async (event: React.FormEvent<HTMLFormElement>) => {
                            event.preventDefault();
                            const formData = new FormData(event.currentTarget);
                            const formJson = Object.fromEntries((formData as any).entries());
                            const productId = formJson.productId;
                            const image = formJson.image;

                            if (productId) {
                                if (productId.length != 24) {
                                    toastWarning(t('toast.ProductIdMustBeExactly24Characters'));
                                    return;
                                }
                                const isDuplicate = await checkProductId(productId);
                                if (!isDuplicate) {
                                    toastWarning(t('toast.ProductIdNotFound'));
                                    return;
                                }
                            }

                            await handleSignUpBanner(productId, image);
                            handleClose();
                        },
                    }}
                >
                    <DialogTitle>{t('banner.CreateBanner')}</DialogTitle>
                    <DialogContent>
                        <DialogContentText sx={{ mb: 1 }}>{t('banner.CreateBannerForm')}</DialogContentText>
                        <FormControl variant="outlined" fullWidth>
                            <FormHelperText>{t('banner.ProductId')}</FormHelperText>
                            <TextField
                                id="productId"
                                name="productId"
                                label={t('banner.NoRequire')}
                                type="productId"
                                fullWidth
                                variant="outlined"
                            />
                        </FormControl>

                        <Stack direction="row" spacing={1}>
                            <FormControl variant="outlined" sx={{ m: 1, minWidth: 200 }}>
                                <FormHelperText>{t('banner.Level')}</FormHelperText>
                                <Select
                                    id="select-parent-cate-lvl1"
                                    value={level}
                                    onChange={(event: SelectChangeEvent) => {
                                        setLevel(event.target.value);
                                    }}
                                    required
                                >
                                    <MenuItem value="COMMON">Common</MenuItem>
                                    <MenuItem value="PREMIUM">Premium</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl variant="outlined" sx={{ m: 1, minWidth: 200 }}>
                                <FormHelperText>{t('banner.BannerCost')}</FormHelperText>
                                <TextField
                                    id="link"
                                    name="link"
                                    value={
                                        level
                                            ? level == 'COMMON'
                                                ? formatPrice(30000)
                                                : formatPrice(100000)
                                            : formatPrice(0)
                                    }
                                    type="text"
                                    fullWidth
                                    variant="outlined"
                                />
                            </FormControl>
                        </Stack>
                        <Box>
                            <FormControl variant="outlined" sx={{ mb: 1 }}>
                                <FormHelperText>{t('banner.Expired') + ' *'}</FormHelperText>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DatePicker
                                        value={expireDate}
                                        onChange={(newValue) => setExpireDate(newValue ? newValue : new Date())}
                                        readOnly
                                    />
                                </LocalizationProvider>
                            </FormControl>
                        </Box>

                        <FormControl variant="outlined" sx={{ mt: 1 }}>
                            <FormHelperText>{t('banner.Image') + ' *'}</FormHelperText>
                            <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                                <Avatar
                                    variant="square"
                                    sx={{ minWidth: 200, minHeight: 200 }}
                                    src={selectImage ? URL.createObjectURL(selectImage) : undefined}
                                />
                                <label htmlFor="image" style={{ position: 'absolute', bottom: '8px', right: '8px' }}>
                                    <IconButton component="span" color="primary">
                                        <UploadTwoToneIcon />
                                    </IconButton>
                                </label>
                                <Input
                                    required
                                    id="image"
                                    name="image"
                                    type="file"
                                    accept="image/*"
                                    style={{ display: 'none' }} // Ẩn input file
                                    onChange={(e: any) => {
                                        const file = e.target.files[0];
                                        console.log(file);
                                        if (
                                            file &&
                                            (file.type === 'image/png' ||
                                                file.type === 'image/jpeg' ||
                                                file.type === 'image/webp')
                                        ) {
                                            setSelectImage(file);
                                        } else {
                                            toastWarning('File type is not allowed');
                                        }
                                    }}
                                />
                            </Box>
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>{t('action.Cancel')}</Button>
                        <Button type="submit">{t('action.Confirm')}</Button>
                    </DialogActions>
                </Dialog>
            </Dialog>
        </React.Fragment>
    );
};
export default CreateBannerDialog;
