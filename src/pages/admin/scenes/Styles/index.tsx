import React, { ChangeEvent, useEffect, useState } from 'react';
import { Grid, Container, Card, Typography, Button } from '@mui/material';
import PageTitleWrapper from '../../../../components/admin-shop/page-title-wrapper/PageTitleWrapper';
import Footer from '../../../../components/admin-shop/footer/Footer';
import { useSelector, useStore } from 'react-redux';
import { change_is_loading } from '../../../../reducers/Actions';
import { GetApi, GetGuestApi, PostApi } from '../../../../untils/Api';
import OriginTable from './StylesTable';
import UploadTwoToneIcon from '@mui/icons-material/UploadTwoTone';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import { ReducerProps } from '../../../../reducers/ReducersProps';
import { HOST_BE } from '../../../../common/Common';
import axios from 'axios';
import { toastSuccess, toastWarning } from '../../../../untils/Logic';
import { useTranslation } from 'react-i18next';
import StylesTable from './StylesTable';
import CreateStyles from './CreateDialog';

function StylesManagement() {
    const { t } = useTranslation();
    const user = useSelector((state: ReducerProps) => state.user);
    const [styles, setStyles] = useState<any>([]);
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
        const res = await GetApi('/admin/get/styles', localStorage.getItem('token'));

        if (res.data.message == 'Success') {
            setStyles(res.data.styles);
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
                            {t('product.Styles')}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Button
                            sx={{ mt: { xs: 2, md: 0 } }}
                            variant="contained"
                            startIcon={<AddTwoToneIcon fontSize="small" />}
                            onClick={handleClickOpen}
                        >
                            {t('category.Admin.CreateStyles')}
                        </Button>
                        <CreateStyles
                            open={open}
                            onClose={handleClose}
                            categories={styles}
                            onUpdate={getDataCategory}
                        />
                    </Grid>
                </Grid>
            </PageTitleWrapper>
            <Container maxWidth="lg">
                <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
                    <Grid item xs={12}>
                        <Card>
                            <StylesTable initialOrigins={styles} />
                        </Card>
                    </Grid>
                </Grid>
            </Container>
            <Footer />
        </>
    );
}

export default StylesManagement;
