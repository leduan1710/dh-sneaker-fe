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
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import UploadTwoToneIcon from '@mui/icons-material/UploadTwoTone';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import axios from 'axios';
import {
    formatCurrency,
    formatPrice,
    formatTitle,
    removeItemFromCart,
    toastError,
    toastSuccess,
    toastWarning,
    validatePhoneNumber,
} from '../../../untils/Logic';
import { useSelector, useStore } from 'react-redux';
import { ReducerProps } from '../../../reducers/ReducersProps';
import { HOST_BE, typeRole } from '../../../common/Common';
import { GetApi, PostApi } from '../../../untils/Api';
import { useNavigate } from 'react-router-dom';
import { change_is_loading } from '../../../reducers/Actions';

const Input = styled('input')({
    display: 'none',
});

const Checkout: React.FC = () => {
    const store = useStore();
    const user = useSelector((state: ReducerProps) => state.user);
    const role = useSelector((state: ReducerProps) => state.role);

    const navigate = useNavigate();
    const listItemInCart = useSelector((state: ReducerProps) => state.listItemInCart);
    const listCart = JSON.parse(localStorage.getItem('listCart') || '[]');
    const [listCheckout, setListCheckout] = useState<any>(JSON.parse(sessionStorage.getItem('checkout') || '[]'));
    const [customerName, setCustomerName] = useState('');
    const [totalCOD, setTotalCOD] = useState('');
    const [totalAmount, setTotalAmount] = useState(0);

    const [orderNote, setOrderNote] = useState('');

    const [selectImage, setSelectImage] = useState<File | null>(null);
    const [uploadedImages, setUploadedImages] = useState<File[]>([]);

    const [shippingMethod, setShippingMethod] = useState('');
    const [shippingFee, setShippingFee] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [customerAddress, setCustomerAddress] = useState('');

    const [ctv, setCTV] = useState<any>(null);
    const [ctvList, setCTVList] = useState<any>([]);

    const [province, setProvince] = useState<any>(null);
    const [provinceList, setProvinceList] = useState<any>([]);
    const [district, setDistrict] = useState<any>(null);
    const [districtList, setDistrictList] = useState<any>([]);
    const [ward, setWard] = useState<any>(null);
    const [wardList, setWardList] = useState<any>([]);

    const handleShippingMethodChange = (event: any) => {
        if (event.target.value === 'VIETTELPOST') setShippingFee('30000');
        else setShippingFee('0');
        setShippingMethod(event.target.value);
    };

    const getDataCTV = async () => {
        const resCTV = await GetApi('/user/get/ctvList', localStorage.getItem('token'));
        if (resCTV.data.message == 'Success') {
            setCTVList(resCTV.data.ctvList);
        }
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

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const newFiles = Array.from(files);
            setUploadedImages((prevImages) => [...prevImages, ...newFiles]);
        }
    };

    const handleImageRemove = (index: number) => {
        setUploadedImages((prevImages) => prevImages.filter((_, i) => i !== index));
    };

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const address = e.target.value;
        setCustomerAddress(address);
    };
    
    const removeFromCart = () => {
        let list_cart = JSON.parse(localStorage.getItem('listCart') || '[]');
        listCheckout.map((item_store: any) => {
            list_cart = list_cart.filter((item: any) => item.productDetailId !== item_store.productDetailId);
        });
        localStorage.setItem('listCart', JSON.stringify(list_cart));
        sessionStorage.removeItem('checkout');
    };

    const validateInputs = () => {
        const missingFields = [];

        if (!customerName) missingFields.push('Tên khách hàng');
        if (!totalCOD) missingFields.push('Tiền thu khách');
        if (!customerPhone) missingFields.push('Số điện thoại');
        if (!customerAddress) missingFields.push('Địa chỉ');
        if (!province) missingFields.push('Tỉnh/Thành phố');
        if (!district) missingFields.push('Quận/Huyện');
        if (!ward) missingFields.push('Phường/Xã');

        if (missingFields.length > 0) {
            toastWarning(`Vui lòng nhập đủ thông tin: ${missingFields.join(', ')}`);
            return false;
        }
        return true;
    };

    const handleBuy = async () => {
        // Tạo danh sách chi tiết đơn hàng
        const listOrderDetail = listItemInCart
            .filter((item: any) => {
                const index_quantity = listCart.findIndex(
                    (item_inStore: any) => item_inStore.productDetailId === item.id,
                );
                return index_quantity !== -1 && listCart[index_quantity].isCheck; // Kiểm tra isCheck
            })
            .map((item: any) => {
                const index_quantity = listCart.findIndex(
                    (item_inStore: any) => item_inStore.productDetailId === item.id,
                );
                return {
                    productDetailId: item.id,
                    productName: item.name,
                    image: item.image,
                    sellPrice: item.sellPrice,
                    importPrice: item.importPrice,
                    ctvPrice: item.ctvPrice,
                    color: item.colorName,
                    size: item.sizeName,
                    quantity: listCart[index_quantity].quantity,
                    isJibbitz: listCart[index_quantity].isJibbitz,
                };
            });

        if (shippingMethod === 'OFFLINE') {
            if (!(customerName && shippingMethod && totalCOD)) {
                toastWarning('Vui lòng nhập đủ thông tin');
                return;
            }
            store.dispatch(change_is_loading(true));

            const formData = new FormData();

            // Thêm thông tin đơn hàng vào FormData
            if (role === typeRole.ADMIN_CTV) {
                if (ctv) {
                    formData.append('userId', ctv.id);
                    formData.append('ctvName', ctv.name);
                } else {
                    toastWarning('Cần chọn CTV');
                }
            } else {
                formData.append('userId', user.id);
                formData.append('ctvName', user.name);
            }

            formData.append('ctvNote', orderNote);
            formData.append('customerName', customerName);
            formData.append('shipMethod', shippingMethod);
            formData.append('paid', 'true');
            formData.append('CODPrice', totalCOD.replace(/,/g, '').toString());
            formData.append('shipFee', '0');
            formData.append('listOrderDetail', JSON.stringify(listOrderDetail));
            // Upload hình ảnh nếu có
            const images = uploadedImages || [];
            for (const image of images) {
                const uniqueFilename = `image_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                const imageBlob = await fetch(URL.createObjectURL(image)).then((response) => response.blob());
                formData.append('files', imageBlob, uniqueFilename);
            }

            try {
                const res = await axios.post(`${HOST_BE}/user/handle-order`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                if (res.data.message === 'Success') {
                    toastSuccess('Đặt hàng thành công');

                    removeFromCart();
                    
                    navigate('/user/order');
                    store.dispatch(change_is_loading(false));
                } else {
                    toastError('Thất bại');
                    store.dispatch(change_is_loading(false));
                }
            } catch (error) {
                console.error('Failed to place order:', error);
            }
        } else {
            if (!validateInputs()) {
                return;
            }
            if (!validatePhoneNumber(customerPhone)) {
                toastWarning('Số điện thoại không hợp lệ');
                return;
            }
            store.dispatch(change_is_loading(true));

            // Đơn hàng online
            const formData = new FormData();

            // Thêm thông tin đơn hàng vào FormData
            if (role === typeRole.ADMIN_CTV) {
                if (ctv) {
                    formData.append('userId', ctv.id);
                    formData.append('ctvName', ctv.name);
                } else {
                    toastWarning('Cần chọn CTV');
                }
            } else {
                formData.append('userId', user.id);
                formData.append('ctvName', user.name);
            }
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
            formData.append('CODPrice', totalCOD.replace(/,/g, '').toString());
            formData.append('shipFee', shippingFee.replace(/,/g, '').toString());
            formData.append('listOrderDetail', JSON.stringify(listOrderDetail));

            // Upload hình ảnh nếu có
            const images = uploadedImages || [];
            for (const image of images) {
                const uniqueFilename = `image_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                const imageBlob = await fetch(URL.createObjectURL(image)).then((response) => response.blob());
                formData.append('files', imageBlob, uniqueFilename);
            }

            try {
                const res = await axios.post(`${HOST_BE}/user/handle-order`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                if (res.data.message === 'Success') {
                    toastSuccess('Đặt hàng thành công');

                    removeFromCart();

                    navigate('/user/order');
                    store.dispatch(change_is_loading(false));
                } else {
                    toastError('Thất bại');
                    store.dispatch(change_is_loading(false));
                }
            } catch (error) {
                console.error('Failed to place order:', error);
            }
        }
    };

    useEffect(() => {
        let total = 0;

        listItemInCart.forEach((item: any) => {
            const cartItem = listCart.find((cartItem: any) => cartItem.productDetailId === item.id && cartItem.isCheck);
            const quantity = cartItem ? cartItem.quantity : 0;
            total += item.sellPrice * quantity;
        });

        setTotalAmount(total);
    }, [listItemInCart, listCart]);
    useEffect(() => {
        getDataCTV();
        getDataProvince();
    }, []);
    useEffect(() => {
        getDataDistrict();
    }, [province]);
    useEffect(() => {
        getDataWard();
    }, [district]);

    return (
        <Grid container spacing={3} sx={{ mt: { md: '160px', xs: '183px' }, mb: 4, px: { md: 16, xs: 2 } }}>
            <Grid item xs={12} md={6} sx={{ overflow: { md: 'auto' }, maxHeight: { md: '100vh' } }}>
                <Typography variant="h4" gutterBottom sx={{ mb: 1, fontSize: 22 }}>
                    Thông tin đơn hàng
                </Typography>
                {role === typeRole.ADMIN_CTV && (
                    <FormControl fullWidth sx={{ mb: 1 }}>
                        <InputLabel>Chọn CTV</InputLabel>
                        <Select
                            value={ctv?.id}
                            onChange={(e) => {
                                const selectedCTV = ctvList.find((c: any) => c.id === e.target.value);
                                setCTV(selectedCTV);
                            }}
                            sx={{
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderRadius: '3px',
                                },
                            }}
                            label={'Chọn CTV'}
                        >
                            {ctvList.map((ctv: any) => (
                                <MenuItem key={ctv.id} value={ctv.id}>
                                    {ctv.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )}

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
                    }}
                />

                <TextField
                    label="Tiền Thu Khách (Tiền COD)"
                    variant="outlined"
                    fullWidth
                    required
                    type="text"
                    helperText="Tổng tiền thu khách cộng cả phí ship"
                    value={totalCOD}
                    onChange={(e) => setTotalCOD(formatCurrency(e.target.value))}
                    sx={{ mb: 1 }}
                    InputProps={{
                        sx: {
                            borderRadius: '3px',
                        },
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
                    }}
                />

                <Typography variant="body2" sx={{ marginBottom: 1 }}>
                    {'Ảnh ghi chú (Nếu có)'}
                </Typography>
                <Stack direction="row" spacing={2} sx={{ mb: 2, mt: 2 }}>
                    {uploadedImages.map((file, index) => (
                        <Box key={index} sx={{ position: 'relative' }}>
                            <img
                                src={URL.createObjectURL(file)}
                                alt={`uploaded-${index}`}
                                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                            />
                            <IconButton
                                onClick={() => handleImageRemove(index)}
                                sx={{ position: 'absolute', top: 0, right: 0 }}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Box>
                    ))}
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
                </Stack>

                <Divider sx={{ my: 2 }}></Divider>
                <Typography variant="h4" gutterBottom sx={{ mb: 1, fontSize: 22 }}>
                    Giao hàng
                </Typography>
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <RadioGroup value={shippingMethod} onChange={handleShippingMethodChange}>
                        <FormControlLabel
                            value="VIETTELPOST"
                            control={<Radio sx={{ '&.Mui-checked': { color: 'red' } }} />}
                            label={
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        border: '1px solid #ccc',
                                        borderRadius: '4px',
                                        padding: '10px',
                                        margin: '5px 0',
                                        width: '200px',
                                        backgroundColor: shippingMethod === 'Viettelpost' ? '#f5f5f5' : 'transparent',
                                        transition: 'background-color 0.3s',
                                    }}
                                >
                                    <img
                                        src={require('../../../static/Logo-Viettel-Post-Red.png')}
                                        alt="Viettelpost"
                                        style={{ width: 40, marginRight: 8 }}
                                    />
                                    Viettelpost
                                </div>
                            }
                        />
                        <FormControlLabel
                            value="GRAB"
                            control={<Radio sx={{ '&.Mui-checked': { color: 'green' } }} />}
                            label={
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        border: '1px solid #ccc',
                                        borderRadius: '4px',
                                        padding: '10px',
                                        margin: '5px 0',
                                        width: '200px',
                                        backgroundColor: shippingMethod === 'Grab/Kho khác' ? '#f5f5f5' : 'transparent',
                                        transition: 'background-color 0.3s',
                                    }}
                                >
                                    <img
                                        src={require('../../../static/grab_logo_icon.png')}
                                        alt="Grab"
                                        style={{ width: 40, marginRight: 8 }}
                                    />
                                    Grab/Kho khác
                                </div>
                            }
                        />
                        <FormControlLabel
                            value="OFFLINE"
                            control={<Radio sx={{ '&.Mui-checked': { color: 'blue' } }} />}
                            label={
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        border: '1px solid #ccc',
                                        borderRadius: '4px',
                                        padding: '10px',
                                        margin: '5px 0',
                                        width: '200px',
                                        backgroundColor: shippingMethod === 'Offline' ? '#f5f5f5' : 'transparent',
                                        transition: 'background-color 0.3s',
                                    }}
                                >
                                    <img
                                        src={require('../../../static/store-icon.png')}
                                        alt="Offline"
                                        style={{ width: 40, marginRight: 8 }}
                                    />
                                    Offline
                                </div>
                            }
                        />
                    </RadioGroup>
                </FormControl>
                {(shippingMethod === 'VIETTELPOST' || shippingMethod === 'GRAB') && (
                    <>
                        {shippingMethod === 'GRAB' && (
                            <TextField
                                label="Phí Ship Grab/Kho khác"
                                variant="outlined"
                                fullWidth
                                value={shippingFee}
                                type="text"
                                onChange={(e) => setShippingFee(formatCurrency(e.target.value))}
                                sx={{ mb: 1 }}
                                InputProps={{
                                    sx: {
                                        borderRadius: '3px',
                                    },
                                }}
                            />
                        )}

                        <TextField
                            label="Số Điện Thoại Khách Hàng"
                            variant="outlined"
                            fullWidth
                            value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value)}
                            sx={{ mb: 1 }}
                            InputProps={{
                                sx: {
                                    borderRadius: '3px',
                                },
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
                <Button
                    variant="contained"
                    fullWidth
                    sx={{ mt: 3, bgcolor: 'rgb(27, 191, 177)', display: { xs: 'none', sm: 'block' } }}
                    onClick={() => {
                        handleBuy();
                    }}
                >
                    ĐẶT HÀNG NGAY
                </Button>
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
                    <Box sx={{ p: 2 }}>
                        {listItemInCart
                            .filter((item: any) => {
                                const cartItem = listCart.find((cartItem: any) => cartItem.productDetailId === item.id);
                                return cartItem && cartItem.isCheck; // Chỉ lấy các item có isCheck = true
                            })
                            .map((item: any, index: number) => {
                                const cartItem = listCart.find((cartItem: any) => cartItem.productDetailId === item.id);
                                const quantity = cartItem ? cartItem.quantity : 0;

                                return (
                                    <Box key={item.productDetailId}>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                borderRadius: '4px',
                                                boxShadow: 1,
                                            }}
                                        >
                                            <Box sx={{ position: 'relative', mr: 1 }}>
                                                <img
                                                    src={
                                                        item.image.startsWith('uploads')
                                                            ? `${HOST_BE}/${item.image}`
                                                            : item.image
                                                    }
                                                    alt={item.name}
                                                    style={{ width: 100, height: 'auto', borderRadius: '4px' }}
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
                                                    {quantity}
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
                                                    <Typography variant="h6" sx={{ fontSize: 16 }}>
                                                        {item.name}
                                                    </Typography>
                                                    <Typography variant="body1" sx={{ fontSize: 14 }} color="#111">
                                                        {formatPrice(item.sellPrice)}
                                                    </Typography>
                                                </Box>
                                                <Typography variant="body2" color="textSecondary">
                                                    Size: {item.sizeName}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        {index < listCheckout.length - 1 && <Divider sx={{ my: 2 }} />}
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
                                {formatPrice(totalAmount + Number(shippingFee.replace(',', '')))}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
                <Button
                    variant="contained"
                    fullWidth
                    sx={{ mt: 3, bgcolor: 'rgb(27, 191, 177)', display: { xs: 'block', sm: 'none' } }}
                    onClick={() => {
                        handleBuy();
                    }}
                >
                    ĐẶT HÀNG NGAY
                </Button>
            </Grid>
        </Grid>
    );
};

export default Checkout;
