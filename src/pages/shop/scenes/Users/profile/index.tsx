import React, { useEffect, useState } from 'react';

import { Grid, Container } from '@mui/material';

import ProfileCover from './ProfileCover';
import RecentActivity from './RecentActivity';
import Footer from '../../../../../components/admin-shop/footer/Footer';
import { useSelector, useStore } from 'react-redux';
import { ReducerProps } from '../../../../../reducers/ReducersProps';
import { change_is_loading } from '../../../../../reducers/Actions';
import { GetApi } from '../../../../../untils/Api';

function ManagementShopProfile() {
    const user = useSelector((state: ReducerProps) => state.user);
    const store = useStore();
    const [infoShop, setInfoShop] = useState();
    const getDataInfoShop = async () => {
        if (user) {
            store.dispatch(change_is_loading(true));
            const res = await GetApi(`/shop/get/info-shop`, localStorage.getItem('token'));
            if (res.data.message === 'Success') {
              setInfoShop(res.data.infoShop);
                console.log(res);
            }
            store.dispatch(change_is_loading(false));
        }
    };
    useEffect(() => {
        getDataInfoShop();
    }, [user]);
    return (
        <>
            <Container sx={{ mt: 3 }} maxWidth="lg">
                <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
                    <Grid item xs={12} md={8}>
                        <ProfileCover user={user} shop ={infoShop} onUpdate={getDataInfoShop}/>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <RecentActivity shop={infoShop}/>
                    </Grid>
                </Grid>
            </Container>
            <Footer />
        </>
    );
}

export default ManagementShopProfile;
