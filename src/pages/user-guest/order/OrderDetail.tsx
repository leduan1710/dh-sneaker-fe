import React, { useEffect, useState } from 'react';
import {
    Container,
    Typography,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    Box,
    RadioGroup,
    FormControlLabel,
    Radio,
    Divider,
    IconButton,
    Avatar,
    styled,
    Stack,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import UploadTwoToneIcon from '@mui/icons-material/UploadTwoTone';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import axios from 'axios';
import {
    formatPrice,
    formatTitle,
    removeItemFromCart,
    toastError,
    toastSuccess,
    toastWarning,
} from '../../../untils/Logic';
import { useSelector, useStore } from 'react-redux';
import { ReducerProps } from '../../../reducers/ReducersProps';
import { HOST_BE } from '../../../common/Common';
import { GetApi, PostApi } from '../../../untils/Api';
import { change_is_loading } from '../../../reducers/Actions';
import { useNavigate, useParams } from 'react-router-dom';
import ShippingMethodDisplay from '../../../components/user-guest/order/ShippingMethodDisplay';

const Input = styled('input')({
    display: 'none',
});

interface CancelOrderDialogProps {
    onClose: () => void;
    open: boolean;
    orderId?: string;
    onUpdate: () => void;
}

const CancelOrderDialog: React.FC<CancelOrderDialogProps> = (props) => {
    const { onClose, open, orderId, onUpdate } = props;

    const handleClose = () => {
        onClose();
    };
    const handleCancelOrder = async () => {
        try {
            const res = await GetApi(`/user/cancel-order/${orderId}`, localStorage.getItem('token'));

            if (res.data.message === 'Success') {
                toastSuccess('Hủy đơn hàng thành công');
                onUpdate();
            } else toastError('Thất bại');
        } catch (error) {
            console.error('Failed to delete :', error);
        }
        onClose();
    };

    return (
        <React.Fragment>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="dialog-title"
                aria-describedby="dialog-description"
            >
                <DialogTitle sx={{ textTransform: 'capitalize' }} id="dialog-title">
                    Hủy đơn hàng
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="dialog-description">Xác nhận hủy đơn hàng này ?</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Hủy</Button>
                    <Button onClick={handleCancelOrder} autoFocus>
                        Xác nhận
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
};

const OrderDetail: React.FC = () => {
    const store = useStore();
    const nav = useNavigate();
    const user = useSelector((state: ReducerProps) => state.user);
    const { orderId } = useParams();
    const listItemInCart = useSelector((state: ReducerProps) => state.listItemInCart);
    const listCart = JSON.parse(localStorage.getItem('listCart') || '[]');
    const [order, setOrder] = useState<any>();
    const [orderDetails, setOrderDetails] = useState<any>();
    const [isEdit, setIsEdit] = useState<boolean>(false);

    const [customerName, setCustomerName] = useState('');
    const [totalCOD, setTotalCOD] = useState('');
    const [totalAmount, setTotalAmount] = useState(0);

    const [orderNote, setOrderNote] = useState('');
    const [selectImage, setSelectImage] = useState<File | null>(null);
    const [uploadedImages, setUploadedImages] = useState<File[]>([]);

    const [noteImage, setNoteImage] = useState([]);
    const [shippingMethod, setShippingMethod] = useState('');
    const [shippingFee, setShippingFee] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [customerAddress, setCustomerAddress] = useState('');

    const [province, setProvince] = useState<any>(null);
    const [provinceList, setProvinceList] = useState<any>([]);
    const [district, setDistrict] = useState<any>(null);
    const [districtList, setDistrictList] = useState<any>([]);
    const [ward, setWard] = useState<any>(null);
    const [wardList, setWardList] = useState<any>([]);

    const [openDialog, setOpenDialog] = useState(false);

    const handleClickOpenDisableDialog = () => {
        setOpenDialog(true);
    };
    const handleCloseCancelDialog = () => {
        setOpenDialog(false);
    };

    const getDataOrder = async () => {
        store.dispatch(change_is_loading(true));
        const res = await GetApi(`/user/get/orderDetail/${orderId}`, localStorage.getItem('token'));

        if (res.data.message == 'Success') {
            setOrder(res.data.order);
            setCustomerName(res.data.order.customerName);
            setCustomerPhone(res.data.order.customerPhone);
            setCustomerAddress(res.data.order.addressDetail);
            setShippingMethod(res.data.order.shipMethod);
            setOrderNote(res.data.order.ctvNote);
            setShippingFee(res.data.order.shipFee);
            setTotalCOD(res.data.order.CODPrice);
            setProvince(res.data.order.address.province);
            setDistrict(res.data.order.address.district);
            setWard(res.data.order.address.ward);
            setNoteImage(res.data.order.noteImageList);
            setOrderDetails(res.data.orderDetails);
        }
        store.dispatch(change_is_loading(false));
    };
    const getDataProvince = async () => {
        const resProvince = await axios('https://partner.viettelpost.vn/v2/categories/listProvinceById?provinceId=-1');
        if (resProvince.data.status == 200) {
            setProvinceList(resProvince.data.data);
        }
    };
    const getDataDistrict = async () => {
        if (province) {
            const resDistrict = await axios(
                `https://partner.viettelpost.vn/v2/categories/listDistrict?provinceId=${province.PROVINCE_ID}`,
            );

            if (resDistrict.data.status == 200) {
                setDistrictList(resDistrict.data.data);
            }
        }
    };
    const getDataWard = async () => {
        if (district) {
            const resWard = await axios(
                `https://partner.viettelpost.vn/v2/categories/listWards?districtId=${district.DISTRICT_ID}`,
            );
            if (resWard.data.status == 200) {
                setWardList(resWard.data.data);
            }
        }
    };

    const handleEditClick = () => {
        setIsEdit(true);
    };

    const handleSaveClick = () => {
        handleEdit();
        setIsEdit(false);
    };

    const handleCancelClick = () => {
        setIsEdit(false);
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const newFiles = Array.from(files);
            setUploadedImages((prevImages) => [...prevImages, ...newFiles]);
        }
    };

    const handleImageRemove = (index: number, isUploaded: boolean) => {
        if (isUploaded) {
            // Xóa ảnh từ uploadedImages
            setUploadedImages((prevImages) => prevImages.filter((_, i) => i !== index));
        } else {
            // Xóa ảnh từ images
            setNoteImage((prevImages) => prevImages.filter((_, i) => i !== index));
        }
    };
    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const address = e.target.value;
        setCustomerAddress(address);
    };
    const handleEdit = async () => {
        if (shippingMethod === 'OFFLINE') {
            const formData = new FormData();

            // Thêm thông tin đơn hàng vào FormData
            formData.append('id', order.id);
            formData.append('userId', user.id);
            formData.append('ctvName', user.name);
            formData.append('ctvNote', orderNote);
            formData.append('customerName', customerName);
            formData.append('shipMethod', shippingMethod);
            formData.append('paid', 'true');
            formData.append('CODPrice', totalCOD.toString());
            formData.append('oldNoteImageList', JSON.stringify(noteImage));

            formData.append('shipFee', '0');

            // Upload hình ảnh nếu có
            const images = uploadedImages || [];
            for (const image of images) {
                const uniqueFilename = `image_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                const imageBlob = await fetch(URL.createObjectURL(image)).then((response) => response.blob());
                formData.append('files', imageBlob, uniqueFilename);
            }

            try {
                const res = await axios.post(`${HOST_BE}/user/edit-order`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                if (res.data.message === 'Success') {
                    setOrder(res.data.order);
                    toastSuccess('Chỉnh sửa thành công');
                }
            } catch (error) {
                console.error('Thất bại', error);
            }
        } else {
            // Đơn hàng online
            const formData = new FormData();

            // Thêm thông tin đơn hàng vào FormData
            formData.append('id', order.id);
            formData.append('userId', user.id);
            formData.append('ctvName', user.name);
            formData.append('ctvNote', orderNote);
            formData.append('customerName', customerName);
            formData.append('customerPhone', customerPhone);
            formData.append('addressDetail', customerAddress);
            formData.append(
                'address',
                JSON.stringify({
                    province,
                    district,
                    ward,
                }),
            );
            formData.append('shipMethod', shippingMethod);
            formData.append('paid', 'true');
            formData.append('CODPrice', totalCOD.toString());
            formData.append('shipFee', shippingFee.toString());
            formData.append('oldNoteImageList', JSON.stringify(noteImage));

            // Upload hình ảnh nếu có
            const images = uploadedImages || [];
            for (const image of images) {
                const uniqueFilename = `image_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                const imageBlob = await fetch(URL.createObjectURL(image)).then((response) => response.blob());
                formData.append('files', imageBlob, uniqueFilename);
            }
            try {
                const res = await axios.post(`${HOST_BE}/user/edit-order`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                if (res.data.message === 'Success') {
                    toastSuccess('Chỉnh sửa thành công');
                }
            } catch (error) {
                console.error('Failed to place order:', error);
            }
        }
    };
    useEffect(() => {
        let total = 0;

        orderDetails?.map((item: any) => {
            total += item.sellPrice * item.quantity;
        });

        setTotalAmount(total);
    }, [orderDetails]);

    useEffect(() => {
        getDataProvince();
    }, []);
    useEffect(() => {
        if (orderId) getDataOrder();
    }, [orderId]);
    useEffect(() => {
        getDataDistrict();
    }, [province]);
    useEffect(() => {
        getDataWard();
    }, [district]);

    return (
        <>
            <Grid container spacing={3} sx={{ mt: { md: '160px', xs: '190px' }, mb: 4, px: { md: 16, xs: 2 } }}>
                <Grid item xs={12} md={6} sx={{ overflow: { md: 'auto' }, maxHeight: { md: '100vh' } }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h4" gutterBottom sx={{ mb: 1, fontSize: 22 }}>
                            Thông tin đơn hàng
                        </Typography>
                        {isEdit ? (
                            <Box>
                                <Button variant="contained" color="primary" onClick={handleSaveClick} sx={{ mr: 1 }}>
                                    Lưu thay đổi
                                </Button>
                                <Button variant="outlined" color="error" onClick={handleCancelClick}>
                                    Hủy
                                </Button>
                            </Box>
                        ) : (
                            order?.status === 'PROCESSING' && (
                                <Button variant="contained" color="secondary" onClick={handleEditClick}>
                                    Chỉnh sửa đơn hàng
                                </Button>
                            )
                        )}
                    </Box>

                    <TextField
                        label="Tên Khách Hàng"
                        variant="outlined"
                        fullWidth
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        sx={{ mb: 1 }}
                        InputProps={{
                            sx: {
                                borderRadius: '3px',
                            },
                            readOnly: !isEdit,
                        }}
                    />

                    <TextField
                        label="Tiền Thu Khách (Tiền COD)"
                        variant="outlined"
                        fullWidth
                        required
                        type="number"
                        helperText="Tổng tiền thu khách cộng cả phí ship"
                        value={totalCOD}
                        onChange={(e) => setTotalCOD(e.target.value)}
                        sx={{ mb: 1 }}
                        InputProps={{
                            sx: {
                                borderRadius: '3px',
                            },
                            readOnly: !isEdit,
                        }}
                    />

                    <TextField
                        label="Ghi Chú Đơn Hàng (Nếu có)"
                        variant="outlined"
                        fullWidth
                        multiline
                        minRows={2}
                        value={orderNote}
                        onChange={(e) => setOrderNote(e.target.value)}
                        sx={{ mb: 1 }}
                        InputProps={{
                            sx: {
                                borderRadius: '3px',
                            },
                            readOnly: !isEdit,
                        }}
                    />
                    {order?.orderDescribe && order.status === 'CANCEL' && (
                        <TextField
                            label="Lý do đơn bị hủy"
                            variant="outlined"
                            fullWidth
                            multiline
                            minRows={2}
                            value={order?.orderDescribe}
                            sx={{ mb: 1 }}
                            InputProps={{
                                sx: {
                                    borderRadius: '3px',
                                },
                                readOnly: !isEdit,
                            }}
                        />
                    )}

                    <Typography variant="body2" sx={{ marginBottom: 1 }}>
                        {'Ảnh ghi chú (Nếu có)'}
                    </Typography>
                    <Stack direction="row" spacing={2} sx={{ mb: 2, mt: 2 }}>
                        {noteImage.map((image: string, index) => (
                            <Box key={index} sx={{ position: 'relative' }}>
                                <img
                                    src={image.startsWith('uploads') ? `${HOST_BE}/${image}` : image}
                                    alt={`image-${index}`}
                                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                />
                                {isEdit && (
                                    <IconButton
                                        onClick={() => handleImageRemove(index, false)}
                                        sx={{ position: 'absolute', top: 0, right: 0 }}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                )}
                            </Box>
                        ))}
                        {uploadedImages.map((file, index) => (
                            <Box key={index} sx={{ position: 'relative' }}>
                                <img
                                    src={URL.createObjectURL(file)}
                                    alt={`uploaded-${index}`}
                                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                />
                                {isEdit && (
                                    <IconButton
                                        onClick={() => handleImageRemove(index, true)}
                                        sx={{ position: 'absolute', top: 0, right: 0 }}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                )}
                            </Box>
                        ))}
                        {isEdit && (
                            <label htmlFor="upload-button">
                                <input
                                    accept="image/*"
                                    id="upload-button"
                                    type="file"
                                    multiple
                                    onChange={handleImageUpload}
                                    style={{ display: 'none' }}
                                />
                                <IconButton
                                    component="span"
                                    sx={{ width: '100px', height: '100px', border: '1px dashed grey' }}
                                >
                                    <AddPhotoAlternateIcon fontSize="large" />
                                </IconButton>
                            </label>
                        )}
                    </Stack>

                    <Divider sx={{ my: 2 }}></Divider>
                    <Typography variant="h4" gutterBottom sx={{ mb: 1, fontSize: 22 }}>
                        Giao hàng
                    </Typography>
                    <ShippingMethodDisplay shippingMethod={shippingMethod} />

                    {(shippingMethod === 'VIETTELPOST' || shippingMethod === 'GRAB') && (
                        <>
                            {shippingMethod === 'GRAB' && (
                                <TextField
                                    label="Phí Ship Grab/Kho khác"
                                    variant="outlined"
                                    fullWidth
                                    value={shippingFee}
                                    type="number"
                                    onChange={(e) => setShippingFee(e.target.value)}
                                    sx={{ mt: 1 }}
                                    InputProps={{
                                        sx: {
                                            borderRadius: '3px',
                                        },
                                        readOnly: !isEdit,
                                    }}
                                />
                            )}
                            {shippingMethod === 'VIETTELPOST' && order.deliveryCode && (
                                <TextField
                                    label="Mã vận đơn"
                                    variant="outlined"
                                    fullWidth
                                    value={order.deliveryCode}
                                    type="text"
                                    sx={{ mt: 1 }}
                                    InputProps={{
                                        sx: {
                                            borderRadius: '3px',
                                        },
                                        readOnly: true,
                                    }}
                                />
                            )}

                            <TextField
                                label="Số Điện Thoại Khách Hàng"
                                variant="outlined"
                                fullWidth
                                value={customerPhone}
                                onChange={(e) => setCustomerPhone(e.target.value)}
                                sx={{ mb: 1, mt: 1 }}
                                InputProps={{
                                    sx: {
                                        borderRadius: '3px',
                                    },
                                    readOnly: !isEdit,
                                }}
                            />

                            <TextField
                                label="Địa Chỉ Chi Tiết"
                                variant="outlined"
                                fullWidth
                                value={customerAddress}
                                onChange={handleAddressChange}
                                sx={{ mb: 1 }}
                                InputProps={{
                                    sx: {
                                        borderRadius: '3px',
                                    },
                                    readOnly: !isEdit,
                                }}
                            />

                            <FormControl fullWidth sx={{ mb: 1 }}>
                                <InputLabel>Tỉnh/Thành Phố</InputLabel>
                                <Select
                                    value={province?.PROVINCE_ID || ''}
                                    onChange={(e) => {
                                        const selectedProvince = provinceList.find(
                                            (p: any) => p.PROVINCE_ID === e.target.value,
                                        );
                                        setProvince(selectedProvince);
                                        setDistrict(null);
                                        setWard(null);
                                        setDistrictList([]);
                                        setWardList([]);
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderRadius: '3px',
                                        },
                                    }}
                                    readOnly={!isEdit}
                                    label={'Tỉnh/Thành Phố'}
                                >
                                    {provinceList.map((prov: any) => (
                                        <MenuItem key={prov.PROVINCE_ID} value={prov.PROVINCE_ID}>
                                            {prov.PROVINCE_NAME}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <Grid container spacing={2} sx={{ mb: 1 }}>
                                <Grid item xs={6}>
                                    <FormControl fullWidth>
                                        <InputLabel>{province ? 'Quận/Huyện' : 'Vui lòng chọn tỉnh/TP'} </InputLabel>
                                        <Select
                                            value={district?.DISTRICT_ID || ''}
                                            onChange={(e) => {
                                                const selectedDistrict = districtList.find(
                                                    (d: any) => d.DISTRICT_ID === e.target.value,
                                                );
                                                setDistrict(selectedDistrict);
                                                setWard(null);
                                                setWardList([]);
                                            }}
                                            sx={{
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    borderRadius: '3px',
                                                },
                                            }}
                                            readOnly={!isEdit}
                                            disabled={!province}
                                            label={'Quận/huyện'}
                                        >
                                            {districtList.map((dist: any) => (
                                                <MenuItem key={dist.DISTRICT_ID} value={dist.DISTRICT_ID}>
                                                    {formatTitle(dist.DISTRICT_NAME)}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={6}>
                                    <FormControl fullWidth>
                                        <InputLabel>{district ? 'Phường/Xã' : 'Vui lòng chọn quận/huyện'}</InputLabel>
                                        <Select
                                            value={ward?.WARDS_ID || ''}
                                            onChange={(e) => {
                                                const selectedWard = wardList.find(
                                                    (w: any) => w.WARDS_ID === e.target.value,
                                                );
                                                setWard(selectedWard);
                                            }}
                                            sx={{
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    borderRadius: '3px',
                                                },
                                            }}
                                            readOnly={!isEdit}
                                            disabled={!district}
                                            label={'Phường/Xã'}
                                        >
                                            {wardList.map((w: any) => (
                                                <MenuItem key={w.WARDS_ID} value={w.WARDS_ID}>
                                                    {formatTitle(w.WARDS_NAME)}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </>
                    )}
                    {order?.status === 'PROCESSING' && (
                        <Button
                            variant="contained"
                            fullWidth
                            sx={{ mt: 3, bgcolor: 'rgb(27, 191, 177)', display: { xs: 'none', sm: 'block' } }}
                            onClick={() => {
                                handleClickOpenDisableDialog();
                            }}
                        >
                            Hủy đặt hàng
                        </Button>
                    )}
                </Grid>

                <Grid item xs={12} md={6} sx={{ position: 'sticky', top: '0', height: '100vh', overflow: 'hidden' }}>
                    <Box
                        sx={{
                            ml: 2,
                            mr: 2,
                            bgcolor: '#f9f9f9',
                        }}
                    >
                        <Typography variant="h3" sx={{ ml: 4, pt: 2, fontSize: 22, fontWeight: 600 }}>
                            Tóm tắt đơn hàng
                        </Typography>
                        <Divider sx={{ my: 1 }}></Divider>
                        <Box sx={{ p: 3 }}>
                            {orderDetails?.map((item: any, index: number) => {
                                return (
                                    <Box key={item.id}>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                borderRadius: '4px',
                                                boxShadow: 1,
                                            }}
                                        >
                                            <Box sx={{ position: 'relative', mr: 2 }}>
                                                <img
                                                    src={
                                                        item.image.startsWith('uploads')
                                                            ? `${HOST_BE}/${item.image}`
                                                            : item.image
                                                    }
                                                    alt={item.name}
                                                    style={{ width: 80, height: 80, borderRadius: '4px' }}
                                                />
                                                <Box
                                                    sx={{
                                                        position: 'absolute',
                                                        top: -5,
                                                        right: -5,
                                                        bgcolor: 'rgb(226, 50, 50)',
                                                        color: '#fff',
                                                        borderRadius: '50%', // Hình tròn
                                                        padding: '4px',
                                                        width: '24px',
                                                        height: '24px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: '0.8rem',
                                                    }}
                                                >
                                                    {item.quantity}
                                                </Box>
                                            </Box>
                                            <Box sx={{ flexGrow: 1 }}>
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                    }}
                                                >
                                                    <Typography variant="h6" sx={{ fontSize: 17 }}>
                                                        {item.productName}
                                                    </Typography>
                                                    <Typography variant="body1" sx={{ fontSize: 15 }} color="#111">
                                                        {formatPrice(item.sellPrice)}
                                                    </Typography>
                                                </Box>
                                                <Typography variant="body2" color="textSecondary">
                                                    Size: {item.size}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        {index < orderDetails?.length - 1 && <Divider sx={{ my: 2 }} />}
                                    </Box>
                                );
                            })}
                        </Box>
                        <Divider sx={{ my: 1 }}></Divider>
                        <Box sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Typography variant="h6" sx={{ fontSize: 15 }}>
                                    Tạm tính
                                </Typography>
                                <Typography variant="h6" sx={{ fontSize: 15 }}>
                                    {formatPrice(totalAmount)}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Typography variant="h6" sx={{ fontSize: 15 }}>
                                    Phí vận chuyển
                                </Typography>
                                <Typography variant="h6" sx={{ fontSize: 15 }}>
                                    {formatPrice(shippingFee)}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                                <Typography variant="h6" sx={{ fontSize: 19, fontWeight: 600 }}>
                                    Tổng cộng
                                </Typography>

                                <Typography variant="h6" sx={{ fontSize: 19, fontWeight: 600 }}>
                                    {formatPrice(totalAmount + Number(shippingFee))}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                    {order?.status === 'PROCESSING' && (
                        <Button
                            variant="contained"
                            fullWidth
                            sx={{ mt: 3, bgcolor: 'rgb(27, 191, 177)', display: { xs: 'block', sm: 'none' } }}
                            onClick={() => {
                                handleClickOpenDisableDialog();
                            }}
                        >
                            Hủy đặt hàng
                        </Button>
                    )}
                </Grid>
            </Grid>
            <CancelOrderDialog
                open={openDialog}
                onClose={handleCloseCancelDialog}
                orderId={order?.id}
                onUpdate={() => nav('/user/order')}
            />
        </>
    );
};

export default OrderDetail;
