import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ProductTop from '../../components/user-guest/product/ProductTop';
import Banner from '../../components/user-guest/Banner';
import MultiCaroselProductJV from '../../components/user-guest/product/MultiCaroselProductJV';
import Footer from '../../components/user-guest/footer/Footer';
import ProductNew from '../../components/user-guest/product/ProductNew';
import { GetGuestApi, PostGuestApi } from '../../untils/Api';
import { Button, Chip, Container, Divider, Grid, useMediaQuery } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { Height } from '@mui/icons-material';
import BannerShop from '../../components/user-guest/BannerShop';
import { HOST_BE } from '../../common/Common';
import MultiCaroselCategory from '../../components/user-guest/category/MultiCaroselCategory';
import DrawMore from '../../components/user-guest/category/DrawMore';
import ListProduct from '../../components/user-guest/product/ListProduct';
import HotStyle from '../../components/user-guest/home/HotStyle';

const StyledButton = styled(Button)(({ theme }) => ({
    width: '100%',
    borderRadius: '5px',
    color: 'rgba(7, 110, 145, 0.89)',
    borderColor: 'rgba(7, 110, 145, 0.89)',
    '&:hover': {
        backgroundColor: 'rgba(7, 110, 145, 0.89)', // Màu nền khi hover
        color: '#ffffff', // Đổi màu chữ khi hover
    },
}));

interface HomePageProps {}
interface optionsFilterProps {
    sort: any;
    materialId: any;
    brandId: any;
    styleId: any;
    originId: any;
}
const HomePage: React.FC<HomePageProps> = (props) => {
    const theme = useTheme();
    const isMediumScreen = useMediaQuery('(max-width:1025px)');    
    const { t } = useTranslation();
    const [category, setCategory] = useState<any>(undefined);
    const [isGetStart, setIsGetStart] = useState<boolean>(false);
    const [categorys, setCategorys] = useState<any>([]);
    const [listCategoryChild, setListCategoryChild] = useState<any>(undefined);
    const [listCategoryChildWomen, setListCategoryChildWomen] = useState<any>(undefined);
    const [req, setReq] = useState<boolean>(true);
    const [categoryIdCurrent, setCategoryIdCurrent] = useState<any>('66eacadad7db49389c698067');
    const [listProductCurrent, setListProductCurrent] = useState<any>(undefined);
    const [optionsFilter, setOptionsFilter] = useState<optionsFilterProps>({
        sort: null,
        materialId: null,
        brandId: null,
        styleId: null,
        originId: null,
    });
    const getDataCategory = async () => {
        const res = await GetGuestApi('/api/get-categories');
        if (res.data.message == 'Success') {
            setCategory(res.data.categories.slice(0, 8));
        }
    };
    const getDataCategoryFull = async () => {
        const resCategorys = await GetGuestApi('/api/get-category');
        if (resCategorys.data.message == 'Success') {
            setCategorys(resCategorys.data.categories);
        }
    };
    const handleReq = () => {
        setReq(true);
    };
    const getDataCategoryChild = async () => {
        const categoryChilds = await PostGuestApi(`/api/category-many`, {
            // listCategoryId: resCategory.data.category.categoryIdClIST,
            categoryPId: '66eac5c7f7adcbed07e215bd',
        });
        if (categoryChilds.data.message == 'Success') {
            const categoryMap: any = {};
            categoryChilds.data.categories.forEach((category: any) => {
                categoryMap[category.id] = category;
            });

            // Bước 2: Tạo mảng kết quả
            const result: any = [];
            categoryChilds.data.categories.forEach((category: any) => {
                if (category.categoryIdClIST.length > 0) {
                    result.push({
                        parent: category,
                        children: category.categoryIdClIST.map((childId: any) => categoryMap[childId]),
                    });
                }
            });

            setListCategoryChild(result);
        }
        //
        const categoryChildsWomen = await PostGuestApi(`/api/category-many`, {
            // listCategoryId: resCategory.data.category.categoryIdClIST,
            categoryPId: '66eac608a9606d68cd102d21',
        });
        if (categoryChildsWomen.data.message == 'Success') {
            const categoryMap: any = {};
            categoryChildsWomen.data.categories.forEach((category: any) => {
                categoryMap[category.id] = category;
            });

            // Bước 2: Tạo mảng kết quả
            const result: any = [];
            categoryChildsWomen.data.categories.forEach((category: any) => {
                if (category.categoryIdClIST.length > 0) {
                    result.push({
                        parent: category,
                        children: category.categoryIdClIST.map((childId: any) => categoryMap[childId]),
                    });
                }
            });

            setListCategoryChildWomen(result);
        }
    };
    const getProductByCategory = async () => {
        const resProducts = await PostGuestApi(`/api/get-product-by-category/${categoryIdCurrent}/24/1`, {
            options: optionsFilter,
        });
        if (resProducts.data.message == 'Success') {
            setListProductCurrent(resProducts.data.products);
        }
        setReq(false);
    };
    useEffect(() => {
        // getDataCategory();
        // getDataCategoryFull();
        // getDataCategoryChild();
    }, []);
    // useEffect(() => {
    //     if (req) {
    //         getProductByCategory();
    //     }
    // }, [req]);
    return (
        <>
            <div style={{ width: '100%', marginTop: isMediumScreen ? '0px' : '110px' }}>
                <div className="rounded-lg">
                    <img
                        className="rounded-lg"
                        style={{ objectFit: 'cover', height: 600, width: '100%' }}
                        src={require('../../static/dhsneaker-banner.png')}
                    />
                </div>
            </div>
            <Container>
                <Grid container spacing={2} justifyContent="center" style={{ padding: '39px 5px' }}>
                    <Grid item xs={6} sm={2} textAlign="center">
                        <StyledButton variant="outlined" href="/collections/nu">
                            MLB
                        </StyledButton>
                    </Grid>
                    <Grid item xs={6} sm={2} textAlign="center">
                        <StyledButton variant="outlined" href="/collections/nam">
                            CROCS
                        </StyledButton>
                    </Grid>
                    <Grid item xs={6} sm={2} textAlign="center">
                        <StyledButton variant="outlined" href="/collections/tre-em">
                            ADIDAS
                        </StyledButton>
                    </Grid>
                    <Grid item xs={6} sm={2} textAlign="center">
                        <StyledButton variant="outlined" href="/collections/phu-kien-jibbitz">
                            TRẺ EM
                        </StyledButton>
                    </Grid>
                    <Grid item xs={6} sm={2} textAlign="center">
                        <StyledButton variant="outlined" href="/collections/phu-kien-jibbitz">
                            JIBBITZ
                        </StyledButton>
                    </Grid>
                    <Grid item xs={6} sm={2} textAlign="center">
                        <StyledButton variant="outlined" href="/collections/phu-kien-jibbitz">
                            SẢN PHẨM KHÁC
                        </StyledButton>
                    </Grid>
                </Grid>
            </Container>
            <Container>
                <HotStyle></HotStyle>
            </Container>
            {/* <div style={{ marginTop: 100 }} className="">
                {!isGetStart ? (
                    <div className="container" style={{ width: '100%', overflow: 'hidden' }}>
                        <div className="rounded-lg">
                            <img
                                className="rounded-lg"
                                style={{ objectFit: 'cover', height: 550, width: '100%' }}
                                src={require('../../static/dhsneaker-banner.png')}
                            />
                        </div>
                        {/* <div className="col-span-2 mt-3">
                            <BannerShop />
                        </div>
                        <div className="mt-12 select-none">
                            <Divider>
                                <Chip label={t('homepage.Category')} size="small" />
                            </Divider>
                        </div>
                        {categorys.length > 0 ? (
                            <div className="mt-12">
                                <MultiCaroselCategory listCategory={categorys} />
                            </div>
                        ) : null}
                        <div className="mt-12 grid grid-cols-5">
                            <div className="col-span-1 p-1 box-shadow rounded-xl mt-1 hidden lg:block">
                                {listCategoryChild ? (
                                    <div>
                                        <div className="font-bold p-3">{t('homepage.Men Fashion')}</div>
                                        <DrawMore
                                            setCategoryIdCurrent={setCategoryIdCurrent}
                                            listCategoryChild={listCategoryChild}
                                            handleReq={handleReq}
                                            categoryPId={categoryIdCurrent}
                                            setPageCurrent={() => {}}
                                        />
                                    </div>
                                ) : null}
                                {listCategoryChildWomen ? (
                                    <div>
                                        <div className="font-bold p-3">{t('homepage.Women Fashion')}</div>
                                        <DrawMore
                                            setCategoryIdCurrent={setCategoryIdCurrent}
                                            listCategoryChild={listCategoryChildWomen}
                                            handleReq={handleReq}
                                            categoryPId={categoryIdCurrent}
                                            setPageCurrent={() => {}}
                                        />
                                    </div>
                                ) : null}
                            </div>
                            <div className="col-span-5 lg:col-span-4">
                                {listProductCurrent ? <ListProduct listProduct={listProductCurrent} /> : null}
                            </div>
                        </div> */}
            {/* --------------- */}

            {/* <div className="mt-6">
                            <div className=" border-b border-gray-300 flex mt-6">
                                <div
                                    style={{
                                        borderBottomWidth: 3,
                                    }}
                                    className="font-bold text-2xl border-b border-solid  border-blue-500"
                                >
                                    {t('product.ProductTop')}
                                </div>
                            </div>
                            <ProductTop />
                        </div>
                        <div id="product-new-id" className="mt-12">
                            <div className=" border-b border-gray-300 flex mt-6">
                                <div
                                    style={{
                                        borderBottomWidth: 3,
                                    }}
                                    className="font-bold text-2xl border-b border-solid  border-blue-500"
                                >
                                    {t('homepage.New Product')}
                                </div>
                            </div>
                            <ProductNew />
                        </div>
                        <MultiCaroselProductJV />
                    </div>
                ) : (
                    <div></div>
                )}
            </div> */}
            <Footer />
        </>
    );
};
export default HomePage;
