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

    const [dailyOrderCommission, setDailyOrderCommissionCommission] = useState<any>([]);
    const [dailyBannerCommission, setDailyBannerCommissionCommission] = useState<any>([]);

    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    const [month, setMonth] = useState(currentMonth);
    const [year, setYear] = useState(currentYear);

    const [revenue, setRevenue] = useState(0);
    const [commission, setCommission] = useState(0);
    const [bonus, setBonus] = useState(0);

    const [orderCounts, setOrderCounts] = useState({
        newOrderCount: 0,
        successOrderCount: 0,
        cancelOrderCount: 0,
        boomOrderCount: 0,
    });

    const [monthlyRevenue, setMonthlyRevenue] = useState<any[]>([]);

    const [dailyOrderCount, setDailyOrderCount] = useState<any>([]);

    const getDataOrderCount = async () => {
        const res = await GetApi(`/admin/get/order-count/${month}/${year}`, localStorage.getItem('token'));
        if (res.data.message === 'Success') {
            setOrderCounts({
                newOrderCount: res.data.orderCounts.PROCESSING,
                successOrderCount: res.data.orderCounts.SUCCESS,
                cancelOrderCount: res.data.orderCounts.CANCEL,
                boomOrderCount: res.data.orderCounts.BOOM,
            });
        }
    };
    const getDataRevenueCommissionAndBonus = async () => {
        const res = await GetApi(`/admin/get/revenue-commission/${month}/${year}`, localStorage.getItem('token'));
        if (res.data.message === 'Success') {
            setRevenue(res.data.data.revenue);
            setCommission(res.data.data.commission);
            setBonus(res.data.data.bonus);
        }
    };

    const getAnnualRevenue = async () => {
        const res = await GetApi(`/admin/get/annual-revenue/${year}`, localStorage.getItem('token'));
        if (res.data.message === 'Success') {
            setMonthlyRevenue(res.data.data);
        }
    };

    const handleChangeMonth = (event: SelectChangeEvent) => {
        setMonth(Number(event.target.value));
    };
    const handleYearChange = (event: SelectChangeEvent) => {
        setYear(Number(event.target.value));
    };

    useEffect(() => {
        handleGetData();
    }, [month, year]);
    const handleGetData = () => {
        if (user) {
            getDataOrderCount();
            getDataRevenueCommissionAndBonus();
            getAnnualRevenue();
        }
    };
    return (
        <>
            <PageTitleWrapper>
                <Grid container spacing={1}>
                    <Grid xs={12} sm={6} item>
                        <Typography variant="h4" component="h3" gutterBottom>
                            Tổng quan
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
                    {/* <Grid item xs={12}>
                        <InfoCard
                            totalUsers={totalUsers}
                            totalShops={totalShops}
                        />
                    </Grid> */}
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
                            orderCounts={orderCounts}
                            revenue={revenue}
                            commission={commission}
                            bonus={bonus}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <AdminChart
                            monthlyRevenue={monthlyRevenue}
                        />
                    </Grid>
                </Grid>
            </Container>
            <Footer />
        </>
    );
}

export default DashboardAdmin;
