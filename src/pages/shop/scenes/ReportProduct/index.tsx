import React, { ChangeEvent, useEffect, useState } from 'react';
import {
    Grid,
    Container,
    Card,
    Typography,
    Button,
} from '@mui/material';

import PageTitleWrapper from '../../../../components/admin-shop/page-title-wrapper/PageTitleWrapper';
import Footer from '../../../../components/admin-shop/footer/Footer';
import { useSelector, useStore } from 'react-redux';
import { change_is_loading } from '../../../../reducers/Actions';
import { GetApi, PostApi } from '../../../../untils/Api';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import { ReducerProps } from '../../../../reducers/ReducersProps';
import { useTranslation } from 'react-i18next';
import ReportProductTables from './ReportProductTables';

function ReportProductManagement() {
    const { t } = useTranslation();
    const user = useSelector((state: ReducerProps) => state.user);
    const [reports, setReports] = useState<any>([]);
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
    const getDataReport = async () => {
        if (user) {
            store.dispatch(change_is_loading(true));
            const resReports = await GetApi(`/shop/get/report-product`, localStorage.getItem('token'));
            if (resReports.data.message === 'Success') {
                setReports(resReports.data.reports);
                console.log(resReports)
            }
            store.dispatch(change_is_loading(false));
        }
    };
    useEffect(() => {
        getDataReport();
    }, []);
    return (
        <>
            <PageTitleWrapper>
                <Grid container justifyContent="space-between" alignItems="center">
                    <Grid item>
                        <Typography sx={{ textTransform: 'capitalize' }} variant="h3" component="h3" gutterBottom>
                            {t('reportProduct.ReportManagement')}
                        </Typography>
                    </Grid>
                </Grid>
            </PageTitleWrapper>
            <Container maxWidth="lg">
                <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
                    <Grid item xs={12}>
                        <Card>
                            <ReportProductTables initialReports={reports} />
                        </Card>
                    </Grid>
                </Grid>
            </Container>
            <Footer />
        </>
    );
}

export default ReportProductManagement;
