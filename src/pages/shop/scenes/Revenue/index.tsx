import React, { ChangeEvent, useEffect, useState } from 'react';
import { Grid, Container, Card, Typography } from '@mui/material';

import PageTitleWrapper from '../../../../components/admin-shop/page-title-wrapper/PageTitleWrapper';
import Footer from '../../../../components/admin-shop/footer/Footer';
import { useSelector, useStore } from 'react-redux';
import { change_is_loading } from '../../../../reducers/Actions';
import { GetApi, PostApi } from '../../../../untils/Api';
import { ReducerProps } from '../../../../reducers/ReducersProps';
import { useTranslation } from 'react-i18next';
import OrderRevenueTable from './OrderRevenueTable';
import InfoCard from './InfoCard';

function OrderRevenueManagement() {
    const { t } = useTranslation();
    const user = useSelector((state: ReducerProps) => state.user);
    const [orderRevenue, setOrderRevenue] = useState<any[]>([]);
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    const [month, setMonth] = useState(currentMonth);
    const [year, setYear] = useState(currentYear);
    const store = useStore();
    //
    const getDataOrderRevenue = async () => {
        store.dispatch(change_is_loading(true));
        const res = await GetApi(`/shop/get/order-revenue/${month}/${year}`, localStorage.getItem('token'));
        if (res.data.message === 'Success') {
            setOrderRevenue(res.data.orderRevenue);
        }
        store.dispatch(change_is_loading(false));
    };
    useEffect(() => {
        if (user) getDataOrderRevenue();
    }, [user]);
    return (
        <>
            <PageTitleWrapper>
                <Grid container justifyContent="space-between" alignItems="center">
                    <Grid item>
                        <Typography sx={{ textTransform: 'capitalize' }} variant="h3" component="h3" gutterBottom>
                            {t('orderRevenue.OrderRevenueManagement')}
                        </Typography>
                    </Grid>
                </Grid>
            </PageTitleWrapper>
            <OrderRevenueTable initialOrderRevenue={orderRevenue} />
            <Footer />
        </>
    );
}

export default OrderRevenueManagement;
