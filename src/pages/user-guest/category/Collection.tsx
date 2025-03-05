import React, { useState } from 'react';
import { Container, Grid, Box, Typography, TextField, Button, Chip, IconButton, Drawer } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ProductCard from '../../../components/user-guest/product/ProductCard';
import FilterSection from '../../../components/user-guest/category/FilterSection';
import ColorFilterSection from '../../../components/user-guest/category/ColorFilter';

const ProductCollection = () => {
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
    const [selectedColors, setSelectedColors] = useState<string[]>([]);
    const [openDrawer, setOpenDrawer] = useState(false);
    const [expandSize, setExpandSize] = useState(false);
    const [expandColor, setExpandColor] = useState(false);

    const sizes = ['Size 1', 'Size 2', 'Size 3'];
    const colors = ['Đỏ', 'Xanh', 'Trắng', 'Nâu'];
    const products = [
        {
            imageUrl:
                'https://cdn.shopify.com/s/files/1/0585/8181/1355/files/Giay-Clog-Unisex-Crocs-Inmotion-209964-410-Navy_1_360x.webp?v=1734928990',
            title: 'Giày Clog Unisex Crocs Inmotion - Navy',
            price: '1.995.000đ',
            rating: '★★★★☆',
            reviews: '2',
        },
        {
            imageUrl:
                'https://cdn.shopify.com/s/files/1/0585/8181/1355/files/Giay-Clog-Unisex-Crocs-Inmotion-209964-410-Navy_1_360x.webp?v=1734928990',
            title: 'Giày Clog Unisex Crocs Inmotion - Navy',
            price: '1.995.000đ',
            rating: '★★★★☆',
            reviews: '2',
        },
        // Các sản phẩm khác
    ];

    const toggleSize = (size: string) => {
        setSelectedSizes((prev) => (prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]));
    };

    const toggleColor = (color: string) => {
        setSelectedColors((prev) => (prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]));
    };

    const clearFilters = () => {
        setSelectedSizes([]);
        setSelectedColors([]);
    };

    const toggleDrawer = () => {
        setOpenDrawer(!openDrawer);
    };

    return (
        <Container sx={{ pt: 5, mt: '165px' }} maxWidth="xl">
            <Grid container spacing={3}>
                {/* Phần bên trái cho các tùy chọn lọc */}
                <Grid item xs={12} md={3} sx={{ display: { xs: 'none', md: 'block' } }}>
                    <Box sx={{ border: '1px solid #ddd', padding: 2, bgcolor: 'whitesmoke' }}>
                        <Typography variant="h6">Lọc Sản Phẩm</Typography>

                        {/* Hiển thị tiêu chí lọc đã chọn */}
                        {(selectedSizes.length > 0 || selectedColors.length > 0) && (
                            <Box sx={{ mt: 2, mb: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="body1">Lọc Theo:</Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{ color: 'red', cursor: 'pointer' }}
                                        onClick={clearFilters}
                                    >
                                        Xóa Tất Cả
                                    </Typography>
                                </Box>

                                {selectedColors.map((color) => (
                                    <Chip
                                        key={color}
                                        label={`Màu Sắc: ${color}`}
                                        onDelete={() => toggleColor(color)}
                                        sx={{ margin: '4px' }}
                                    />
                                ))}

                                {selectedSizes.map((size) => (
                                    <Chip
                                        key={size}
                                        label={`Kích Thước: ${size}`}
                                        onDelete={() => toggleSize(size)}
                                        sx={{ margin: '4px' }}
                                    />
                                ))}
                            </Box>
                        )}

                        <FilterSection
                            title="Kích Thước"
                            options={sizes}
                            selectedOptions={selectedSizes}
                            toggleOption={toggleSize}
                            expand={expandSize}
                            setExpand={setExpandSize}
                        />

                        <ColorFilterSection
                            title="Màu Sắc"
                            options={colors}
                            selectedOptions={selectedColors}
                            toggleOption={toggleColor}
                            expand={expandColor}
                            setExpand={setExpandColor}
                        />
                    </Box>
                </Grid>

                {/* Phần bên phải cho thanh tìm kiếm và danh sách sản phẩm */}
                <Grid item xs={12} md={9}>
                    {/* Thanh tìm kiếm */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <TextField
                            variant="outlined"
                            placeholder="Tìm kiếm sản phẩm..."
                            fullWidth
                            InputProps={{ endAdornment: <SearchIcon /> }}
                        />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                        <Button variant="outlined" onClick={toggleDrawer} sx={{ ml: 2, display: { xs: 'block', md: 'none' } }}>
                            Lọc
                        </Button>
                        <Button variant="outlined">Sắp Xếp Theo Giá</Button>
                    </Box>

                    {/* Danh sách sản phẩm */}
                    <Grid container spacing={2}>
                        {products.map((product, index) => (
                            <Grid item xs={6} sm={4} md={3} key={index}>
                                <ProductCard
                                    imageUrl={product.imageUrl}
                                    title={product.title}
                                    price={product.price}
                                    rating={product.rating}
                                    reviews={product.reviews}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            </Grid>

            {/* Drawer cho lọc sản phẩm */}
            <Drawer anchor="right" open={openDrawer} onClose={toggleDrawer}>
                <Box sx={{ width: 250, padding: 2 }}>
                    <Typography variant="h6">Lọc Sản Phẩm</Typography>

                    {/* Hiển thị tiêu chí lọc đã chọn */}
                    {(selectedSizes.length > 0 || selectedColors.length > 0) && (
                        <Box sx={{ mt: 2, mb: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="body1">Lọc Theo:</Typography>
                                <Typography
                                    variant="body2"
                                    sx={{ color: 'red', cursor: 'pointer' }}
                                    onClick={clearFilters}
                                >
                                    Xóa Tất Cả
                                </Typography>
                            </Box>

                            {/* Lọc Màu Sắc */}
                            {selectedColors.map((color) => (
                                <Chip
                                    key={color}
                                    label={`Màu Sắc: ${color}`}
                                    onDelete={() => toggleColor(color)}
                                    sx={{ margin: '4px' }}
                                />
                            ))}

                            {/* Lọc Kích Thước */}
                            {selectedSizes.map((size) => (
                                <Chip
                                    key={size}
                                    label={`Kích Thước: ${size}`}
                                    onDelete={() => toggleSize(size)}
                                    sx={{ margin: '4px' }}
                                />
                            ))}
                        </Box>
                    )}

                    {/* Sử dụng lại FilterSection cho Kích thước */}
                    <FilterSection
                        title="Kích Thước"
                        options={sizes}
                        selectedOptions={selectedSizes}
                        toggleOption={toggleSize}
                        expand={expandSize}
                        setExpand={setExpandSize}
                    />

                    {/* Sử dụng lại ColorFilterSection cho Màu sắc */}
                    <ColorFilterSection
                        title="Màu Sắc"
                        options={colors}
                        selectedOptions={selectedColors}
                        toggleOption={toggleColor}
                        expand={expandColor}
                        setExpand={setExpandColor}
                    />
                </Box>
            </Drawer>
        </Container>
    );
};

export default ProductCollection;