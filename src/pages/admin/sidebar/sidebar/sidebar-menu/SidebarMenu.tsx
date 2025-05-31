import React, { useContext } from 'react';

import { ListSubheader, Box, List, styled, Button, ListItem } from '@mui/material';
import { NavLink as RouterLink } from 'react-router-dom';

import AccountCircleTwoToneIcon from '@mui/icons-material/AccountCircleTwoTone';
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import StoreTwoToneIcon from '@mui/icons-material/StoreTwoTone';
import AssignmentTurnedInTwoToneIcon from '@mui/icons-material/AssignmentTurnedInTwoTone';
import LocalOfferTwoToneIcon from '@mui/icons-material/LocalOfferTwoTone';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import BarChartTwoToneIcon from '@mui/icons-material/BarChartTwoTone';
import CategoryIcon from '@mui/icons-material/Category';
import { SidebarContext } from '../../../../../contexts/SidebarContext';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { ReducerProps } from '../../../../../reducers/ReducersProps';
import { Announcement } from '@mui/icons-material';

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
      color: ${theme.colors.alpha.black};
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
          color: ${theme.colors.alpha.black[50]};
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
            color: ${theme.colors.alpha.black[50]};
            font-size: ${theme.typography.pxToRem(20)};
            margin-right: ${theme.spacing(1)};
          }
          
          .MuiButton-endIcon {
            color: ${theme.colors.alpha.black[70]};
            margin-left: auto;
            opacity: .8;
            font-size: ${theme.typography.pxToRem(20)};
          }

          &.active,
          &:hover {
            background-color: rgb(237, 243, 255);
            color: rgba(1, 71, 210, 0.82);

            .MuiButton-startIcon,
            .MuiButton-endIcon {
              color: rgba(1, 71, 210, 0.82);
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
                background: ${theme.colors.alpha.black[100]};
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
    const user = useSelector((state: ReducerProps) => state.user);

    return (
        <>
            <MenuWrapper>
                {user.role === 'ADMIN' && (
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
                                        startIcon={<SpaceDashboardIcon />}
                                    >
                                        Dashboard
                                    </Button>
                                </ListItem>
                            </List>
                        </SubMenuWrapper>
                    </List>
                )}

                <List
                    component="div"
                    subheader={
                        <ListSubheader component="div" disableSticky>
                            Quản lý
                        </ListSubheader>
                    }
                >
                    <SubMenuWrapper>
                        <List component="div">
                            {user.role === 'ADMIN' && (
                                <>
                                    <ListItem component="div">
                                        <Button
                                            disableRipple
                                            component={RouterLink}
                                            onClick={closeSidebar}
                                            to="/admin/management/products"
                                            startIcon={<StoreTwoToneIcon />}
                                        >
                                            Sản phẩm
                                        </Button>
                                    </ListItem>
                                    <ListItem component="div">
                                        <Button
                                            disableRipple
                                            component={RouterLink}
                                            onClick={closeSidebar}
                                            to="/admin/management/categories"
                                            startIcon={<CategoryIcon />}
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
                                            startIcon={<AccountCircleTwoToneIcon />}
                                        >
                                            {t('admin.User')}
                                        </Button>
                                    </ListItem>
                                </>
                            )}

                            <ListItem component="div">
                                <Button
                                    disableRipple
                                    component={RouterLink}
                                    onClick={closeSidebar}
                                    to="/admin/management/new-orders"
                                    startIcon={<AddShoppingCartIcon />}
                                >
                                    Đơn hàng mới
                                </Button>
                            </ListItem>
                            <ListItem component="div">
                                <Button
                                    disableRipple
                                    component={RouterLink}
                                    onClick={closeSidebar}
                                    to="/admin/management/orders"
                                    startIcon={<AssignmentTurnedInTwoToneIcon />}
                                >
                                    Quản lý đơn hàng
                                </Button>
                            </ListItem>
                            {user.role === 'ADMIN' && (
                                <>
                                    <ListItem component="div">
                                        <Button
                                            disableRipple
                                            component={RouterLink}
                                            onClick={closeSidebar}
                                            to="/admin/management/detail-commission"
                                            startIcon={<LocalOfferTwoToneIcon />}
                                        >
                                            Quản lý hoa hồng chi tiết
                                        </Button>
                                    </ListItem>
                                    <ListItem component="div">
                                        <Button
                                            disableRipple
                                            component={RouterLink}
                                            onClick={closeSidebar}
                                            to="/admin/management/commission-statistics"
                                            startIcon={<BarChartTwoToneIcon />}
                                        >
                                            Thống kê hoa hồng
                                        </Button>
                                    </ListItem>
                                    <ListItem component="div">
                                        <Button
                                            disableRipple
                                            component={RouterLink}
                                            onClick={closeSidebar}
                                            to="/admin/management/announcements"
                                            startIcon={<Announcement />}
                                        >
                                            Thông báo
                                        </Button>
                                    </ListItem>
                                </>
                            )}
                        </List>
                    </SubMenuWrapper>
                </List>
            </MenuWrapper>
        </>
    );
}

export default SidebarMenu;
