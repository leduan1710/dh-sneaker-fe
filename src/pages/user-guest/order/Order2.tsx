import React, { ChangeEvent, useEffect, useState } from 'react';
import { Grid, Container, Card, Typography, Button } from '@mui/material';
import { useSelector, useStore } from 'react-redux';
import { ReducerProps } from '../../../reducers/ReducersProps';
import PageTitleWrapper from '../../../components/admin-shop/page-title-wrapper/PageTitleWrapper';
import OrderTable from './OrderTable';

function Order() {
    return (
        <>
            <Container sx={{ mt: { md: '160px', xs: '170px' }, mb: 4, px: { md: 16, xs: 2 } }} maxWidth="xl">
                <PageTitleWrapper>
                    <Grid container justifyContent="space-between" alignItems="center">
                        <Grid item>
                            <Typography sx={{ textTransform: 'capitalize' }} variant="h4" fontSize={28} component="h3" gutterBottom>
                                Hoa hồng và quản lý đơn hàng
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
            </Container>
        </>
    );
}

export default Order;
