import React, { ChangeEvent, useEffect, useState } from 'react';
import { Grid, Container, Card, Typography, Button } from '@mui/material';

import PageTitleWrapper from '../../../../components/admin-shop/page-title-wrapper/PageTitleWrapper';
import Footer from '../../../../components/admin-shop/footer/Footer';
import { useSelector, useStore } from 'react-redux';
import { change_is_loading } from '../../../../reducers/Actions';
import { GetApi, GetGuestApi, PostApi } from '../../../../untils/Api';
import { toastSuccess, toastWarning } from '../../../../untils/Logic';
import { useTranslation } from 'react-i18next';
import ReportShopTable from './ComplaintReportTable';
import { ReducerProps } from '../../../../reducers/ReducersProps';
import ComplaintReportTable from './ComplaintReportTable';

function ComplaintReport() {
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
        store.dispatch(change_is_loading(true));
        const res = await GetApi('/admin/get/report-order', localStorage.getItem('token'));

        if (res.data.message == 'Success') {
            setReportOrders(res.data.reportOrders);
        }
        store.dispatch(change_is_loading(false));
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
                            {t('reportOrder.ComplaintReportOrder')}
                        </Typography>
                        
                    </Grid>
                </Grid>
            </PageTitleWrapper>
            <Container maxWidth="lg">
                <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
                    <Grid item xs={12}>
                        <Card>
                            <ComplaintReportTable initialShops={reportOrders} />
                        </Card>
                    </Grid>
                </Grid>
            </Container>
            <Footer />
        </>
    );
}

export default ComplaintReport;
