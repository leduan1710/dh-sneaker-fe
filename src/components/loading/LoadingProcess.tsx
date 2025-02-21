import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { useSelector, useStore } from 'react-redux';
import { ReducerProps } from '../../reducers/ReducersProps';
import Backdrop from '@mui/material/Backdrop';

interface LoadingProcessProps {}

const LoadingProcess: React.FC<LoadingProcessProps> = (props) => {
    const store = useStore();
    const isLoading = useSelector((state: ReducerProps) => state.isLoading);
    return (
        <div>
            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={isLoading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </div>
    );
};
export default LoadingProcess;
