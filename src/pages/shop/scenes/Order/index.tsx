import React, { ChangeEvent, useEffect, useState } from 'react';
import { Grid, Container, Card, Typography, Button } from '@mui/material';

import PageTitleWrapper from '../../../../components/admin-shop/page-title-wrapper/PageTitleWrapper';
import Footer from '../../../../components/admin-shop/footer/Footer';
import { useSelector, useStore } from 'react-redux';
import { change_is_loading } from '../../../../reducers/Actions';
import { GetApi, GetGuestApi, PostApi } from '../../../../untils/Api';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import { ReducerProps } from '../../../../reducers/ReducersProps';
import { useTranslation } from 'react-i18next';
import OrderTable from './OrderTable';
import { OrderModel } from '../../../../models/order';

function OrderManagement() {
    const store = useStore();
    const { t } = useTranslation();
    const user = useSelector((state: ReducerProps) => state.user);
    const [orders, setOrders] = useState<OrderModel[]>();

    const getDataOrder = async () => {
        if (user.shopId) {
            store.dispatch(change_is_loading(true));
            const resOrders = await GetApi(`/shop/get/order-by-shop/${user.shopId}`, localStorage.getItem('token'));
            if (resOrders.data.message == 'Success') {
                setOrders(resOrders.data.orders);
                console.log(resOrders.data.orders);
            }
            store.dispatch(change_is_loading(false));
        }
    };
    const getDataOrderDetail = async () => {
        if (user.shopId) {
            store.dispatch(change_is_loading(true));

            if (orders) {
                const resOrders = await PostApi(`/shop/post/orderDetail-by-order`, localStorage.getItem('token'), {
                    orderDetailIdList: orders[0].orderDetailIdList,
                });
                if (resOrders.data.message == 'Success') {
                    console.log(resOrders.data.orderDetails);
                }
            }
            store.dispatch(change_is_loading(false));
        }
    };

    return (
        <>
            <PageTitleWrapper>
                <Grid container justifyContent="space-between" alignItems="center">
                    <Grid item>
                        <Typography sx={{ textTransform: 'capitalize' }} variant="h3" component="h3" gutterBottom>
                            Quản lý đơn hàng
                            {/* {t('category.Admin.OrderManagement')} */}
                        </Typography>
                    </Grid>
                </Grid>
            </PageTitleWrapper>
            <Container maxWidth="lg">
                <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
                    <Grid item xs={12}>
                        <Card>
                            <OrderTable />
                        </Card>
                    </Grid>
                </Grid>
            </Container>
            <Footer />
        </>
    );
}

export default OrderManagement;
