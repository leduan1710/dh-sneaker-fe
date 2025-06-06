import React, { FC, ReactNode } from 'react';
import PropTypes from 'prop-types';
import { Box, Container, styled } from '@mui/material';

const PageTitle = styled(Box)(
    ({ theme }) => `
        padding-top: ${theme.spacing(1.5)};
        padding-bottom: ${theme.spacing(1.5)};

`,
);

interface PageTitleWrapperProps {
    children?: ReactNode;
}

const PageTitleWrapper: FC<PageTitleWrapperProps> = ({ children }) => {
    return (
        <PageTitle className="MuiPageTitle-wrapper">
            <Container maxWidth="lg">{children}</Container>
        </PageTitle>
    );
};

PageTitleWrapper.propTypes = {
    children: PropTypes.node.isRequired,
};

export default PageTitleWrapper;
