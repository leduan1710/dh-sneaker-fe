import React, { useContext } from 'react';

import { ListSubheader, alpha, Box, List, styled, Button, ListItem } from '@mui/material';
import { NavLink as RouterLink } from 'react-router-dom';

import DesignServicesTwoToneIcon from '@mui/icons-material/DesignServicesTwoTone';
import MmsTwoToneIcon from '@mui/icons-material/MmsTwoTone';
import TableChartTwoToneIcon from '@mui/icons-material/TableChartTwoTone';
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import StoreRoundedIcon from '@mui/icons-material/StoreRounded';
import StoreTwoToneIcon from '@mui/icons-material/StoreTwoTone';
import AssignmentTurnedInTwoToneIcon from '@mui/icons-material/AssignmentTurnedInTwoTone';
import LocalOfferTwoToneIcon from '@mui/icons-material/LocalOfferTwoTone';
import CardGiftcardTwoToneIcon from '@mui/icons-material/CardGiftcardTwoTone';
import BarChartTwoToneIcon from '@mui/icons-material/BarChartTwoTone';
import AssessmentTwoToneIcon from '@mui/icons-material/AssessmentTwoTone';
import PhotoLibraryTwoToneIcon from '@mui/icons-material/PhotoLibraryTwoTone';
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
                                    to="/shop"
                                    startIcon={<StoreRoundedIcon />}
                                >
                                    Shop
                                </Button>
                            </ListItem>
                        </List>
                    </SubMenuWrapper>
                </List>
                <List component="div" subheader={<ListSubheader component="div" disableSticky></ListSubheader>}>
                    <SubMenuWrapper>
                        <List component="div">
                            <ListItem component="div">
                                <Button
                                    disableRipple
                                    component={RouterLink}
                                    onClick={closeSidebar}
                                    to="/shop/dashboard"
                                    startIcon={<SpaceDashboardIcon />}
                                >
                                    Dashboard
                                </Button>
                            </ListItem>
                            <ListItem component="div">
                                <Button
                                    disableRipple
                                    component={RouterLink}
                                    onClick={closeSidebar}
                                    to="/shop/messenger"
                                    startIcon={<MmsTwoToneIcon />}
                                >
                                    Messenger
                                </Button>
                            </ListItem>
                        </List>
                    </SubMenuWrapper>
                </List>
                <List
                    component="div"
                    subheader={
                        <ListSubheader component="div" disableSticky>
                            {t('shopMenuSidebar.Management')}
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
                                    to="/shop/management/products"
                                    startIcon={<StoreTwoToneIcon />}
                                >
                                    {t('shopMenuSidebar.Product')}
                                </Button>
                            </ListItem>
                            <ListItem component="div">
                                <Button
                                    disableRipple
                                    component={RouterLink}
                                    onClick={closeSidebar}
                                    to="/shop/management/orders"
                                    startIcon={<AssignmentTurnedInTwoToneIcon />}
                                >
                                    {t('shopMenuSidebar.Order')}{' '}
                                </Button>
                            </ListItem>
                            <ListItem component="div">
                                <Button
                                    disableRipple
                                    component={RouterLink}
                                    onClick={closeSidebar}
                                    to="/shop/management/order-revenue"
                                    startIcon={<AssignmentTurnedInTwoToneIcon />}
                                >
                                    {t('shopMenuSidebar.OrderRevenue')}{' '}
                                </Button>
                            </ListItem>
                            <ListItem component="div">
                                <Button
                                    disableRipple
                                    component={RouterLink}
                                    onClick={closeSidebar}
                                    to="/shop/management/discounts"
                                    startIcon={<LocalOfferTwoToneIcon />}
                                >
                                    {t('shopMenuSidebar.Discount')}{' '}
                                </Button>
                            </ListItem>
                            <ListItem component="div">
                                <Button
                                    disableRipple
                                    component={RouterLink}
                                    onClick={closeSidebar}
                                    to="/shop/management/vouchers"
                                    startIcon={<CardGiftcardTwoToneIcon />}
                                >
                                    {t('shopMenuSidebar.Voucher')}{' '}
                                </Button>
                            </ListItem>
                            <ListItem component="div">
                                <Button
                                    disableRipple
                                    component={RouterLink}
                                    onClick={closeSidebar}
                                    to="/shop/management/report-product"
                                    startIcon={<BarChartTwoToneIcon />}
                                >
                                    {t('shopMenuSidebar.ReportProduct')}{' '}
                                </Button>
                            </ListItem>
                            <ListItem component="div">
                                <Button
                                    disableRipple
                                    component={RouterLink}
                                    onClick={closeSidebar}
                                    to="/shop/management/report-order"
                                    startIcon={<AssessmentTwoToneIcon />}
                                >
                                    {t('shopMenuSidebar.ReportOrder')}{' '}
                                </Button>
                            </ListItem>
                            <ListItem component="div">
                                <Button
                                    disableRipple
                                    component={RouterLink}
                                    onClick={closeSidebar}
                                    to="/shop/management/banners"
                                    startIcon={<PhotoLibraryTwoToneIcon  />}
                                >
                                    {t('shopMenuSidebar.Banner')}
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
