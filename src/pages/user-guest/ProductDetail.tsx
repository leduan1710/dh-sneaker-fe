import React, { useEffect, useState } from 'react';
import {
    Container,
    Grid,
    Paper,
    Typography,
    Button,
    Box,
    ImageList,
    ImageListItem,
    Breadcrumbs,
    IconButton,
    Divider,
} from '@mui/material';
import { useStore } from 'react-redux';
import { change_is_loading } from '../../reducers/Actions';
import { GetGuestApi } from '../../untils/Api';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import HomeIcon from '@mui/icons-material/Home';
import { formatPrice } from '../../untils/Logic';

const ProductDetail: React.FC = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState<any>(undefined);
    const store = useStore();
    const [selectedImage, setSelectedImage] = useState('');

    const getData = async () => {
        store.dispatch(change_is_loading(true));
        try {
            const resProduct = await GetGuestApi(`/api/product/${productId}`);
            if (resProduct.data.message === 'Success') {
                setProduct(resProduct.data.product);
                setSelectedImage(resProduct.data.product.imageList[0]);
            }
        } catch (error) {
            toast.error('Lỗi');
        } finally {
            store.dispatch(change_is_loading(false));
        }
    };

    useEffect(() => {
        getData();
    }, [productId]);

    return (
        <Container sx={{ marginTop: '110px' }}>
            <Box mt={5}>
                <Breadcrumbs separator="››" aria-label="breadcrumb">
                    <IconButton href="/">
                        <HomeIcon fontSize="inherit" />
                    </IconButton>

                    <Typography color="textPrimary">Trang Chủ</Typography>
                    <Typography color="textPrimary">Giày Dép Đế Cao</Typography>
                    <Typography color="textPrimary">{product?.name}</Typography>
                </Breadcrumbs>
            </Box>
            <Grid container spacing={2} mt={2}>
                {/* Phần bên trái */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={3}>
                        <Box>
                            <img
                                src={selectedImage}
                                alt={product?.name}
                                style={{
                                    width: '100%',
                                    height: 'auto',
                                    borderRadius: '8px',
                                }}
                            />
                        </Box>
                        <Box display="flex" flexWrap="wrap" justifyContent="flex-start" style={{ marginTop: '8px' }}>
                            {product?.imageList?.map((image: any, index: number) => (
                                <Box key={index} style={{ margin: '4px' }}>
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
                    </Paper>
                    <Box mt={2}>
                        <Typography variant="h6">Mô tả</Typography>
                        <Typography variant="body2">{product?.describe}</Typography>
                    </Box>
                </Grid>

                {/* Phần bên phải */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} style={{ padding: '16px', height: '100%' }}>
                        <Typography variant="h4" sx={{mt: 1, mb: 2}}>{product?.name}</Typography>
                        <Divider></Divider>

                        <Typography variant="h5" sx={{mt: 1, mb: 1}}>Màu sắc: {product?.colorName}</Typography>
                        <Divider></Divider>

                        <Typography variant="h5" style={{ margin: '16px 0' }}>
                            {formatPrice(product?.sellPrice)}
                        </Typography>

                        <Typography variant="subtitle1">Kích thước:</Typography>
                        <Box display="flex" flexWrap="wrap" mt={1}>
                            {product?.sizes?.map((size: string) => (
                                <Button key={size} variant="outlined" style={{ margin: '4px' }}>
                                    {size}
                                </Button>
                            ))}
                        </Box>

                        <Box mt={2}>
                            <Typography variant="subtitle1">Số lượng:</Typography>
                            <Box display="flex" alignItems="center">
                                <Button variant="contained" style={{ margin: '4px' }}>
                                    -
                                </Button>
                                <Typography variant="body1" style={{ margin: '0 8px' }}>
                                    1
                                </Typography>
                                <Button variant="contained" style={{ margin: '4px' }}>
                                    +
                                </Button>
                            </Box>
                        </Box>

                        <Box mt={2}>
                            <Button variant="contained" color="primary" style={{ marginRight: '8px' }}>
                                Thêm vào giỏ
                            </Button>
                            <Button variant="contained" color="secondary">
                                Mua ngay
                            </Button>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default ProductDetail;
