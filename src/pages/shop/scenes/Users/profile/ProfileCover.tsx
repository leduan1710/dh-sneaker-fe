import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
    Box,
    Typography,
    Card,
    Tooltip,
    Avatar,
    CardMedia,
    Button,
    IconButton,
    Stack,
    CardContent,
    CardActions,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    TextField,
} from '@mui/material';
import { styled } from '@mui/material/styles';

import ArrowBackTwoToneIcon from '@mui/icons-material/ArrowBackTwoTone';
import ArrowForwardTwoToneIcon from '@mui/icons-material/ArrowForwardTwoTone';
import UploadTwoToneIcon from '@mui/icons-material/UploadTwoTone';
import MoreHorizTwoToneIcon from '@mui/icons-material/MoreHorizTwoTone';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import CancelPresentationIcon from '@mui/icons-material/CancelPresentation';
import SaveIcon from '@mui/icons-material/Save';
import { toastError, toastSuccess, toastWarning } from '../../../../../untils/Logic';
import { useSelector, useStore } from 'react-redux';
import { change_is_loading, change_user } from '../../../../../reducers/Actions';
import axios from 'axios';
import { HOST_BE } from '../../../../../common/Common';
import { t } from 'i18next';
import { ReducerProps } from '../../../../../reducers/ReducersProps';
import { useTranslation } from 'react-i18next';
import { GetApi, PostApi } from '../../../../../untils/Api';

const Input = styled('input')({
    display: 'none',
});
const CardCover = styled(Card)(
    ({ theme }) => `
    position: relative;

    .MuiCardMedia-root {
      height: ${theme.spacing(40)};
      object-fit: cover;
    }
`,
);
const CardCoverAction = styled(Box)(
    ({ theme }) => `
    position: absolute;
    right: ${theme.spacing(2)};
    bottom: ${theme.spacing(2)};
`,
);

interface EditInfoDialogProps {
    onClose: () => void;
    open: boolean;
    shop: any;
    onUpdate: () => void;
}

const EditInfoDialog: React.FC<EditInfoDialogProps> = (props) => {
    const { t } = useTranslation();
    const { onClose, open, shop, onUpdate } = props;
    const store = useStore();

    const handleClose = () => {
        onClose();
    };
    const handleEditInfoShop = async (id: string, name: string, phone: string, address: string, describe: string) => {
        onClose();
        store.dispatch(change_is_loading(true));
        if (shop) {
            const shopData = {
                id,
                name,
                phone,
                address,
                describe,
            };
            try {
                const response = await PostApi(`/shop/update/shop-info`, localStorage.getItem('token'), shopData);
                console.log(response);
                onUpdate();
                toastSuccess(t('toast.EditSuccess'));
            } catch (error) {
                toastWarning(t('toast.EditFail'));
            } finally {
                store.dispatch(change_is_loading(false));
            }
        }
    };

    return (
        <React.Fragment>
            <Dialog onClose={handleClose} open={open}>
                <Dialog
                    maxWidth="md"
                    open={open}
                    onClose={handleClose}
                    PaperProps={{
                        component: 'form',
                        onSubmit: async (event: React.FormEvent<HTMLFormElement>) => {
                            event.preventDefault();
                            const formData = new FormData(event.currentTarget);
                            const formJson = Object.fromEntries((formData as any).entries());
                            const name = formJson.name;
                            const phone = formJson.phone;
                            const address = formJson.address;
                            const describe = formJson.describe;

                            await handleEditInfoShop(shop?.dataShop.id, name, phone, address, describe);
                        },
                    }}
                >
                    <DialogTitle>{t('shopProfile.EditInfo')}</DialogTitle>
                    <DialogContent>
                        <DialogContentText sx={{ mb: 1 }}>{t('shopProfile.EditInfoForm')}</DialogContentText>
                        <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                            <TextField
                                autoFocus
                                required
                                margin="dense"
                                id="name"
                                name="name"
                                label={t('shopProfile.Name')}
                                type="text"
                                defaultValue={shop?.dataShop?.name || ''}
                                fullWidth
                                variant="outlined"
                                sx={{ mb: 1 }}
                            />
                            <TextField
                                required
                                margin="dense"
                                id="phone"
                                name="phone"
                                label={t('shopProfile.Phone')}
                                type="text"
                                defaultValue={shop?.dataShop.phoneShop}
                                fullWidth
                                variant="outlined"
                                sx={{ mb: 1 }}
                            />
                        </Stack>
                        <TextField
                            required
                            margin="dense"
                            id="describe"
                            name="describe"
                            label={t('shopProfile.Describe')}
                            type="text"
                            defaultValue={shop?.dataShop?.describeShop || ''}
                            fullWidth
                            variant="outlined"
                            sx={{ mb: 1 }}
                            multiline
                        />
                        <TextField
                            required
                            margin="dense"
                            id="address"
                            name="address"
                            label={t('shopProfile.Address')}
                            type="address"
                            defaultValue={shop?.dataShop?.addressShop || ''}
                            fullWidth
                            variant="outlined"
                            sx={{ mb: 1 }}
                            multiline
                        />
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

interface ProfileCoverProps {
    user: any;
    shop: any;
    onUpdate: ()=> void;
}
const ProfileCover: React.FC<ProfileCoverProps> = (props) => {
    const [selectImage, setSelectImage] = useState<File | null>(null);
    const store = useStore();
    const { user, shop, onUpdate } = props;
    const [openEdit, setOpenEdit] = useState(false);
    const handleClickOpenEditDialog = () => {
        setOpenEdit(true);
    };
    const handleCloseEditDialog = () => {
        setOpenEdit(false);
    };
    const handleUpdateImage = async () => {
        store.dispatch(change_is_loading(true));

        const data = new FormData();
        if (selectImage) {
            const imageBlob = await fetch(URL.createObjectURL(selectImage)).then((response) => response.blob());
            data.append('file', imageBlob);
        }

        try {
            const resUpdateImg = await axios.post(`${HOST_BE}/shop/update/image`, data, {
                headers: {
                    Authorization: `Bearer ${window.localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (resUpdateImg.status == 200) {
                toastSuccess(t('toast.Success'));
                onUpdate();
            } else {
                toastError(t('toast.Fail'));
            }
            store.dispatch(change_is_loading(false));
            setSelectImage(null);
        } catch (e) {
            store.dispatch(change_is_loading(false));
        }
    };
    const handleCancel = () => {
        setSelectImage(null);
    };
    useEffect(() => {}, []);
    return (
        <>
            <Box display="flex" mb={3}>
                <Tooltip arrow placement="top" title="Go back">
                    <IconButton color="primary" sx={{ p: 2, mr: 2 }}>
                        <ArrowBackTwoToneIcon />
                    </IconButton>
                </Tooltip>
                <Box>
                    <Typography variant="h3" component="h3" gutterBottom>
                        {t('shopProfile.ShopInfo')}: {shop?.dataShop.name}
                    </Typography>
                </Box>
            </Box>
            <CardCover>
                {selectImage ? (
                    <CardMedia component="img" image={URL.createObjectURL(selectImage)} />
                ) : (
                    <CardMedia
                        component="img"
                        image={
                            shop?.dataShop?.image
                                ? shop?.dataShop?.image.startsWith('uploads')
                                    ? `${HOST_BE}/${shop?.dataShop?.image}`
                                    : shop?.dataShop?.image
                                : shop?.dataShop?.image
                        }
                    />
                )}

                <CardCoverAction>
                    <Input
                        accept="image/*"
                        id="change-cover"
                        multiple
                        type="file"
                        onChange={(e: any) => {
                            const file = e.target.files[0];
                            e.target.value = '';
                            console.log(file);
                            if (
                                file &&
                                (file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/webp')
                            ) {
                                setSelectImage(file);
                            } else {
                                toastWarning('File type is not allowed');
                            }
                        }}
                    />
                    <Stack direction="row" spacing={1}>
                        <label htmlFor="change-cover">
                            <Button startIcon={<UploadTwoToneIcon />} variant="contained" component="span">
                                {t('action.ChangeImage')}
                            </Button>
                        </label>
                        {selectImage ? (
                            <>
                                <Button startIcon={<SaveIcon />} variant="contained" component="span" onClick={handleUpdateImage}>
                                    {t('action.Save')}
                                </Button>
                                <Button startIcon={<CancelPresentationIcon />} variant="contained" component="span" onClick={handleCancel}>
                                    {t('action.Cancel')}
                                </Button>
                            </>
                        ) : null}
                    </Stack>
                </CardCoverAction>
            </CardCover>
            <Box py={2} pl={2} mb={3}>
                <Typography sx={{ py: 1 }} variant="subtitle2" color="text.primary">
                    {t('shopProfile.Describe')}: {shop?.dataShop.describeShop}
                </Typography>
                <Typography sx={{ py: 2 }} variant="subtitle2" color="text.primary">
                    {t('shopProfile.Phone')}: {shop?.dataShop.phoneShop} | {t('shopProfile.Address')}:{' '}
                    {shop?.dataShop.addressShop} | {t('shopProfile.Point')}: {shop?.dataShop.point}
                </Typography>
                <Typography variant="subtitle2" color="text.primary">
                    {t('shopProfile.Status')}: {shop?.dataShop.active ? 'Đang hoạt động' : ''}
                </Typography>
                <Box display={{ xs: 'block', md: 'flex' }} alignItems="center" justifyContent="space-between">
                    <Box>
                        <Button
                            size="small"
                            variant="contained"
                            endIcon={<EditTwoToneIcon />}
                            onClick={handleClickOpenEditDialog}
                        >
                            {t('shopProfile.EditInfo')}
                        </Button>
                    </Box>
                </Box>
            </Box>
            <EditInfoDialog
                open={openEdit}
                onClose={handleCloseEditDialog}
                onUpdate={handleCloseEditDialog}
                shop={shop}
            ></EditInfoDialog>
        </>
    );
};

ProfileCover.propTypes = {
    // @ts-ignore
    user: PropTypes.object.isRequired,
};

export default ProfileCover;
