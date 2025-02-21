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
import CreateProductDialog from './CreateDialog';

function ShopProductManagement() {
    const { t } = useTranslation();
    const user = useSelector((state: ReducerProps) => state.user);
    const [categories, setCategories] = useState<any>([]);
    const [materials, setMaterials] = useState<any>([]);
    const [styles, setStyles] = useState<any>([]);
    const [origins, setOrigins] = useState<any>([]);
    const [brands, setBrands] = useState<any>([]);
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
        if (user.shopId) {
            store.dispatch(change_is_loading(true));
            const resProducts = await GetApi(`/shop/get/product-by-shop/${user.shopId}`, localStorage.getItem('token'));
            if (resProducts.data.message == 'Success') {
                setProducts(resProducts.data.products);
            }
            store.dispatch(change_is_loading(false));
        }
    };
    const getDataCategory = async () => {
        store.dispatch(change_is_loading(true));
        const resCategories = await GetApi('/api/get-category', null);
        const resMaterials = await GetApi('/api/all-material', null);
        const resStyles = await GetApi('/api/all-style', null);
        const resOrigins = await GetApi('/api/all-origin', null);
        const resBrands = await GetApi('/api/all-brand', null);
        if (resCategories.data.message == 'Success') {
            setCategories(resCategories.data.categories);
        }
        if (resMaterials.data.message == 'Success') {
            setMaterials(resMaterials.data.materials);
        }
        if (resStyles.data.message == 'Success') {
            setStyles(resStyles.data.styles);
        }
        if (resOrigins.data.message == 'Success') {
            setOrigins(resOrigins.data.origins);
        }
        if (resBrands.data.message == 'Success') {
            setBrands(resBrands.data.brands);
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
                        <Typography sx={{ textTransform: 'capitalize' }} variant="h3" component="h3" gutterBottom>
                            {t('product.ShopManagement.ProductManagement')}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Button
                            sx={{ mt: { xs: 2, md: 0 } }}
                            variant="contained"
                            startIcon={<AddTwoToneIcon fontSize="small" />}
                            onClick={handleClickOpen}
                        >
                            {t('product.ShopManagement.CreateProduct')}
                        </Button>
                        <CreateProductDialog
                            open={open}
                            onClose={handleClose}
                            categories={categories}
                            styles={styles}
                            origins={origins}
                            brands={brands}
                            materials={materials}
                            onUpdate={getDataProduct}
                        />
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
                                materials={materials}
                                styles={styles}
                                origins={origins}
                                brands={brands}
                            />
                        </Card>
                    </Grid>
                </Grid>
            </Container>
            <Footer />
        </>
    );
}

export default ShopProductManagement;
