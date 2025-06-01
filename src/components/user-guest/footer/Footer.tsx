import { Box, Typography } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface FooterProps {}
const Footer: React.FC<FooterProps> = (props) => {
    const { t } = useTranslation();
    return (
        <>
            <Box
                sx={{
                    backgroundColor: 'black',
                    mt: 3,
                    p: 3,
                    pt: { xs: 0, md: 3 },
                    textAlign: 'center', // Căn chỉnh sang bên phải
                }}
            >
                <Typography
                    sx={{
                        pt: { xs: 2, md: 0 },
                        color: 'white',
                    }}
                    variant="subtitle1"
                >
                    Copyright 2023 | DH SNEAKER
                </Typography>
            </Box>
        </>
    );
};
export default Footer;
