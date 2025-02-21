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
import VoucherTables from './VouchersTable';
import CreateVoucherDialog from './CreateDialog';

function VoucherManagement() {
    const { t } = useTranslation();
    const user = useSelector((state: ReducerProps) => state.user);
    const [vouchers, setVouchers] = useState<any>([]);
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
    const getDataVoucher = async () => {
        if (user) {
            store.dispatch(change_is_loading(true));
            const resVouchers = await GetApi(`/shop/get/vouchers`, localStorage.getItem('token'));
            if (resVouchers.data.message === 'Success') {
                setVouchers(resVouchers.data.vouchers);
                console.log(resVouchers)
            }
            store.dispatch(change_is_loading(false));
        }
    };
    useEffect(() => {
        getDataVoucher();
    }, []);
    return (
        <>
            <PageTitleWrapper>
                <Grid container justifyContent="space-between" alignItems="center">
                    <Grid item>
                        <Typography sx={{ textTransform: 'capitalize' }} variant="h3" component="h3" gutterBottom>
                            {t('voucher.VoucherManagement')}
                        </Typography>
                        
                    </Grid>
                    <Grid item>
                        <Button
                            sx={{ mt: { xs: 2, md: 0 } }}
                            variant="contained"
                            startIcon={<AddTwoToneIcon fontSize="small" />}
                            onClick={handleClickOpen}
                        >
                            {t('voucher.CreateVoucher')}
                        </Button>
                        <CreateVoucherDialog open={open} onClose={handleClose} onUpdate={getDataVoucher} />
                    </Grid>
                </Grid>
            </PageTitleWrapper>
            <Container maxWidth="lg">
                <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
                    <Grid item xs={12}>
                        <Card>
                            <VoucherTables initialVouchers={vouchers} />
                        </Card>
                    </Grid>
                </Grid>
            </Container>
            <Footer />
        </>
    );
}

export default VoucherManagement;
