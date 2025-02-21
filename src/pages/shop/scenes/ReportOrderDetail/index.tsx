import React, { ChangeEvent, useEffect, useState } from 'react';
import {
    Grid,
    Container,
    Card,
    Typography,
} from '@mui/material';

import PageTitleWrapper from '../../../../components/admin-shop/page-title-wrapper/PageTitleWrapper';
import Footer from '../../../../components/admin-shop/footer/Footer';
import { useSelector, useStore } from 'react-redux';
import { change_is_loading } from '../../../../reducers/Actions';
import { GetApi, PostApi } from '../../../../untils/Api';
import { ReducerProps } from '../../../../reducers/ReducersProps';
import { useTranslation } from 'react-i18next';
import ReportOrderDetailTable from './ReportOrderDetailTable';

function ReportOrderManagement() {
    const { t } = useTranslation();
    const user = useSelector((state: ReducerProps) => state.user);
    const [reportOrders, setReportOrders] = useState<any>([]);
    const store = useStore();
    //
    const [open, setOpen] = useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    //
    const getDataReportOrder = async () => {
        if (user) {
            store.dispatch(change_is_loading(true));
            const res = await GetApi(`/shop/get/report-order`, localStorage.getItem('token'));

            if (res.data.message === 'Success') {
                setReportOrders(res.data.reportOrders);
            }
            store.dispatch(change_is_loading(false));
        }
    };
    useEffect(() => {
        getDataReportOrder();
    }, []);
    return (
        <>
            <PageTitleWrapper>
                <Grid container justifyContent="space-between" alignItems="center">
                    <Grid item>
                        <Typography sx={{ textTransform: 'capitalize' }} variant="h3" component="h3" gutterBottom>
                            {t('reportOrder.ReportOrderManagement')}
                        </Typography>
                    </Grid>
                </Grid>
            </PageTitleWrapper>
            <Container maxWidth="lg">
                <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
                    <Grid item xs={12}>
                        <Card>
                            <ReportOrderDetailTable initialReports={reportOrders} />
                        </Card>
                    </Grid>
                </Grid>
            </Container>
            <Footer />
        </>
    );
}

export default ReportOrderManagement;
