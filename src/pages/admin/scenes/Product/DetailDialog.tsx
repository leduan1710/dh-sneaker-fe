import React, { useEffect, useRef, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    Typography,
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
    Card,
    CardHeader,
    Divider,
    CardContent,
    Chip,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Grid,
    ImageList,
    ImageListItem,
} from '@mui/material';

import { useSelector, useStore } from 'react-redux';
import { change_is_loading } from '../../../../reducers/Actions';

import { useTranslation } from 'react-i18next';
import { GetApi, GetGuestApi } from '../../../../untils/Api';
import { toast } from 'react-toastify';
import { HOST_BE } from '../../../../common/Common';

interface DetailProductDialogProps {
    onClose: () => void;
    open: boolean;
    categories: Array<any>;
    sizes: Array<any>;
    styles: Array<any>;
    colors: Array<any>;
    types: Array<any>;
    product?: any;
}

const DetailProductDialog: React.FC<DetailProductDialogProps> = (props) => {
    const { t } = useTranslation();
    const store = useStore();
    const { onClose, open, categories, sizes, styles, colors, types, product } = props;
    const [productInfo, setProductInfo] = useState<any>(undefined);
    const [selectedProductDetail, setSelectedProductDetail] = useState<any>(undefined);
    const [productDetails, setProductDetails] = useState<any>(undefined);
    const getData = async () => {
        store.dispatch(change_is_loading(true));
        try {
            const resProduct = await GetGuestApi(`/api/product/${product.id}`);
            if (resProduct.data.message === 'Success') {
                setProductInfo(resProduct.data.product);
            }
            const resProductDetails = await GetGuestApi(`/api/product-detail-by-product/${product.id}`);
            if (resProductDetails.data.message === 'Success') {
                setProductDetails(resProductDetails.data.productDetails);
                setSelectedProductDetail(resProductDetails.data.productDetails[0]);
            }
        } catch (error) {
            toast.error('Lỗi');
        } finally {
            store.dispatch(change_is_loading(false));
        }
    };

    const handleClose = () => {
        console.log(productInfo, categories, categories.find((category) => category.id === product?.categoryId)?.name);
        onClose();
    };
    useEffect(() => {
        if (product) getData();
    }, [product]);
    return (
        <Dialog onClose={handleClose} open={open} maxWidth="md" fullWidth>
            <DialogTitle>Xem sản phẩm</DialogTitle>
            <DialogContent>
                <Box>
                    <Card>
                        <CardHeader title={"Thông tin chi tiết sản phẩm"} />
                        <Divider />
                        <CardContent>
                            <Stack spacing={2}>
                                {/* Thông tin sản phẩm */}
                                <Stack direction="row" spacing={1}>
                                    <TextField
                                        margin="dense"
                                        id="name"
                                        name="name"
                                        label={t('product.Name')}
                                        fullWidth
                                        variant="outlined"
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                        value={productInfo?.name}
                                    />
                                    <TextField
                                        margin="dense"
                                        id="brand"
                                        name="brand"
                                        label={'Hãng'}
                                        fullWidth
                                        variant="outlined"
                                        sx={{ maxWidth: 150 }}
                                        value={
                                            categories.find((category) => category.id === productInfo?.categoryId)
                                                ?.name || ''
                                        }
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                    />
                                </Stack>
                                <Stack direction="row" spacing={1}>
                                    <TextField
                                        margin="dense"
                                        label="Giá nhập"
                                        variant="outlined"
                                        fullWidth
                                        value={productInfo?.importPrice || ''}
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                    />
                                    <TextField
                                        margin="dense"
                                        label="Giá ctv"
                                        variant="outlined"
                                        fullWidth
                                        value={productInfo?.ctvPrice || ''}
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                    />
                                    <TextField
                                        margin="dense"
                                        label="Giá bán"
                                        variant="outlined"
                                        fullWidth
                                        value={productInfo?.sellPrice || ''}
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                    />
                                    <TextField
                                        margin="dense"
                                        label="Giá ảo"
                                        variant="outlined"
                                        fullWidth
                                        value={productInfo?.virtualPrice || ''}
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                    />
                                </Stack>
                                <Typography variant="h5" sx={{ mb: 2 }}>
                                    Kích cỡ và số lượng
                                </Typography>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            {productDetails?.map((detail: any, index: number) => (
                                                <TableCell key={index} align="center">
                                                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                                        {detail.sizeName}
                                                    </Typography>
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            {productDetails?.map((detail: any, index: number) => (
                                                <TableCell key={index} align="center">
                                                    <Typography variant="body2">{detail.quantity}</Typography>
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    </TableBody>
                                </Table>
                                <Typography variant="h5">Hình ảnh sản phẩm</Typography>
                                <ImageList sx={{ width: 500, height: 335 }} cols={3} rowHeight={164}>
                                    {productInfo?.imageList?.map((img: string, index: number) => (
                                        <ImageListItem key={index}>
                                            <img
                                                src={img.startsWith('uploads') ? `${HOST_BE}/${img}` : img}
                                                alt={`uploaded-${index}`}
                                                loading="lazy"
                                            />
                                        </ImageListItem>
                                    ))}
                                </ImageList>
                                <Typography variant="h5" sx={{ mb: 2 }}>
                                    Thông tin sản phẩm
                                </Typography>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="center">Màu sắc</TableCell>
                                            <TableCell align="center">Kiểu dáng</TableCell>
                                            <TableCell align="center">Loại sản phẩm</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell align="center">{productInfo?.colorName || 'N/A'}</TableCell>
                                            <TableCell align="center">
                                                <Stack direction="row" spacing={1} justifyContent="center">
                                                    {productInfo?.styleNames?.map((style: string, index: number) => (
                                                        <Chip key={index} label={style} variant="outlined" />
                                                    ))}
                                                </Stack>
                                            </TableCell>
                                            <TableCell align="center">{productInfo?.typeName || 'N/A'}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>

                                {/* Mô tả sản phẩm */}
                                <Typography variant="h5">Mô tả sản phẩm</Typography>
                                <TextField
                                    margin="dense"
                                    label="Mô tả"
                                    variant="outlined"
                                    fullWidth
                                    multiline
                                    rows={4}
                                    value={productInfo?.description || ''}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            </Stack>
                        </CardContent>
                    </Card>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>{t('action.Close')}</Button>
            </DialogActions>
        </Dialog>
    );
};
export default DetailProductDialog;
