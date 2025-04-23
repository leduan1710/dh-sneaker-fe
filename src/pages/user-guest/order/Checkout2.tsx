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
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import UploadTwoToneIcon from '@mui/icons-material/UploadTwoTone';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import axios from 'axios';
import { formatPrice, formatTitle, removeItemFromCart, toastSuccess, toastWarning } from '../../../untils/Logic';
import { useSelector, useStore } from 'react-redux';
import { ReducerProps } from '../../../reducers/ReducersProps';
import { HOST_BE } from '../../../common/Common';
import { PostApi } from '../../../untils/Api';

const Input = styled('input')({
    display: 'none',
});

const Checkout: React.FC = () => {
    const store = useStore();
    const user = useSelector((state: ReducerProps) => state.user);

    const listItemInCart = useSelector((state: ReducerProps) => state.listItemInCart);
    const listCart = JSON.parse(localStorage.getItem('listCart') || '[]');

    const [customerName, setCustomerName] = useState('');
    const [totalCOD, setTotalCOD] = useState('');
    const [totalAmount, setTotalAmount] = useState(0);

    const [orderNote, setOrderNote] = useState('');
    const [selectImage, setSelectImage] = useState<File | null>(null);
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

    const handleShippingMethodChange = (event: any) => {
        if (event.target.value === 'VIETTELPOST') setShippingFee('30000');
        else setShippingFee('0');
        setShippingMethod(event.target.value);
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
    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const address = e.target.value;
        setCustomerAddress(address);
    };
    const handleBuy2 = async () => {
        // Tạo danh sách chi tiết đơn hàng
        const listOrderDetail = listItemInCart.map((item: any) => {
            const index_quantity = listCart.findIndex((item_inStore: any) => item_inStore.productDetailId === item.id);
            return {
                productDetailId: item.id,
                productName: item.name,
                image: item.image,
                price: item.sellPrice,
                color: item.colorName,
                size: item.sizeName,
                quantity: listCart[index_quantity].quantity,
            };
        });

        if (shippingMethod === 'OFFLINE') {
            const formData = new FormData();

            // Thêm thông tin đơn hàng vào FormData
            formData.append('userId', user.id)
            formData.append('ctvName', user.name);
            formData.append('ctvNote', orderNote);
            formData.append('customerName', customerName);
            formData.append('shipMethod', shippingMethod);
            formData.append('paid', 'true');
            formData.append('CODPrice', totalCOD.toString());
            formData.append('shipFee', '0');
            formData.append('listOrderDetail', JSON.stringify(listOrderDetail));

            // Upload hình ảnh nếu có
            if (selectImage) {
                const uniqueFilename = `image_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                const imageBlob = await fetch(URL.createObjectURL(selectImage)).then((response) => response.blob());
                formData.append('file', imageBlob, uniqueFilename);
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
                }
            } catch (error) {
                console.error('Failed to place order:', error);
            }
        } else {
            // Đơn hàng online
            const formData = new FormData();

            // Thêm thông tin đơn hàng vào FormData
            formData.append('userId', user.id)
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
            formData.append('listOrderDetail', JSON.stringify(listOrderDetail));

            // Upload hình ảnh nếu có
            if (selectImage) {
                const uniqueFilename = `image_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                const imageBlob = await fetch(URL.createObjectURL(selectImage)).then((response) => response.blob());
                formData.append('file', imageBlob, uniqueFilename);
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
                }
            } catch (error) {
                console.error('Failed to place order:', error);
            }
        }
    };
    const handleBuy = async () => {
        const listOrderDetail = listItemInCart.map((item: any) => {
            const index_quantity = listCart.findIndex((item_inStore: any) => item_inStore.productDetailId == item.id);
            return {
                productDetailId: item.id,
                productName: item.name,
                image: item.image,
                price: item.sellPrice,
                color: item.colorName,
                size: item.sizeName,
                quantity: listCart[index_quantity].quantity,
            };
        });
        const order = {
            ctvName: user.name,
            ctvNote: orderNote,
            customerName: customerName,
            customerPhone: customerPhone,
            addressDetail: customerAddress,
            address: {
                province: province,
                district: district,
                ward: ward,
            },
            shipMethod: shippingMethod,
            paid: true,
            CODPrice: Number(totalCOD),
            shipFee: Number(shippingFee),
        };
        const orderOffline = {
            ctvName: user.name,
            ctvNote: orderNote,
            customerName: customerName,
            shipMethod: shippingMethod,
            paid: true,
            CODPrice: Number(totalCOD),
            shipFee: 0,
        };

        ////////////
        const orders = await PostApi('/user/handle-order', localStorage.getItem('token'), {
            order: shippingMethod === 'OFFLINE' ? orderOffline : order,
            listOrderDetail: listOrderDetail,
        });
        if (orders.data.message == 'Success') {
            toastSuccess('Đặt hàng thành công');
        } else {
        }
    };
    useEffect(() => {
        let total = 0;

        listItemInCart.forEach((item: any) => {
            const cartItem = listCart.find((cartItem: any) => cartItem.productDetailId === item.id);
            const quantity = cartItem ? cartItem.quantity : 0;
            total += item.sellPrice * quantity;
        });

        setTotalAmount(total);
    }, [listItemInCart, listCart]);

    useEffect(() => {
        getDataProvince();
    }, []);
    useEffect(() => {
        getDataDistrict();
    }, [province]);
    useEffect(() => {
        getDataWard();
    }, [district]);

    return (
        <Grid container spacing={3} sx={{ mt: { md: '160px', xs: '170px' }, mb: 4, px: { md: 16, xs: 2 } }}>
            <Grid item xs={12} md={6} sx={{ overflow: { md: 'auto' }, maxHeight: { md: '100vh' } }}>
                <Typography variant="h4" gutterBottom sx={{ mb: 1, fontSize: 22 }}>
                    Thông tin đơn hàng
                </Typography>

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
                    type="number"
                    helperText="Tổng tiền thu khách cộng cả phí ship"
                    value={totalCOD}
                    onChange={(e) => setTotalCOD(e.target.value)}
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
                    rows={2}
                    value={orderNote}
                    onChange={(e) => setOrderNote(e.target.value)}
                    sx={{ mb: 1 }}
                    InputProps={{
                        sx: {
                            borderRadius: '3px',
                        },
                    }}
                />

                {/* <label htmlFor="upload-button">
                    <Typography variant="body2" sx={{ marginBottom: 1 }}>
                        {'Ảnh ghi chú (Nếu có)'}
                    </Typography>
                    <input
                        accept="image/*"
                        id="upload-button"
                        type="file"
                        multiple
                        onChange={(e: any) => {
                            const file = e.target.files[0];
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
                        style={{ display: 'none' }}
                    />
                    <IconButton component="span" sx={{ width: '100px', height: '100px', border: '1px dashed grey' }}>
                        <AddPhotoAlternateIcon fontSize="large" />
                    </IconButton>
                </label> */}
                <Typography variant="body2" sx={{ marginBottom: 1 }}>
        {"Ảnh ghi chú (Nếu có)"}
    </Typography>
                <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                
                    {selectImage && (
                        <Avatar
                            variant="square"
                            sx={{ height: {md: 200, xs: 250}, width: "auto" }}
                            src={selectImage ? URL.createObjectURL(selectImage) : undefined}
                        />
                    )}
                    {!selectImage && (
                        <IconButton
                            component="span"
                            disabled
                            sx={{ width: '100px', height: '100px', border: '1px dashed grey' }}
                        >
                            <AddPhotoAlternateIcon fontSize="large" />
                        </IconButton>
                    )}
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
                        style={{ display: 'none' }}
                        onChange={(e: any) => {
                            const file = e.target.files[0];
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
                </Box>
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
                                type="number"
                                onChange={(e) => setShippingFee(e.target.value)}
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
                        handleBuy2();
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
                    <Box sx={{ p: 3 }}>
                        {listItemInCart.map((item: any, index: number) => {
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
                                                <Typography variant="h6" sx={{ fontSize: 17 }}>
                                                    {item.name}
                                                </Typography>
                                                <Typography variant="body1" sx={{ fontSize: 15 }} color="#111">
                                                    {formatPrice(item.sellPrice)}
                                                </Typography>
                                            </Box>
                                            <Typography variant="body2" color="textSecondary">
                                                Size: {item.sizeName}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    {index < listItemInCart.length - 1 && <Divider sx={{ my: 2 }} />}
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
            </Grid>
        </Grid>
    );
};

export default Checkout;
