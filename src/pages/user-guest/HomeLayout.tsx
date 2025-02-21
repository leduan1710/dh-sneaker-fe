import React from 'react';

import { Outlet } from 'react-router-dom';
import Header from '../../components/user-guest/header/Header';

const HomeLayout: React.FC = () => {
    return (
        <div>
            <Header />
            <main>
                <Outlet />
            </main>
        </div>
    );
};

export default HomeLayout;