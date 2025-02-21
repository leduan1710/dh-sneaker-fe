import React, { useContext } from 'react';

import { ListSubheader, alpha, Box, List, styled, Button, ListItem } from '@mui/material';
import { NavLink as RouterLink } from 'react-router-dom';

import DesignServicesTwoToneIcon from '@mui/icons-material/DesignServicesTwoTone';
import BrightnessLowTwoToneIcon from '@mui/icons-material/BrightnessLowTwoTone';
import MmsTwoToneIcon from '@mui/icons-material/MmsTwoTone';
import TableChartTwoToneIcon from '@mui/icons-material/TableChartTwoTone';
import AccountCircleTwoToneIcon from '@mui/icons-material/AccountCircleTwoTone';
import DisplaySettingsTwoToneIcon from '@mui/icons-material/DisplaySettingsTwoTone';
import { SidebarContext } from '../../../../../contexts/SidebarContext';
import { useTranslation } from 'react-i18next';

const MenuWrapper = styled(Box)(
    ({ theme }) => `
  .MuiList-root {
    padding: ${theme.spacing(1)};

    & > .MuiList-root {
      padding: 0 ${theme.spacing(0)} ${theme.spacing(1)};
    }
  }

    .MuiListSubheader-root {
      text-transform: uppercase;
      font-weight: bold;
      font-size: ${theme.typography.pxToRem(12)};
      color: ${theme.colors.alpha.trueWhite[50]};
      padding: ${theme.spacing(0, 2.5)};
      line-height: 1.4;
    }
`,
);

const SubMenuWrapper = styled(Box)(
    ({ theme }) => `
    .MuiList-root {

      .MuiListItem-root {
        padding: 1px 0;

        .MuiBadge-root {
          position: absolute;
          right: ${theme.spacing(3.2)};

          .MuiBadge-standard {
            background: ${theme.colors.primary.main};
            font-size: ${theme.typography.pxToRem(10)};
            font-weight: bold;
            text-transform: uppercase;
            color: ${theme.palette.primary.contrastText};
          }
        }
    
        .MuiButton-root {
          display: flex;
          color: ${theme.colors.alpha.trueWhite[70]};
          background-color: transparent;
          width: 100%;
          justify-content: flex-start;
          padding: ${theme.spacing(1.2, 3)};

          .MuiButton-startIcon,
          .MuiButton-endIcon {
            transition: ${theme.transitions.create(['color'])};

            .MuiSvgIcon-root {
              font-size: inherit;
              transition: none;
            }
          }

          .MuiButton-startIcon {
            color: ${theme.colors.alpha.trueWhite[30]};
            font-size: ${theme.typography.pxToRem(20)};
            margin-right: ${theme.spacing(1)};
          }
          
          .MuiButton-endIcon {
            color: ${theme.colors.alpha.trueWhite[50]};
            margin-left: auto;
            opacity: .8;
            font-size: ${theme.typography.pxToRem(20)};
          }

          &.active,
          &:hover {
            background-color: ${alpha(theme.colors.alpha.trueWhite[100], 0.06)};
            color: ${theme.colors.alpha.trueWhite[100]};

            .MuiButton-startIcon,
            .MuiButton-endIcon {
              color: ${theme.colors.alpha.trueWhite[100]};
            }
          }
        }

        &.Mui-children {
          flex-direction: column;

          .MuiBadge-root {
            position: absolute;
            right: ${theme.spacing(7)};
          }
        }

        .MuiCollapse-root {
          width: 100%;

          .MuiList-root {
            padding: ${theme.spacing(1, 0)};
          }

          .MuiListItem-root {
            padding: 1px 0;

            .MuiButton-root {
              padding: ${theme.spacing(0.8, 3)};

              .MuiBadge-root {
                right: ${theme.spacing(3.2)};
              }

              &:before {
                content: ' ';
                background: ${theme.colors.alpha.trueWhite[100]};
                opacity: 0;
                transition: ${theme.transitions.create(['transform', 'opacity'])};
                width: 6px;
                height: 6px;
                transform: scale(0);
                transform-origin: center;
                border-radius: 20px;
                margin-right: ${theme.spacing(1.8)};
              }

              &.active,
              &:hover {

                &:before {
                  transform: scale(1);
                  opacity: 1;
                }
              }
            }
          }
        }
      }
    }
`,
);

function SidebarMenu() {
    const { closeSidebar } = useContext(SidebarContext);
    const { t } = useTranslation();
    return (
        <>
            <MenuWrapper>
                <List component="div">
                    <SubMenuWrapper>
                        <List component="div">
                            <ListItem component="div">
                                <Button
                                    disableRipple
                                    component={RouterLink}
                                    onClick={closeSidebar}
                                    to="/admin"
                                    startIcon={<DesignServicesTwoToneIcon />}
                                >
                                    Admin
                                </Button>
                            </ListItem>
                        </List>
                    </SubMenuWrapper>
                </List>
                <List
                    component="div"
                    subheader={
                        <ListSubheader component="div" disableSticky>
                            Dashboards
                        </ListSubheader>
                    }
                >
                    <SubMenuWrapper>
                        <List component="div">
                            <ListItem component="div">
                                <Button
                                    disableRipple
                                    component={RouterLink}
                                    onClick={closeSidebar}
                                    to="/admin/dashboard"
                                    startIcon={<BrightnessLowTwoToneIcon />}
                                >
                                    Dashboard
                                </Button>
                            </ListItem>
                        </List>
                    </SubMenuWrapper>
                </List>
                <List
                    component="div"
                    subheader={
                        <ListSubheader component="div" disableSticky>
                            {t('admin.Manage')}
                        </ListSubheader>
                    }
                >
                    <SubMenuWrapper>
                        <List component="div">
                            <ListItem component="div">
                                <Button
                                    disableRipple
                                    component={RouterLink}
                                    onClick={closeSidebar}
                                    to="/admin/management/categories"
                                    startIcon={<TableChartTwoToneIcon />}
                                >
                                    {t('admin.Category')}
                                </Button>
                            </ListItem>
                            <ListItem component="div">
                                <Button
                                    disableRipple
                                    component={RouterLink}
                                    onClick={closeSidebar}
                                    to="/admin/management/user"
                                    startIcon={<TableChartTwoToneIcon />}
                                >
                                    {t('admin.User')}
                                </Button>
                            </ListItem>
                            <ListItem component="div">
                                <Button
                                    disableRipple
                                    component={RouterLink}
                                    onClick={closeSidebar}
                                    to="/admin/management/shops"
                                    startIcon={<TableChartTwoToneIcon />}
                                >
                                    {t('admin.Shop')}
                                </Button>
                            </ListItem>
                            <ListItem component="div">
                                <Button
                                    disableRipple
                                    component={RouterLink}
                                    onClick={closeSidebar}
                                    to="/admin/management/request-withdraw"
                                    startIcon={<TableChartTwoToneIcon />}
                                >
                                    {t('admin.Withdraw')}
                                </Button>
                            </ListItem>
                            <ListItem component="div">
                                <Button
                                    disableRipple
                                    component={RouterLink}
                                    onClick={closeSidebar}
                                    to="/admin/management/shop"
                                    startIcon={<TableChartTwoToneIcon />}
                                >
                                    {t('admin.ReportShop')}
                                </Button>
                            </ListItem>
                            <ListItem component="div">
                                <Button
                                    disableRipple
                                    component={RouterLink}
                                    onClick={closeSidebar}
                                    to="/admin/management/report-order"
                                    startIcon={<TableChartTwoToneIcon />}
                                >
                                    {t('admin.ReportOrder')}
                                </Button>
                            </ListItem>
                            <ListItem component="div">
                                <Button
                                    disableRipple
                                    component={RouterLink}
                                    onClick={closeSidebar}
                                    to="/admin/management/report-product"
                                    startIcon={<TableChartTwoToneIcon />}
                                >
                                    {t('admin.ReportProduct')}
                                </Button>
                            </ListItem>
                            <ListItem component="div">
                                <Button
                                    disableRipple
                                    component={RouterLink}
                                    onClick={closeSidebar}
                                    to="/admin/management/origin"
                                    startIcon={<TableChartTwoToneIcon />}
                                >
                                    {t('product.Origin')}
                                </Button>
                            </ListItem>
                            <ListItem component="div">
                                <Button
                                    disableRipple
                                    component={RouterLink}
                                    onClick={closeSidebar}
                                    to="/admin/management/brand"
                                    startIcon={<TableChartTwoToneIcon />}
                                >
                                    {t('product.Brand')}
                                </Button>
                            </ListItem>
                            <ListItem component="div">
                                <Button
                                    disableRipple
                                    component={RouterLink}
                                    onClick={closeSidebar}
                                    to="/admin/management/styles"
                                    startIcon={<TableChartTwoToneIcon />}
                                >
                                    {t('product.Styles')}
                                </Button>
                            </ListItem>
                            <ListItem component="div">
                                <Button
                                    disableRipple
                                    component={RouterLink}
                                    onClick={closeSidebar}
                                    to="/admin/management/material"
                                    startIcon={<TableChartTwoToneIcon />}
                                >
                                    {t('product.Material')}
                                </Button>
                            </ListItem>
                        </List>
                    </SubMenuWrapper>
                </List>
            </MenuWrapper>
        </>
    );
}

export default SidebarMenu;
