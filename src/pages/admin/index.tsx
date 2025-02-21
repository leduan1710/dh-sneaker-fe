import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ReducerProps } from '../../reducers/ReducersProps';
import { typeRole } from '../../common/Common';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

const IndexAdmin: React.FC<any> = () => {
    const user = useSelector((state: ReducerProps) => state.user);
    const nav = useNavigate();
    useEffect(() => {
        if (user.role) {
            if (user.role == typeRole.ADMIN) {
                setTimeout(() => {
                    nav('/admin');
                }, 500);
            }
        }
    }, [user]);
    return (
        <>
            <Box sx={{ width: '100%' }}>
                <LinearProgress />
            </Box>
        </>
    );
};

export default IndexAdmin;
