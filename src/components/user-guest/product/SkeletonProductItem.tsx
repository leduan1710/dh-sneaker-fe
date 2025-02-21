import * as React from 'react';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import { Box } from '@mui/material';

const SkeletonProductItem: React.FC<any> = (props) => {
    return (
        <div className="flex justify-center">
            <div>
                <Skeleton className="rounded" variant="rectangular" width={210} height={150} />
                <Skeleton className="mt-1 rounded" width={210} height={60} />
                <Skeleton className="mt-1 rounded" width={170} height={30} />
            </div>
        </div>
    );
};

export default SkeletonProductItem;
