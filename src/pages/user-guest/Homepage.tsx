import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ProductTop from '../../components/user-guest/product/ProductTop';
import Banner from '../../components/user-guest/Banner';
import MultiCaroselProductJV from '../../components/user-guest/product/MultiCaroselProductJV';
import Footer from '../../components/user-guest/footer/Footer';
import ProductNew from '../../components/user-guest/product/ProductNew';
import { GetGuestApi, PostGuestApi } from '../../untils/Api';
import { Button, Chip, Container, Divider, Grid, Typography, useMediaQuery } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { Height } from '@mui/icons-material';
import BannerShop from '../../components/user-guest/BannerShop';
import { HOST_BE } from '../../common/Common';
import MultiCaroselCategory from '../../components/user-guest/category/MultiCaroselCategory';
import DrawMore from '../../components/user-guest/category/DrawMore';
import ListProduct from '../../components/user-guest/product/ListProduct';
import HotStyle from '../../components/user-guest/home/HotStyle';
import NewProducts from '../../components/user-guest/home/NewProduct';
import Jibbitz from '../../components/user-guest/home/Jibbitz';

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
    const [banners, setBanners] = useState<any>(undefined);

    const getDataBanner = async () => {
        const res = await GetGuestApi('/api/banners');
        if (res.data.message == 'Success') {
            setBanners(res.data.banners);
        }
    };

    useEffect(() => {
        getDataBanner();
    }, []);
    const banner1 = banners?.find((b: any) => b.position === 1);
    return (
        <>
            <div style={{ width: '100%', marginTop: isMediumScreen ? '190px' : '150px' }}>
                <div className="rounded-lg">
                    <img
                        style={{ objectFit: 'cover', height: 'auto', width: '100%' }}
                        src={banner1 ? banner1.image.startsWith('uploads') ? `${HOST_BE}/${banner1.image}` : banner1.image : undefined}
                    />
                </div>
            </div>
            <Container>
                <Grid container spacing={2} justifyContent="center" style={{ padding: '39px 5px' }}>
                    <Grid item xs={6} sm={2} textAlign="center">
                        <StyledButton variant="outlined" href="/collections?category=MLB?">
                            MLB
                        </StyledButton>
                    </Grid>
                    <Grid item xs={6} sm={2} textAlign="center">
                        <StyledButton variant="outlined" href="/collections?category=Crocs">
                            CROCS
                        </StyledButton>
                    </Grid>
                    <Grid item xs={6} sm={2} textAlign="center">
                        <StyledButton variant="outlined" href="/collections?category=Adidas">
                            ADIDAS
                        </StyledButton>
                    </Grid>
                    <Grid item xs={6} sm={2} textAlign="center">
                        <StyledButton variant="outlined" href="/collections?category=Trẻ em">
                            TRẺ EM
                        </StyledButton>
                    </Grid>
                    <Grid item xs={6} sm={2} textAlign="center">
                        <StyledButton variant="outlined" href="/collections?category=Jibbitz">
                            JIBBITZ
                        </StyledButton>
                    </Grid>
                    <Grid item xs={6} sm={2} textAlign="center">
                        <StyledButton variant="outlined" href="/collections?category=Sản phẩm khác">
                            SẢN PHẨM KHÁC
                        </StyledButton>
                    </Grid>
                </Grid>
            </Container>
            <Container sx={{ pb: 5 }}>
                <HotStyle></HotStyle>
            </Container>
            <Container>
                <img
                    style={{ objectFit: 'cover', height: 'auto', width: '100%' }}
                    src="https://www.crocs.com.vn/cdn/shop/files/DRAGON_PC_VN_9f4c3945-a2ec-4448-8f90-477790e012db_1190x.webp?v=1740472835"
                />
            </Container>

            <NewProducts />
            <Container>
                <img
                    style={{ objectFit: 'cover', height: 'auto', width: '100%', marginTop: '5px' }}
                    src="https://www.crocs.com.vn/cdn/shop/files/FLORAL_PC_VN_e1db6f5b-44fb-4e1c-a2ba-06d3b914d3ad_1190x.webp?v=1737605505"
                />
            </Container>
            <Jibbitz></Jibbitz>
            <Footer />
        </>
    );
};
export default HomePage;
