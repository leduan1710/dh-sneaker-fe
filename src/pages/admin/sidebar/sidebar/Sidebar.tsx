import React, { useContext } from 'react';
import {
  Box,
  Drawer,
  styled,
  Divider,
  useTheme,
  alpha,
  lighten,
} from '@mui/material';
import SidebarMenu from './sidebar-menu/SidebarMenu';
import { SidebarContext } from '../../../../contexts/SidebarContext';
import Logo from '../../../../components/admin-shop/logo-sign/LogoSign';

const SidebarWrapper = styled(Box)(
  ({ theme }) => `
    width: ${theme.sidebar.width};
    min-width: ${theme.sidebar.width};
    color: ${theme.colors.alpha.black[70]};
    position: relative;
    z-index: 7;
    height: 100%;
    padding-bottom: 68px;
`
);

const LogoContainer = styled(Box)(
  ({ theme }) => `
    position: fixed;
    width: ${theme.sidebar.width};
    background: ${theme.palette.mode === 'dark' ? '#ffffff' : '#ffffff'};
    z-index: 8;
`
);

const ScrollableContent = styled(Box)(
    ({ theme }) => `
    overflow-y: auto;
    height: calc(100vh - 40px);
    padding-top: ${theme.spacing(12)};
`
  );

function Sidebar() {
  const { sidebarToggle, toggleSidebar } = useContext(SidebarContext);
  const closeSidebar = () => toggleSidebar();
  const theme = useTheme();

  return (
    <>
      <SidebarWrapper
        sx={{
          display: {
            xs: 'none',
            lg: 'inline-block'
          },
          position: 'fixed',
          left: 0,
          top: 0,
          background: theme.palette.mode === 'dark' ? '#ffffff' : '#ffffff',
          boxShadow:
            theme.palette.mode === 'dark'
              ? `0 1px 0 ${alpha(
                  lighten(theme.colors.primary.main, 0.7),
                  0.15
                )}, 0px 2px 8px -3px rgba(0, 0, 0, 0.2), 0px 5px 22px -4px rgba(0, 0, 0, .1)`
              : `0px 2px 8px -3px ${alpha(
                  theme.colors.alpha.black[100],
                  0.2
                )}, 0px 5px 22px -4px ${alpha(
                  theme.colors.alpha.black[100],
                  0.1
                )}`
        }}
      >
        <LogoContainer>
          <Box mt={1}>
            <Box
              mx={1}
              sx={{
                width: 165
              }}
            >
              <Logo />
            </Box>
          </Box>
          <Divider
            sx={{
              mt: theme.spacing(1),
              mx: theme.spacing(2),
              background: theme.colors.alpha.black[30],
              height: '1px'
            }}
          />
        </LogoContainer>
        <ScrollableContent>
          <SidebarMenu />
        </ScrollableContent>
        <Divider
          sx={{
            background: theme.colors.alpha.black[30],
            height: '1px'
          }}
        />
        <Box p={2}>
        </Box>
      </SidebarWrapper>

      <Drawer
        sx={{
          boxShadow: theme.sidebar.boxShadow
        }}
        anchor={theme.direction === 'rtl' ? 'right' : 'left'}
        open={sidebarToggle}
        onClose={closeSidebar}
        variant="temporary"
        elevation={9}
      >
        <SidebarWrapper
          sx={{
            background: '#ffffff'
          }}
        >
          <LogoContainer>
            <Box mt={3}>
              <Box
                mx={2}
                sx={{
                  width: 20
                }}
              >
                <Logo />
              </Box>
            </Box>
            <Divider
              sx={{
                mt: theme.spacing(3),
                mx: theme.spacing(2),
              }}
            />
          </LogoContainer>
          <ScrollableContent>
            <SidebarMenu />
          </ScrollableContent>
        </SidebarWrapper>
      </Drawer>
    </>
  );
}

export default Sidebar;
