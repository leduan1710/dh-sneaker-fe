import { Box, Container, Link, Typography, styled } from '@mui/material';
import React from 'react';

const FooterWrapper = styled(Container)(
  ({ theme }) => `
        margin-top: ${theme.spacing(4)};
`
);

function Footer() {
  return (
    <FooterWrapper className="footer-wrapper">
      <Box
        pb={4}
        display={{ xs: 'block', md: 'flex' }}
        alignItems="center"
        textAlign={{ xs: 'center', md: 'left' }}
        justifyContent="space-between"
      >
        <Box>
        </Box>
        <Typography
          sx={{
            pt: { xs: 2, md: 0 }
          }}
          variant="subtitle1"
        >
          <Link
            target="_blank"
            rel="noopener noreferrer"
          >
            HCMUTE
          </Link>
        </Typography>
      </Box>
    </FooterWrapper>
  );
}

export default Footer;
