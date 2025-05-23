import React, { useEffect, useState } from 'react';
import { Grid, Container, Card, Typography, Button } from '@mui/material';

import PageTitleWrapper from '../../../../components/admin-shop/page-title-wrapper/PageTitleWrapper';
import Footer from '../../../../components/admin-shop/footer/Footer';
import { useSelector, useStore } from 'react-redux';
import { change_is_loading } from '../../../../reducers/Actions';
import { GetApi, GetGuestApi, PostApi } from '../../../../untils/Api';
import CategoriesTable from './ProductsTable';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import { ReducerProps } from '../../../../reducers/ReducersProps';
import { HOST_BE } from '../../../../common/Common';
import axios from 'axios';
import { toastSuccess, toastWarning } from '../../../../untils/Logic';
import { useTranslation } from 'react-i18next';
import ProductsTable from './ProductsTable';

function ProductManagement() {
    const { t } = useTranslation();
    const user = useSelector((state: ReducerProps) => state.user);
    const [categories, setCategories] = useState<any>([]);
    const [sizes, setSize] = useState<any>([]);
    const [styles, setStyles] = useState<any>([]);
    const [colors, setColors] = useState<any>([]);
    const [types, setTypes] = useState<any>([]);
    const [products, setProducts] = useState<any>([]);
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
    const getDataProduct = async () => {
        store.dispatch(change_is_loading(true));
        const resProducts = await GetApi(`/admin/get/products`, localStorage.getItem('token'));
        if (resProducts.data.message == 'Success') {
            setProducts(resProducts.data.products);
        }
        store.dispatch(change_is_loading(false));
    };
    const getDataCategory = async () => {
        store.dispatch(change_is_loading(true));
        const resCategories = await GetApi('/api/categories', null);
        const resSizes = await GetApi('/api/all-size', null);
        const resStyles = await GetApi('/api/all-style', null);
        const resColors = await GetApi('/api/all-color', null);
        const resTypes = await GetApi('/api/all-type', null);
        if (resCategories.data.message == 'Success') {
            setCategories(resCategories.data.categories);
        }
        if (resSizes.data.message == 'Success') {
            setSize(resSizes.data.sizes);
        }
        if (resStyles.data.message == 'Success') {
            setStyles(resStyles.data.styles);
        }
        if (resColors.data.message == 'Success') {
            setColors(resColors.data.colors);
        }
        if (resTypes.data.message == 'Success') {
            setTypes(resTypes.data.types);
        }
        store.dispatch(change_is_loading(false));
    };
    useEffect(() => {
        if (user) getDataProduct();
    }, [user]);
    useEffect(() => {
        getDataCategory();
    }, []);
    return (
        <>
            <PageTitleWrapper>
                <Grid container justifyContent="space-between" alignItems="center">
                    <Grid item>
                        <Typography sx={{ textTransform: 'capitalize' }} variant="h4" component="h3" gutterBottom>
                            Quản lý sản phẩm
                        </Typography>
                    </Grid>
                </Grid>
            </PageTitleWrapper>
            <Container maxWidth="lg">
                <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
                    <Grid item xs={12}>
                        <Card>
                            <ProductsTable
                                initialProducts={products}
                                categories={categories}
                                sizes={sizes}
                                styles={styles}
                                colors={colors}
                                types={types}
                            />
                        </Card>
                    </Grid>
                </Grid>
            </Container>
            <Footer />
        </>
    );
}

export default ProductManagement;
