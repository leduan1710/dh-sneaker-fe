import React, { ChangeEvent, useEffect, useState } from 'react';
import { Grid, Container, Card, Typography, Button } from '@mui/material';

import PageTitleWrapper from '../../../../components/admin-shop/page-title-wrapper/PageTitleWrapper';
import Footer from '../../../../components/admin-shop/footer/Footer';
import { useSelector, useStore } from 'react-redux';
import { change_is_loading } from '../../../../reducers/Actions';
import { GetApi, GetGuestApi, PostApi } from '../../../../untils/Api';
import UploadTwoToneIcon from '@mui/icons-material/UploadTwoTone';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import { ReducerProps } from '../../../../reducers/ReducersProps';
import { HOST_BE } from '../../../../common/Common';
import axios from 'axios';
import { toastSuccess, toastWarning } from '../../../../untils/Logic';
import { useTranslation } from 'react-i18next';
import UsersTable from './UsersTable';

function UserManagement() {
    const { t } = useTranslation();
    const user = useSelector((state: ReducerProps) => state.user);
    const [users, setUsers] = useState<any>([]);
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
    const getDataUsers = async () => {
        store.dispatch(change_is_loading(true));
        const res = await GetApi('/admin/get/users', localStorage.getItem('token'));

        if (res.data.message == 'Success') {
            setUsers(res.data.users);
        }
        store.dispatch(change_is_loading(false));
    };
    useEffect(() => {
        getDataUsers();
    }, []);
    return (
        <>
            <PageTitleWrapper>
                <Grid container justifyContent="space-between" alignItems="center">
                    <Grid item xs={12}>
                        <Card>
                            <UsersTable initialUsers={users} />
                        </Card>
                    </Grid>
                </Grid>
            </PageTitleWrapper>
            <Footer />
        </>
    );
}

export default UserManagement;
