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
import { add_list_item_in_cart, change_is_loading, set_number_cart } from '../../../reducers/Actions';
import { GetGuestApi } from '../../../untils/Api';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import HomeIcon from '@mui/icons-material/Home';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import RemoveOutlinedIcon from '@mui/icons-material/RemoveOutlined';
import { addToListCartStore, filterInputNumberCart, formatPrice, toastError, toastSuccess } from '../../../untils/Logic';
import HotStyle from '../../../components/user-guest/home/HotStyle';

interface SectionHeaderProps {
    title: string;
    show: boolean;
    toggle: () => void; // Định nghĩa kiểu cho toggle
}

const ProductDetail: React.FC = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState<any>(undefined);
    const [selectedProductDetail, setSelectedProductDetail] = useState<any>(undefined);
    const [productDetails, setProductDetails] = useState<any>(undefined);

    const [quantity, setQuantity] = useState<number>(1);

    const [showDetails, setShowDetails] = useState(false);
    const [showSpecs, setShowSpecs] = useState(false);
    const [showPolicy, setShowPolicy] = useState(false);
    const [showCare, setShowCare] = useState(false);
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
        addToListCartStore(selectedProductDetail.id, Number(quantity), selectedProductDetail);
        store.dispatch(set_number_cart(Number(quantity)));
        store.dispatch(add_list_item_in_cart(selectedProductDetail));
        toastSuccess('Thành công');
    };
    useEffect(() => {
        getData();
    }, [productId]);
    const SectionHeader: React.FC<SectionHeaderProps> = ({ title, show, toggle }) => (
        <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            pt={1}
            pb={1}
            borderBottom="0.5px solid rgb(152, 163, 167)"
        >
            <Typography variant="h5">{title}</Typography>
            <IconButton onClick={toggle}>{show ? <ExpandLessIcon /> : <ExpandMoreIcon />}</IconButton>
        </Box>
    );
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
                    <Grid item xs={12} md={6} sx={{ overflowY: 'auto', maxHeight: '155vh' }}>
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
                            <Box
                                display="flex"
                                flexWrap="wrap"
                                justifyContent="flex-start"
                                style={{ marginTop: '8px' }}
                            >
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
                        <Paper elevation={3} sx={{ padding: '16px', mt: 2, display: { xs: 'none', md: 'block' } }}>
                            <Box sx={{ pl: 2, pr: 2, pb: 2, borderRadius: '8px', boxShadow: 1 }}>
                                <SectionHeader
                                    title="MÔ TẢ SẢN PHẨM"
                                    show={showDetails}
                                    toggle={() => setShowDetails((prev) => !prev)}
                                />
                                {showDetails && (
                                    <Typography variant="body2" sx={{ mb: 2, mt: 2, textAlign: 'justify' }}>
                                        {product?.describe}
                                    </Typography>
                                )}

                                <SectionHeader
                                    title="THÔNG SỐ"
                                    show={showSpecs}
                                    toggle={() => setShowSpecs((prev) => !prev)}
                                />
                                {showSpecs && (
                                    <Box display="flex" flexDirection="column" sx={{ mt: 1 }}>
                                        {[
                                            { label: 'Upper Material', value: 'Leather' },
                                            { label: 'Sole Material', value: 'Rubber' },
                                            { label: 'Closure Type', value: 'Lace-up' },
                                            { label: 'Weight', value: '400g' },
                                        ].map((spec, index) => (
                                            <Box
                                                display="flex"
                                                justifyContent="space-between"
                                                sx={{ mb: 1 }}
                                                key={index}
                                            >
                                                <Typography variant="body2">{spec.label}</Typography>
                                                <Typography variant="body2">{spec.value}</Typography>
                                            </Box>
                                        ))}
                                    </Box>
                                )}

                                <SectionHeader
                                    title="CHÍNH SÁCH ĐỔI TRẢ"
                                    show={showPolicy}
                                    toggle={() => setShowPolicy((prev) => !prev)}
                                />
                                {showPolicy && (
                                    <>
                                        <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 2, mt: 2 }}>
                                            Free Shipping
                                        </Typography>
                                        <Typography variant="body2" sx={{ mb: 1 }}>
                                            • Delivery within 3-7 days.
                                        </Typography>
                                        <Typography variant="body2" sx={{ mb: 2 }}>
                                            • Full tracking provided.
                                        </Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 2 }}>
                                            Easy Returns
                                        </Typography>
                                        <Typography variant="body2" sx={{ mb: 1 }}>
                                            • 30-day return window.
                                        </Typography>
                                        <Typography variant="body2" sx={{ mb: 0 }}>
                                            • Free returns available.
                                        </Typography>
                                    </>
                                )}

                                <SectionHeader
                                    title="HƯỚNG DẪN BẢO QUẢN"
                                    show={showCare}
                                    toggle={() => setShowCare((prev) => !prev)}
                                />
                                {showCare && (
                                    <>
                                        <Typography variant="body2" sx={{ mb: 2, mt: 2, textAlign: 'justify' }}>
                                            Chất liệu chủ yếu để tạo nên giày dép Crocs là nhựa Croslite, loại nhựa này{' '}
                                            <strong>
                                                không nên để tiếp xúc trực tiếp với ánh nắng mặt trời trong thời gian
                                                dài
                                            </strong>
                                            . Dép Crocs của bạn có thể sẽ bị phai màu, co rút, uốn cong hoặc thậm chí bị
                                            chảy nếu ánh nắng quá mạnh, ảnh hưởng đến form dáng sản phẩm.
                                        </Typography>
                                        <Typography variant="body2" sx={{ mb: 2, mt: 2, textAlign: 'justify' }}>
                                            Nhựa rất dễ bám bẩn nhưng cũng rất dễ vệ sinh, có những vết bẩn chỉ cần lau
                                            bằng khăn ướt là sạch. Vì vậy bạn nên{' '}
                                            <strong>thường xuyên vệ sinh giày dép Crocs</strong>, tránh để vết bẩn bám
                                            lâu ngày.
                                        </Typography>
                                        <Typography variant="body2" sx={{ mb: 2, mt: 2, textAlign: 'justify' }}>
                                            <strong>Không sử dụng chất tẩy quá mạnh</strong> đối với các dòng sản phẩm
                                            theo công nghệ nhuộm, phun sơn như Spray Dye, Tie Dye, Solarized. Điều đó sẽ
                                            khiến sản phẩm bị bay màu và không còn giữ được màu sắc như ban đầu.
                                        </Typography>
                                    </>
                                )}
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Phần bên phải */}
                    <Grid item xs={12} md={6}>
                        <Paper elevation={3} style={{ padding: '16px', height: '100%' }}>
                            <Typography variant="h3" sx={{ mt: 1, mb: 2 }}>
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
                            <Box display="flex" flexWrap="wrap" mt={1}>
                                {productDetails?.map((productDetail: any) => (
                                    <Button
                                        key={productDetail.sizeName}
                                        variant="outlined"
                                        sx={{
                                            margin: '4px',
                                            width: '90px',
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
                                        color: selectedProductDetail.quantity < 10 ? 'orange' : 'green', // Màu cam
                                        fontWeight: 'bold', // Chữ đậm
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
                                >
                                    Mua ngay
                                </Button>
                            </Box>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={6} sx={{ display: { xs: 'block', md: 'none' } }}>
                        <Paper elevation={3} sx={{ padding: '16px', mt: 1 }}>
                            <Box sx={{ pl: 2, pr: 2, pb: 2, borderRadius: '8px', boxShadow: 1 }}>
                                <SectionHeader
                                    title="MÔ TẢ SẢN PHẨM"
                                    show={showDetails}
                                    toggle={() => setShowDetails((prev) => !prev)}
                                />
                                {showDetails && (
                                    <Typography variant="body2" sx={{ mb: 2, mt: 2, textAlign: 'justify' }}>
                                        {product?.describe}
                                    </Typography>
                                )}

                                <SectionHeader
                                    title="THÔNG SỐ"
                                    show={showSpecs}
                                    toggle={() => setShowSpecs((prev) => !prev)}
                                />
                                {showSpecs && (
                                    <Box display="flex" flexDirection="column" sx={{ mt: 1 }}>
                                        {[
                                            { label: 'Upper Material', value: 'Leather' },
                                            { label: 'Sole Material', value: 'Rubber' },
                                            { label: 'Closure Type', value: 'Lace-up' },
                                            { label: 'Weight', value: '400g' },
                                        ].map((spec, index) => (
                                            <Box
                                                display="flex"
                                                justifyContent="space-between"
                                                sx={{ mb: 1 }}
                                                key={index}
                                            >
                                                <Typography variant="body2">{spec.label}</Typography>
                                                <Typography variant="body2">{spec.value}</Typography>
                                            </Box>
                                        ))}
                                    </Box>
                                )}

                                <SectionHeader
                                    title="CHÍNH SÁCH ĐỔI TRẢ"
                                    show={showPolicy}
                                    toggle={() => setShowPolicy((prev) => !prev)}
                                />
                                {showPolicy && (
                                    <>
                                        <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 2, mt: 2 }}>
                                            Free Shipping
                                        </Typography>
                                        <Typography variant="body2" sx={{ mb: 1 }}>
                                            • Delivery within 3-7 days.
                                        </Typography>
                                        <Typography variant="body2" sx={{ mb: 2 }}>
                                            • Full tracking provided.
                                        </Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 2 }}>
                                            Easy Returns
                                        </Typography>
                                        <Typography variant="body2" sx={{ mb: 1 }}>
                                            • 30-day return window.
                                        </Typography>
                                        <Typography variant="body2" sx={{ mb: 0 }}>
                                            • Free returns available.
                                        </Typography>
                                    </>
                                )}

                                <SectionHeader
                                    title="HƯỚNG DẪN BẢO QUẢN"
                                    show={showCare}
                                    toggle={() => setShowCare((prev) => !prev)}
                                />
                                {showCare && (
                                    <>
                                        <Typography variant="body2" sx={{ mb: 2, mt: 2, textAlign: 'justify' }}>
                                            Chất liệu chủ yếu để tạo nên giày dép Crocs là nhựa Croslite, loại nhựa này{' '}
                                            <strong>
                                                không nên để tiếp xúc trực tiếp với ánh nắng mặt trời trong thời gian
                                                dài
                                            </strong>
                                            . Dép Crocs của bạn có thể sẽ bị phai màu, co rút, uốn cong hoặc thậm chí bị
                                            chảy nếu ánh nắng quá mạnh, ảnh hưởng đến form dáng sản phẩm.
                                        </Typography>
                                        <Typography variant="body2" sx={{ mb: 2, mt: 2, textAlign: 'justify' }}>
                                            Nhựa rất dễ bám bẩn nhưng cũng rất dễ vệ sinh, có những vết bẩn chỉ cần lau
                                            bằng khăn ướt là sạch. Vì vậy bạn nên{' '}
                                            <strong>thường xuyên vệ sinh giày dép Crocs</strong>, tránh để vết bẩn bám
                                            lâu ngày.
                                        </Typography>
                                        <Typography variant="body2" sx={{ mb: 2, mt: 2, textAlign: 'justify' }}>
                                            <strong>Không sử dụng chất tẩy quá mạnh</strong> đối với các dòng sản phẩm
                                            theo công nghệ nhuộm, phun sơn như Spray Dye, Tie Dye, Solarized. Điều đó sẽ
                                            khiến sản phẩm bị bay màu và không còn giữ được màu sắc như ban đầu.
                                        </Typography>
                                    </>
                                )}
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
            <Container>
                <Typography variant="h4" sx={{ mt: 2, mb: 2 }}>
                    SẢN PHẨM LIÊN QUAN
                </Typography>
                <HotStyle></HotStyle>
            </Container>
        </>
    );
};

export default ProductDetail;
