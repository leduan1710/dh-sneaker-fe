import React, { ChangeEvent, useEffect, useState } from 'react';
import { Grid, Container, Card, Typography, Button } from '@mui/material';

import PageTitleWrapper from '../../../../components/admin-shop/page-title-wrapper/PageTitleWrapper';
import Footer from '../../../../components/admin-shop/footer/Footer';
import { useSelector, useStore } from 'react-redux';
import { change_is_loading } from '../../../../reducers/Actions';
import { GetApi, GetGuestApi, PostApi } from '../../../../untils/Api';
import RequestWithDrawTable from './RequestWithDrawTable';
import UploadTwoToneIcon from '@mui/icons-material/UploadTwoTone';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import { ReducerProps } from '../../../../reducers/ReducersProps';
import { HOST_BE } from '../../../../common/Common';
import axios from 'axios';
import { toastSuccess, toastWarning } from '../../../../untils/Logic';
import { useTranslation } from 'react-i18next';

function RequestWithdrawManagement() {
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
        const res = await GetApi('/admin/get/request-withdraw', localStorage.getItem('token'));

        if (res.data.message == 'Success') {
            setRequestWithdraw(res.data.requestWithdraw);
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
                            {t('category.Admin.RequestWithdraw')}
                        </Typography>
                        
                    </Grid>
                </Grid>
            </PageTitleWrapper>
            <Container maxWidth="lg">
                <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
                    <Grid item xs={12}>
                        <Card>
                            <RequestWithDrawTable initialShops={requestWithdraw} />
                        </Card>
                    </Grid>
                </Grid>
            </Container>
            <Footer />
        </>
    );
}

export default RequestWithdrawManagement;
