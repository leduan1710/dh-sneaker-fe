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
import RevenuePieChar from './RevenuePieChar';
import AdminChart from './AdminChart';
import InfoCardByMonth from './InfoCardByMonth';
import InfoCard from './InfoCard';

function DashboardAdmin() {
    const { t } = useTranslation();
    const store = useStore();
    const user = useSelector((state: ReducerProps) => state.user);
    const [age, setAge] = React.useState('');

    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    const [month, setMonth] = useState(currentMonth);
    const [year, setYear] = useState(currentYear);

    const [dailyOrderCommission, setDailyOrderCommissionCommission] = useState<any>([]);
    const [dailyBannerCommission, setDailyBannerCommissionCommission] = useState<any>([]);
    const [totalOrderCommission, setTotalOrderCommission] = useState<number>(0);
    const [totalBannerCommission, setTotalBannerCommission] = useState<number>(0);

    const [totalOrders, setTotalOrders] = useState<number>(0);
    const [dailyOrderCount, setDailyOrderCount] = useState<any>([]);

    const [totalUsers, setTotalUsers] = useState<number>(0);
    const [totalShops, setTotalShops] = useState<number>(0);
    const [totalNewShops, setTotalNewShops] = useState<number>(0);
    const [totalNewUsers, setTotalNewUsers] = useState<number>(0);

    const getDataBannerCommission = async () => {
        const res = await GetApi(`/admin/get/banner-commission/${month}/${year}`, localStorage.getItem('token'));
        if (res.data.message === 'Success') {
            setDailyBannerCommissionCommission(res.data.dailyBannerCommission);
            setTotalBannerCommission(res.data.totalBannerCommission);
        }
    };
    const getDataOrderCommission = async () => {
        const res = await GetApi(`/admin/get/order-commission/${month}/${year}`, localStorage.getItem('token'));
        if (res.data.message === 'Success') {
            setDailyOrderCommissionCommission(res.data.dailyOrderCommission);
            setTotalOrderCommission(res.data.totalOrderCommission);
        }
    };
    const getDataNewUserAndNewShop = async () => {
        const res = await GetApi(`/admin/get/new-shop-user/${month}/${year}`, localStorage.getItem('token'));
        if (res.data.message === 'Success') {
            setTotalNewShops(res.data.totalNewShops);
            setTotalNewUsers(res.data.totalNewUsers);
        }
    };
    const getDataTotalUserAndTotalShop = async () => {
        const res = await GetApi(`/admin/get/total-shop-user`, localStorage.getItem('token'));
        if (res.data.message === 'Success') {
            setTotalShops(res.data.totalShops);
            setTotalUsers(res.data.totalUsers);
        }
    };
    const getDataOrderCount = async () => {
        const res = await GetApi(`/admin/get/order-count/${month}/${year}`, localStorage.getItem('token'));
        if (res.data.message === 'Success') {
            setTotalOrders(res.data.totalOrders);
            setDailyOrderCount(res.data.dailyOrders);
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
            getDataBannerCommission();
            getDataOrderCommission();
            getDataNewUserAndNewShop();
            getDataTotalUserAndTotalShop();
            getDataOrderCount();
        }
    }, [user]);
    useEffect(() => {
        handleGetData();
    }, [month, year]);
    const handleGetData = () => {
        if (user) {
            getDataBannerCommission();
            getDataOrderCommission();
            getDataNewUserAndNewShop();
            getDataTotalUserAndTotalShop();
            getDataOrderCount();
        }
    };
    return (
        <>
            <PageTitleWrapper>
                <Grid container spacing={1}>
                    <Grid xs={12} sm={6} item>
                        <Typography variant="h3" component="h3" gutterBottom>
                            {t('adminDashboard.AdminOverview')}
                        </Typography>
                    </Grid>
                    <Grid xs={12} sm={3} item display="flex" justifyContent="center" alignItems="center">
                        <FormControl fullWidth>
                            <InputLabel id="select-month-label">{t('adminDashboard.Month')}</InputLabel>
                            <Select
                                labelId="select-month-label"
                                id="select-month"
                                label={t('adminDashboard.Month')}
                                value={month.toString()}
                                onChange={handleChangeMonth}
                            >
                                {Array.from({ length: 12 }, (_, index) => (
                                    <MenuItem key={index + 1} value={index + 1}>
                                        {t('adminDashboard.Month')} {index + 1}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid xs={12} sm={3} item display="flex" justifyContent="center" alignItems="center">
                        <FormControl fullWidth required>
                            <InputLabel id="select-year-label">{t('adminDashboard.Year')}</InputLabel>
                            <Select
                                labelId="select-year-label"
                                id="select-year"
                                label={t('adminDashboard.Year')}
                                value={year.toString()}
                                onChange={handleYearChange}
                            >
                                {Array.from({ length: 2 }, (_, index) => (
                                    <MenuItem key={currentYear - index} value={currentYear - index}>
                                        {t('adminDashboard.Year')} {currentYear - index}
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
                            totalUsers={totalUsers}
                            totalShops={totalShops}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between"
                            sx={{
                                pb: 1,
                            }}
                        >
                            <Typography variant="h3" fontSize={20}>
                                {t('adminDashboard.Month') + ' ' + month + '/' + year}
                            </Typography>
                        </Box>
                        <InfoCardByMonth
                            totalBannerCommission={totalBannerCommission}
                            totalNewShops={totalNewShops}
                            totalNewUsers={totalNewUsers}
                            totalOrderCommission={totalOrderCommission}
                            totalOrders={totalOrders}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        {/* <RevenuePieChar
                            totalRevenue={totalRevenue}
                            topSellProductData={topSellProduct}
                            totalRevenueUnPaid={totalRevenueUnpaid}
                        /> */}
                    </Grid>
                    <Grid item xs={12}>
                        <AdminChart
                            dailyBannerCommission={dailyBannerCommission}
                            dailyOrderCommission={dailyOrderCommission}
                            dailyOrderCount={dailyOrderCount}
                        />
                    </Grid>
                </Grid>
            </Container>
            <Footer />
        </>
    );
}

export default DashboardAdmin;
