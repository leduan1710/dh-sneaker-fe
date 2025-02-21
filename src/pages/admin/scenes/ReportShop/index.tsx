import React, { ChangeEvent, useEffect, useState } from 'react';
import { Grid, Container, Card, Typography, Button } from '@mui/material';

import PageTitleWrapper from '../../../../components/admin-shop/page-title-wrapper/PageTitleWrapper';
import Footer from '../../../../components/admin-shop/footer/Footer';
import { useSelector, useStore } from 'react-redux';
import { change_is_loading } from '../../../../reducers/Actions';
import { GetApi, GetGuestApi, PostApi } from '../../../../untils/Api';
import { toastSuccess, toastWarning } from '../../../../untils/Logic';
import { useTranslation } from 'react-i18next';
import ReportShopTable from './ReportShopTable';
import { ReducerProps } from '../../../../reducers/ReducersProps';

function ReportShopManagement() {
    const { t } = useTranslation();
    const user = useSelector((state: ReducerProps) => state.user);
    const [requestWithdraw, setRequestWithdraw] = useState<any>([]);
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
    const getDataCategory = async () => {
        store.dispatch(change_is_loading(true));
        const res = await GetApi('/admin/get/report-shop', localStorage.getItem('token'));

        if (res.data.message == 'Success') {
            setRequestWithdraw(res.data.reportShop);
        }
        store.dispatch(change_is_loading(false));
    };
    useEffect(() => {
        getDataCategory();
    }, []);
    return (
        <>
            <PageTitleWrapper>
                <Grid container justifyContent="space-between" alignItems="center">
                    <Grid item>
                        <Typography sx={{ textTransform: 'capitalize' }} variant="h3" component="h3" gutterBottom>
                            {t('category.Admin.ReportShop')}
                        </Typography>
                        
                    </Grid>
                </Grid>
            </PageTitleWrapper>
            <Container maxWidth="lg">
                <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
                    <Grid item xs={12}>
                        <Card>
                            <ReportShopTable initialShops={requestWithdraw} />
                        </Card>
                    </Grid>
                </Grid>
            </Container>
            <Footer />
        </>
    );
}

export default ReportShopManagement;
