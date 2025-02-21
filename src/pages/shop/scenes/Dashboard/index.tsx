import React, { useEffect, useState } from 'react';
import {
    Box,
    Card,
    CardHeader,
    Container,
    Divider,
    FormControl,
    FormHelperText,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Typography,
} from '@mui/material';

import PageTitleWrapper from '../../../../components/admin-shop/page-title-wrapper/PageTitleWrapper';
import Footer from '../../../../components/admin-shop/footer/Footer';
import { useSelector, useStore } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ReducerProps } from '../../../../reducers/ReducersProps';
import { GetApi } from '../../../../untils/Api';
import InfoCard from './InfoCard';
import RevenuePieChar from './RevenuePieChar';
import ShopChart from './ShopChart';

function DashboardShop() {
    const { t } = useTranslation();
    const store = useStore();
    const user = useSelector((state: ReducerProps) => state.user);

    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    const [month, setMonth] = useState(currentMonth);
    const [year, setYear] = useState(currentYear);

    const [topSellProduct, setTopSellProduct] = useState<any>([]);
    const [dailyRevenue, setDailyRevenue] = useState<any>([]);
    const [dailyOrderCount, setDailyOrderCount] = useState<any>([]);

    const [totalRevenue, setTotalRevenue] = useState<number>(0);
    const [totalRevenueLastMonth, setTotalRevenueLastMonth] = useState<number>(0);
    const [totalRevenueDelivering, setTotalRevenueDelivering] = useState<number>(0);
    const [totalOrder, setTotalOrder] = useState<number>(0);
    const [totalOrderDelivering, setTotalOrderDelivering] = useState<number>(0);
    const [totalProductSold, setTotalProductSold] = useState<number>(0);

    const getTopSellProductByMonthYear = async () => {
        if (user) {
            const res = await GetApi(`/shop/get/top-sell-product/${month}/${year}`, localStorage.getItem('token'));
            if (res.data.message === 'Success') {
                setTopSellProduct(res.data.topSellProductData);
            }
        }
    };
    const getTotalRevenue = async () => {
        if (user) {
            const res = await GetApi(`/shop/get/total-revenue/${month}/${year}`, localStorage.getItem('token'));
            if (res.data.message === 'Success') {
                if (res.data.totalRevenue) setTotalRevenue(res.data.totalRevenue);
                else setTotalRevenue(0);
                setTotalRevenueDelivering(res.data.totalRevenueDelivering);
            }
        }
    };
    const getTotalRevenueLastMonth = async () => {
        if (user) {
            if (month == 1) {
                const res = await GetApi(`/shop/get/total-revenue/${12}/${year - 1}`, localStorage.getItem('token'));
                if (res.data.message === 'Success') {
                    if (res.data.totalRevenue) setTotalRevenueLastMonth(res.data.totalRevenue);
                    else setTotalRevenueLastMonth(0);
                }
            } else {
                const res = await GetApi(`/shop/get/total-revenue/${month - 1}/${year}`, localStorage.getItem('token'));
                if (res.data.message === 'Success') {
                    if (res.data.totalRevenue) setTotalRevenueLastMonth(res.data.totalRevenue);
                    else setTotalRevenueLastMonth(0);
                }
            }
        }
    };
    const getTotalOrderAndProductSold = async () => {
        if (user) {
            const res = await GetApi(
                `/shop/get/total-order-productsold/${month}/${year}`,
                localStorage.getItem('token'),
            );
            if (res.data.message === 'Success') {
                setTotalOrder(res.data.orderCount);
                setTotalOrderDelivering(res.data.deliveringOrderCount);
                setTotalProductSold(res.data.totalProductSold);
            }
        }
    };
    const getDailyDataChart = async () => {
        if (user) {
            const res = await GetApi(`/shop/get/daily-data-chart/${month}/${year}`, localStorage.getItem('token'));
            if (res.data.message === 'Success') {
                setDailyRevenue(res.data.dailyRevenue);
                setDailyOrderCount(res.data.dailyOrderCount);
            }
        }
    };

    const handleChangeMonth = (event: SelectChangeEvent) => {
        setMonth(Number(event.target.value));
    };
    const handleYearChange = (event: SelectChangeEvent) => {
        setYear(Number(event.target.value));
    };
    useEffect(() => {
        if (user) {
            getTopSellProductByMonthYear();
            getTotalRevenue();
            getTotalRevenueLastMonth();
            getTotalOrderAndProductSold();
            getDailyDataChart();
        }
    }, [user, month, year]);

    return (
        <>
            <PageTitleWrapper>
                <Grid container spacing={1}>
                    <Grid xs={12} sm={6} item>
                        <Typography variant="h3" component="h3" gutterBottom>
                            {t('shopDashboard.ShopOverview')}
                        </Typography>
                    </Grid>
                    <Grid xs={12} sm={3} item display="flex" justifyContent="center" alignItems="center">
                        <FormControl fullWidth>
                            <InputLabel id="select-month-label">{t('shopDashboard.Month')}</InputLabel>
                            <Select
                                labelId="select-month-label"
                                id="select-month"
                                label={t('shopDashboard.Month')}
                                value={month.toString()}
                                onChange={handleChangeMonth}
                            >
                                {Array.from({ length: 12 }, (_, index) => (
                                    <MenuItem key={index + 1} value={index + 1}>
                                        {t('shopDashboard.Month')} {index + 1}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid xs={12} sm={3} item display="flex" justifyContent="center" alignItems="center">
                        <FormControl fullWidth required>
                            <InputLabel id="select-year-label">{t('shopDashboard.Year')}</InputLabel>
                            <Select
                                labelId="select-year-label"
                                id="select-year"
                                label={t('shopDashboard.Year')}
                                value={year.toString()}
                                onChange={handleYearChange}
                            >
                                {Array.from({ length: 2 }, (_, index) => (
                                    <MenuItem key={currentYear - index} value={currentYear - index}>
                                        {t('shopDashboard.Year')} {currentYear - index}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </PageTitleWrapper>
            <Container maxWidth="lg">
                <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
                    <Grid item xs={12}>
                        <InfoCard
                            totalRevenue={totalRevenue}
                            totalOrderDelivering = {totalOrderDelivering}
                            totalOrder={totalOrder}
                            totalProductSold={totalProductSold}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <RevenuePieChar
                            totalRevenue={totalRevenue}
                            totalRevenueLastMonth={totalRevenueLastMonth}
                            topSellProductData={topSellProduct}
                            totalRevenueDelivering={totalRevenueDelivering}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <ShopChart dailyOrderCount={dailyOrderCount} dailyRevenue={dailyRevenue} />
                    </Grid>
                </Grid>
            </Container>
            <Footer />
        </>
    );
}

export default DashboardShop;
