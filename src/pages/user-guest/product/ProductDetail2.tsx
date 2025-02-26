import React, { useEffect, useState } from 'react';
import { Container, Grid, Paper, Typography, Button, Box, Breadcrumbs, IconButton, Divider } from '@mui/material';
import { useStore } from 'react-redux';
import { add_list_item_in_cart, change_is_loading, set_number_cart } from '../../../reducers/Actions';
import { GetGuestApi } from '../../../untils/Api';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import HomeIcon from '@mui/icons-material/Home';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import HotStyle from '../../../components/user-guest/home/HotStyle';
import { addCheckout, addToListCartStore, formatPrice, toastSuccess } from '../../../untils/Logic';
import SizeGuideDialog from './SizeGuideDialog';

const ProductDetail: React.FC = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState<any>(undefined);
    const [selectedProductDetail, setSelectedProductDetail] = useState<any>(undefined);
    const [productDetails, setProductDetails] = useState<any>(undefined);
    const [quantity, setQuantity] = useState<number>(1);
    const store = useStore();
    const nav = useNavigate();
    const [selectedImage, setSelectedImage] = useState('');
    const [openDialog, setOpenDialog] = useState(false);

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const getData = async () => {
        store.dispatch(change_is_loading(true));
        try {
            const resProduct = await GetGuestApi(`/api/product/${productId}`);
            if (resProduct.data.message === 'Success') {
                setProduct(resProduct.data.product);
                setSelectedImage(resProduct.data.product.imageList[0]);
            }
            const resProductDetails = await GetGuestApi(`/api/product-detail-by-product/${productId}`);
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

    const handleAddToCart = () => {
        addToListCartStore(selectedProductDetail.id, quantity, selectedProductDetail);
        store.dispatch(set_number_cart(quantity));
        store.dispatch(add_list_item_in_cart(selectedProductDetail));
        toastSuccess('Thêm vào giỏ hàng thành công');
    };
    const handleBuyNow = () => {
        addCheckout(selectedProductDetail, quantity);
        nav('/checkout');
    };

    useEffect(() => {
        getData();
    }, [productId]);

    return (
        <>
            <Container sx={{ marginTop: { xs: '0px', md: '110px' } }}>
                <Box sx={{ paddingTop: { xs: '0px', md: '10px' } }}>
                    <Breadcrumbs separator="›" aria-label="breadcrumb">
                        <IconButton href="/">
                            <HomeIcon fontSize="small" />
                        </IconButton>
                        <Typography color="textPrimary" fontSize={11}>
                            CROCS
                        </Typography>
                        <Typography color="textPrimary" fontSize={12}>
                            {product?.name}
                        </Typography>
                    </Breadcrumbs>
                </Box>
                <Grid container spacing={2} mt={1} mb={2}>
                    {/* Phần bên trái */}
                    <Grid item xs={12} md={6} sx={{ display: 'flex' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            {product?.imageList?.map((image: any, index: number) => (
                                <Box key={index} sx={{ mb: 1, mr: 1 }}>
                                    <img
                                        src={image}
                                        alt={product.name}
                                        onClick={() => setSelectedImage(image)}
                                        style={{
                                            height: '100px',
                                            width: '100px',
                                            cursor: 'pointer',
                                            borderRadius: '4px',
                                            border:
                                                selectedImage === image
                                                    ? '2px solid rgba(7, 110, 145, 0.89)'
                                                    : '1px solid rgba(99, 120, 127, 0.89)',
                                        }}
                                    />
                                </Box>
                            ))}
                        </Box>

                        <Box sx={{ width: '100%', height: '100%', overflow: 'hidden' }}>
                            <img
                                src={selectedImage}
                                alt={product?.name}
                                style={{
                                    width: '100%',
                                    height: 'auto',
                                    maxHeight: '100%',
                                    objectFit: 'cover',
                                    borderRadius: '8px',
                                }}
                            />
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Box sx={{ pl: '16px', pr: '16px', pt: '2px', height: '100%' }}>
                            <Typography variant="h3" sx={{ mb: 2 }}>
                                {product?.name}
                            </Typography>
                            <Box display="flex" alignItems="center" style={{ margin: '16px 0' }}>
                                <Typography
                                    variant="h5"
                                    style={{
                                        color: 'red',
                                        fontSize: '1.5rem',
                                        marginRight: '16px',
                                    }}
                                >
                                    {formatPrice(product?.sellPrice)}
                                </Typography>
                                <Typography
                                    variant="h5"
                                    style={{
                                        margin: '0',
                                        textDecoration: 'line-through',
                                        color: 'gray',
                                    }}
                                >
                                    {formatPrice(product?.virtualPrice)}
                                </Typography>
                            </Box>
                            <Divider></Divider>
                            <Typography variant="h5" sx={{ mt: 1, mb: 1 }}>
                                Màu sắc: {product?.colorName}
                            </Typography>
                            <Divider></Divider>
                            <Typography variant="h5" sx={{ mt: 1, mb: 1 }}>
                                Kích thước:
                            </Typography>
                            <Box display="flex" alignItems="center" justifyContent="space-between" mt={2}>
                                <Typography variant="h5" sx={{ mt: 1, mb: 1 }}>
                                    Kích thước:
                                </Typography>
                                <Typography
                                    variant="h6"
                                    sx={{ color: 'rgb(172, 0, 207)', cursor: 'pointer', textDecoration: 'underline', fontWeight: 'bold' }}
                                    onClick={handleOpenDialog}
                                >
                                    Hướng dẫn chọn kích thước
                                </Typography>
                            </Box>
                            <SizeGuideDialog open={openDialog} onClose={handleCloseDialog} />

                            <Box display="flex" flexWrap="wrap" mt={1}>
                                {productDetails?.map((productDetail: any) => (
                                    <Button
                                        key={productDetail.sizeName}
                                        variant="outlined"
                                        sx={{
                                            margin: '4px',
                                            width: '95px',
                                            height: '36px',
                                            backgroundColor:
                                                selectedProductDetail === productDetail
                                                    ? 'rgba(7, 110, 145, 0.89)'
                                                    : 'transparent',
                                            color: selectedProductDetail === productDetail ? 'white' : 'inherit',
                                            border:
                                                selectedProductDetail === productDetail
                                                    ? '1px solid rgba(7, 110, 145, 0.89)'
                                                    : '1px solid rgba(99, 120, 127, 0.89)',
                                            borderRadius: '4px',
                                            fontSize: '14px',
                                            fontWeight: '500',
                                            transition: 'background-color 0.3s, color 0.3s, border 0.3s',
                                            '&:hover': {
                                                backgroundColor:
                                                    selectedProductDetail === productDetail
                                                        ? 'rgba(7, 110, 145, 0.7)'
                                                        : 'rgba(99, 120, 127, 0.1)',
                                                border: '1px solid rgba(7, 110, 145, 0.89)',
                                            },
                                        }}
                                        onClick={() => setSelectedProductDetail(productDetail)}
                                    >
                                        {productDetail.sizeName}
                                    </Button>
                                ))}
                            </Box>
                            {selectedProductDetail && (
                                <Typography
                                    variant="h6"
                                    style={{
                                        marginTop: '16px',
                                        color: selectedProductDetail.quantity < 10 ? 'orange' : 'green',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    Còn lại: {selectedProductDetail.quantity} sản phẩm
                                </Typography>
                            )}
                            <Box display="flex" alignItems="center" mt={2}>
                                <LocalShippingOutlinedIcon style={{ marginRight: '8px' }} />
                                <Typography variant="h4">Giao hàng tận nơi</Typography>
                            </Box>
                            <Box mt={2}>
                                <Box display="flex" alignItems="center">
                                    <Button
                                        variant="outlined"
                                        style={{
                                            margin: '1px',
                                            border: '1px solid gray',
                                            backgroundColor: 'white',
                                            width: '40px',
                                            height: '40px',
                                            fontSize: '20px',
                                            color: 'gray',
                                            padding: 0,
                                        }}
                                        onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                                    >
                                        -
                                    </Button>
                                    <input
                                        value={quantity.toString()}
                                        onFocus={(e) => e.target.select()}
                                        onBlur={() => {
                                            if (quantity === 0) {
                                                setQuantity(1);
                                            } else if (quantity > selectedProductDetail.quantity) {
                                                setQuantity(selectedProductDetail.quantity);
                                            }
                                        }}
                                        style={{
                                            width: '50px',
                                            height: '40px',
                                            textAlign: 'center',
                                            border: '1px solid gray',
                                            borderRadius: '4px',
                                            margin: '1px',
                                            padding: '8px',
                                        }}
                                        onChange={(e: any) => {
                                            const value = e.target.value;
                                            // Chỉ cho phép nhập số
                                            if (/^\d*$/.test(value) || value === '') {
                                                setQuantity(value === '' ? 0 : parseInt(value)); // Lưu giá trị là số
                                            }
                                        }}
                                    />
                                    <Button
                                        variant="outlined"
                                        style={{
                                            margin: '1px',
                                            border: '1px solid gray',
                                            backgroundColor: 'white',
                                            width: '40px',
                                            height: '40px',
                                            fontSize: '20px',
                                            color: 'gray',
                                            padding: 0,
                                        }}
                                        onClick={() =>
                                            setQuantity((prev) => Math.min(selectedProductDetail.quantity, prev + 1))
                                        }
                                    >
                                        +
                                    </Button>
                                </Box>
                            </Box>
                            <Box mt={2} display="flex">
                                <Button
                                    variant="outlined"
                                    style={{
                                        borderColor: 'rgb(7, 110, 145)',
                                        color: 'rgb(7, 110, 145)',
                                        backgroundColor: 'white',
                                        width: '210px',
                                        height: '55px',
                                        marginRight: '8px',
                                    }}
                                    onClick={() => {
                                        handleAddToCart();
                                    }}
                                >
                                    Thêm vào giỏ
                                </Button>
                                <Button
                                    variant="contained"
                                    style={{
                                        backgroundColor: 'rgb(7, 110, 145)',
                                        color: 'white',
                                        width: '210px',
                                        height: '55px',
                                    }}
                                    onClick={() => {
                                        handleBuyNow();
                                    }}
                                >
                                    Mua ngay
                                </Button>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>

                {/* Phần thông tin chi tiết */}
                <Grid container spacing={2}>
                    <Grid item xs={12} md={9}>
                        <Paper elevation={3} sx={{ padding: '16px', mt: 2 }}>
                            <Typography variant="h5">Mô tả sản phẩm</Typography>
                            <Typography variant="body2" sx={{ mt: 2, textAlign: 'justify' }}>
                                {product?.describe}
                            </Typography>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="h5">Thông số</Typography>
                            <Box sx={{ mt: 2 }}>
                                {[
                                    { label: 'Upper Material', value: 'Leather' },
                                    { label: 'Sole Material', value: 'Rubber' },
                                    { label: 'Closure Type', value: 'Lace-up' },
                                    { label: 'Weight', value: '400g' },
                                ].map((spec, index) => (
                                    <Grid container key={index} sx={{ mb: 1 }}>
                                        <Grid item xs={4}>
                                            <Paper sx={{ padding: 1, backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
                                                <Typography variant="body2" fontWeight="bold">
                                                    {spec.label}
                                                </Typography>
                                            </Paper>
                                        </Grid>
                                        <Grid item xs={8}>
                                            <Paper sx={{ padding: 1, backgroundColor: '#ffffff', borderRadius: '4px' }}>
                                                <Typography variant="body2">{spec.value}</Typography>
                                            </Paper>
                                        </Grid>
                                    </Grid>
                                ))}
                            </Box>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="h5">Hướng dẫn bảo quản</Typography>
                            <Typography variant="body2" sx={{ mb: 2, mt: 2, textAlign: 'justify' }}>
                                Chất liệu chủ yếu để tạo nên giày dép Crocs là nhựa Croslite, loại nhựa này{' '}
                                <strong>
                                    không nên để tiếp xúc trực tiếp với ánh nắng mặt trời trong thời gian dài
                                </strong>
                                . Dép Crocs của bạn có thể sẽ bị phai màu, co rút, uốn cong hoặc thậm chí bị chảy nếu
                                ánh nắng quá mạnh, ảnh hưởng đến form dáng sản phẩm.
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 2, mt: 2, textAlign: 'justify' }}>
                                Nhựa rất dễ bám bẩn nhưng cũng rất dễ vệ sinh, có những vết bẩn chỉ cần lau bằng khăn
                                ướt là sạch. Vì vậy bạn nên <strong>thường xuyên vệ sinh giày dép Crocs</strong>, tránh
                                để vết bẩn bám lâu ngày.
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 2, mt: 2, textAlign: 'justify' }}>
                                <strong>Không sử dụng chất tẩy quá mạnh</strong> đối với các dòng sản phẩm theo công
                                nghệ nhuộm, phun sơn như Spray Dye, Tie Dye, Solarized. Điều đó sẽ khiến sản phẩm bị bay
                                màu và không còn giữ được màu sắc như ban đầu.
                            </Typography>
                        </Paper>
                    </Grid>

                    {/* Phần chính sách đổi trả */}
                    <Grid item xs={12} md={3}>
                        <Paper elevation={3} sx={{ padding: '16px', mt: 2 }}>
                            <Typography variant="h5" fontWeight="bold">
                                TỔNG ĐÀI HỖ TRỢ
                            </Typography>
                            <Typography variant="body2" sx={{ mt: 1 }}>
                                Hotline mua hàng: <strong>9999999999</strong>
                            </Typography>
                            <Typography variant="body2" sx={{ mt: 1 }}>
                                Hotline hỗ trợ, khiếu nại: <strong>9999999999</strong>
                            </Typography>
                            <Typography variant="body2" sx={{ mt: 1 }}>
                                Thời gian làm việc từ 8h00 - 22h00 (Thứ 2 - Chủ nhật)
                            </Typography>
                            <Divider sx={{ my: 2 }} />
                            <Box>
                                <Typography variant="body2" fontWeight="bold">
                                    MIỄN PHÍ GIAO HÀNG
                                </Typography>
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                    Free ship đơn hàng từ 500k
                                </Typography>
                            </Box>
                            <Divider sx={{ my: 2 }} />
                            <Box>
                                <Typography variant="body2" fontWeight="bold">
                                    ĐỔI TRẢ DỄ DÀNG
                                </Typography>
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                    Đổi trả miễn phí trong vòng 30 ngày
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
            <Container>
                <Typography variant="h4" sx={{ mt: 2, mb: 2 }}>
                    SẢN PHẨM LIÊN QUAN
                </Typography>
                <HotStyle />
            </Container>
        </>
    );
};

export default ProductDetail;
