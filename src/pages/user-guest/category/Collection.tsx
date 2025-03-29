import React, { useEffect, useState } from 'react';
import {
    Container,
    Grid,
    Box,
    Typography,
    TextField,
    Button,
    Chip,
    IconButton,
    Drawer,
    Breadcrumbs,
    InputAdornment,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    SelectChangeEvent,
    Divider,
    Pagination,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ProductCard from '../../../components/user-guest/product/ProductCard';
import FilterSection from '../../../components/user-guest/category/FilterSection';
import ColorFilterSection from '../../../components/user-guest/category/ColorFilter';
import HomeIcon from '@mui/icons-material/Home';
import FilterListIcon from '@mui/icons-material/FilterList';
import TuneIcon from '@mui/icons-material/Tune';
import { GetGuestApi, PostGuestApi } from '../../../untils/Api';
import { useStore } from 'react-redux';
import { change_is_loading } from '../../../reducers/Actions';
import Footer from '../../../components/user-guest/footer/Footer';
import { useLocation } from 'react-router-dom';

interface optionsFilterProps {
    sort: any;
    typeId: any;
    sizeId: any;
    styleId: any;
    colorId: any;
}

const ProductCollection = () => {
    const store = useStore();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const categoryName = queryParams.get('category');
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
    const [selectedColors, setSelectedColors] = useState<string[]>([]);
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
    const [openDrawer, setOpenDrawer] = useState(false);
    const [expandSize, setExpandSize] = useState(false);
    const [expandColor, setExpandColor] = useState(false);
    const [expandStyle, setExpandStyle] = useState(false);
    const [expandType, setExpandType] = useState(false);

    const [sortOption, setSortOption] = React.useState('');

    const [optionType, setOptionType] = useState<any>(undefined);
    const [optionStyle, setOptionStyle] = useState<any>(undefined);
    const [optionColor, setOptionColor] = useState<any>(undefined);
    const [optionSize, setOptionSize] = useState<any>(undefined);

    const [optionTypeCurrent, setOptionTypeCurent] = useState<any>('');
    const [optionColorCurrent, setOptionColorCurent] = useState<any>('');
    const [optionStylesCurrent, setOptionStylesCurent] = useState<any>('');
    const [optionSizeCurrent, setOptionSizeCurent] = useState<any>('');

    const [limit, setLimit] = useState<number>(60);
    const [step, setStep] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [listProduct, setListProduct] = useState<any>([]);
    const [listProductCurrent, setListProductCurrent] = useState<any>(undefined);
    const [req, setReq] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState<number>(1);

    const [optionsFilter, setOptionsFilter] = useState<optionsFilterProps>({
        sort: null,
        typeId: null,
        sizeId: null,
        styleId: null,
        colorId: null,
    });

    const handleSortChange = (event: SelectChangeEvent<string>) => {
        setSortOption(event.target.value);
        console.log('Sắp xếp theo:', event.target.value);
    };

    const getDataFilter = async () => {
        const resTypes = await GetGuestApi('/api/all-type');
        if (resTypes.data.message == 'Success') {
            setOptionType(resTypes.data.types);
        }
        const resSizes = await GetGuestApi('/api/all-size');
        if (resSizes.data.message == 'Success') {
            setOptionSize(resSizes.data.sizes);
        }
        const resStyles = await GetGuestApi('/api/all-style');
        if (resStyles.data.message == 'Success') {
            setOptionStyle(resStyles.data.styles);
        }
        const resColors = await GetGuestApi('/api/all-color');
        if (resColors.data.message == 'Success') {
            setOptionColor(resColors.data.colors);
        }
    };
    const getProductByCategory = async () => {
        if (categoryName) {
            store.dispatch(change_is_loading(true));
            const resProducts = await PostGuestApi(
                `/api/get-product-by-categoryName/${categoryName}/${limit}/${step}`,
                {
                    options: optionsFilter,
                },
            );
            if (resProducts.data.message == 'Success') {
                const filterProduct = resProducts.data.products.filter((product: any) => product != null);
                if (filterProduct.length < limit || optionsFilter.sort == 'desc' || optionsFilter.sort == 'asc') {
                    setHasMore(false);
                } else {
                    setHasMore(true);
                }
                if (step == 1) {
                    setListProduct(filterProduct);
                } else {
                    setListProduct((prev: any) => prev.concat(filterProduct));
                }
                setReq(false);
            }
            store.dispatch(change_is_loading(false));
        }
    };
    const handleReq = () => {
        setLimit(60);
        setStep(1);
        if (optionsFilter.sort == 'desc' || optionsFilter.sort == 'asc') {
            setCurrentPage(1);
        }
        setReq(true);
    };
    const toggleSize = (size: string) => {
        setSelectedSizes((prev) => (prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]));
    };

    const toggleColor = (color: string) => {
        setSelectedColors((prev) => (prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]));
    };

    const toggleStyle = (style: string) => {
        setSelectedStyles((prev) => (prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style]));
    };

    const toggleType = (type: string) => {
        setSelectedTypes((prev) => (prev.includes(type) ? prev.filter((c) => c !== type) : [...prev, type]));
    };

    const clearFilters = () => {
        setSelectedSizes([]);
        setSelectedColors([]);
        setSelectedStyles([]);
        setSelectedTypes([]);
    };

    const toggleDrawer = () => {
        setOpenDrawer(!openDrawer);
    };

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setCurrentPage(value);
        setStep(value); // Adjust step to the current page
    };

    useEffect(() => {
        getDataFilter();
        getProductByCategory();
    }, []);
    useEffect(() => {
        getProductByCategory();
    }, [currentPage]);

    useEffect(() => {
        setListProductCurrent(listProduct.slice(0 + (currentPage - 1) * 24, 24 + (currentPage - 1) * 24));
    }, [listProduct]);

    useEffect(() => {
        setListProductCurrent(listProduct.slice(currentPage == 1 ? 0 : (currentPage - 1) * 24, 24 * currentPage));
    }, [currentPage]);

    const filterSize = (
        <FilterSection
            title="Kích Thước"
            options={optionSize}
            selectedOptions={selectedSizes}
            toggleOption={toggleSize}
            expand={expandSize}
            setExpand={setExpandSize}
        />
    );
    const filterType = (
        <FilterSection
            title="Loại sản phẩm"
            options={optionType}
            selectedOptions={selectedTypes}
            toggleOption={toggleType}
            expand={expandType}
            setExpand={setExpandType}
        />
    );
    const filterStyle = (
        <FilterSection
            title="Kiểu dáng"
            options={optionStyle}
            selectedOptions={selectedStyles}
            toggleOption={toggleStyle}
            expand={expandStyle}
            setExpand={setExpandStyle}
        />
    );
    const filterColor = (
        <ColorFilterSection
            title="Màu Sắc"
            options={optionColor}
            selectedOptions={selectedColors}
            toggleOption={toggleColor}
            expand={expandColor}
            setExpand={setExpandColor}
        />
    );
    console.log(listProduct.length, Math.ceil(listProduct.length / limit))
    return (
        <>
        <Container sx={{ pt: 5, mt: '165px' }} maxWidth="xl">
            <Grid container spacing={3}>
                {/* Phần bên trái cho các tùy chọn lọc */}
                <Grid item xs={12} md={3} sx={{ display: { xs: 'none', md: 'block' } }}>
                    <Box sx={{ padding: 2, ml: 2, mr: 2, bgcolor: '#f9f9f9' }}>
                        {/* Hiển thị tiêu chí lọc đã chọn */}
                        {(selectedSizes.length > 0 || selectedColors.length > 0) && (
                            <Box sx={{ mt: 1, mb: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="body1">Lọc Theo:</Typography>
                                    <Typography variant="body2" sx={{ cursor: 'pointer' }} onClick={clearFilters}>
                                        Xóa Tất Cả
                                    </Typography>
                                </Box>

                                {selectedStyles.map((style: any) => (
                                    <Chip
                                        key={style}
                                        label={`Kiểu dáng: ${style.name}`}
                                        onDelete={() => toggleStyle(style)}
                                        sx={{ margin: '4px' }}
                                    />
                                ))}
                                {selectedTypes.map((type: any) => (
                                    <Chip
                                        key={type}
                                        label={`Loại: ${type.name}`}
                                        onDelete={() => toggleType(type)}
                                        sx={{ margin: '4px' }}
                                    />
                                ))}
                                {selectedColors.map((color: any) => (
                                    <Chip
                                        key={color}
                                        label={`Màu Sắc: ${color.name}`}
                                        onDelete={() => toggleColor(color)}
                                        sx={{ margin: '4px' }}
                                    />
                                ))}

                                {selectedSizes.map((size: any) => (
                                    <Chip
                                        key={size}
                                        label={`Kích Thước: ${size.name}`}
                                        onDelete={() => toggleSize(size)}
                                        sx={{ margin: '4px' }}
                                    />
                                ))}
                            </Box>
                        )}

                        {filterStyle}
                        <Divider sx={{ mt: 2 }}></Divider>
                        {filterType}
                        <Divider sx={{ mt: 2 }}></Divider>
                        {filterSize}
                        <Divider sx={{ mt: 2 }}></Divider>
                        {filterColor}
                    </Box>
                </Grid>

                {/* Phần bên phải cho thanh tìm kiếm và danh sách sản phẩm */}
                <Grid item xs={12} md={9}>
                    <Box sx={{ paddingTop: { xs: '0px', md: '10px' } }}>
                        <Breadcrumbs separator="›" aria-label="breadcrumb">
                            <IconButton href="/">
                                <HomeIcon fontSize="small" />
                            </IconButton>
                            <Typography color="textPrimary" fontSize={13} fontWeight={520}>
                                CROCS
                            </Typography>
                            <Typography color="textPrimary" fontSize={13}>
                                CROCS
                            </Typography>
                        </Breadcrumbs>
                    </Box>
                    {/* Thanh tìm kiếm */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <TextField
                            variant="outlined"
                            placeholder="Tìm kiếm sản phẩm trong bộ sưu tập này..."
                            fullWidth
                            sx={{
                                borderRadius: 20, // Góc tròn
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 20, // Góc tròn cho input
                                    '& fieldset': {
                                        borderColor: '#ccc', // Màu viền
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#888', // Màu viền khi hover
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#3f51b5', // Màu viền khi focus
                                    },
                                },
                                '& input': {
                                    padding: '10px 12px', // Padding để giảm chiều cao
                                    fontSize: '0.875rem', // Kích thước font
                                },
                            }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                        <Button
                            variant="outlined"
                            onClick={toggleDrawer}
                            sx={{
                                borderColor: 'darkgray',
                                color: '#111111',
                                fontWeight: 'bold', // Chữ in đậm
                                fontSize: '1rem', // Kích thước font chữ
                                minWidth: 165,
                                '&:hover': {
                                    borderColor: 'black',
                                    color: 'black',
                                },
                            }}
                            startIcon={<TuneIcon sx={{ marginRight: 1 }} />} // Sử dụng biểu tượng mới
                        >
                            Lọc
                        </Button>
                        <FormControl variant="outlined" sx={{ minWidth: 165, ml: '10px' }}>
                            <InputLabel
                                id="sort-select-label"
                                sx={{
                                    color: '#111111',
                                    fontWeight: 'bold', // Chữ in đậm
                                    fontSize: '1rem', // Kích thước font chữ
                                }}
                            >
                                Sắp Xếp
                            </InputLabel>
                            <Select
                                labelId="sort-select-label"
                                value={sortOption}
                                onChange={handleSortChange}
                                label="Sắp Xếp"
                                MenuProps={{
                                    PaperProps: {
                                        style: {
                                            maxHeight: 200,
                                            width: 165,
                                            color: 'black',
                                        },
                                    },
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'darkgray', // Màu viền cho Select
                                    },
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'black', // Màu viền khi hover
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'darkgray', // Màu viền khi focus
                                    },
                                    '& .MuiSelect-select': {
                                        color: 'black', // Màu chữ của Select
                                        fontWeight: 'bold', // Chữ in đậm cho Select
                                        fontSize: '1rem', // Kích thước font chữ
                                    },
                                }}
                            >
                                <MenuItem value="best-selling">Bán Chạy</MenuItem>
                                <MenuItem value="newest">Mới Nhất</MenuItem>
                                <MenuItem value="price-desc">Giá Giảm Dần</MenuItem>
                                <MenuItem value="price-asc">Giá Tăng Dần</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>

                    {/* Danh sách sản phẩm */}
                    <Grid container spacing={2}>
                        {listProduct.map((product: any, index: number) => {
                            const colorInfo =
                                optionColor && optionColor.length > 0
                                    ? optionColor.find((color: any) => color.id === product.colorId)
                                    : null;

                            const colorCode = colorInfo ? colorInfo.colorCode : '#000000';

                            return (
                                <Grid item xs={6} sm={4} md={3} key={index}>
                                    <ProductCard
                                        imageUrl={product.image}
                                        title={product.name}
                                        price={product.sellPrice}
                                        salePrice={product.virtualPrice}
                                        rating={'★★★★★'}
                                        color={colorCode}
                                    />
                                </Grid>
                            );
                        })}
                    </Grid>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                        <Pagination
                            count={Math.ceil(listProduct.length / 2)}
                            page={currentPage}
                            onChange={handlePageChange}
                            variant="outlined"
                            shape="rounded"
                        />
                    </Box>
                    
                </Grid>
            </Grid>

            {/* Drawer cho lọc sản phẩm */}
            <Drawer anchor="right" open={openDrawer} onClose={toggleDrawer}>
                <Box sx={{ width: 250, padding: 2 }}>
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
                            {selectedColors.map((color: any) => (
                                <Chip
                                    key={color}
                                    label={`Màu Sắc: ${color.name}`}
                                    onDelete={() => toggleColor(color)}
                                    sx={{ margin: '4px' }}
                                />
                            ))}

                            {/* Lọc Kích Thước */}
                            {selectedSizes.map((size: any) => (
                                <Chip
                                    key={size}
                                    label={`Kích Thước: ${size.name}`}
                                    onDelete={() => toggleSize(size)}
                                    sx={{ margin: '4px' }}
                                />
                            ))}
                        </Box>
                    )}

                    {filterSize}
                    <Divider sx={{ mt: 2 }}></Divider>

                    {filterColor}
                </Box>
            </Drawer>
        </Container>
        <Footer></Footer>
        </>
    );
};

export default ProductCollection;
