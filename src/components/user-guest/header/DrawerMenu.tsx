import React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import AccountCircleTwoToneIcon from '@mui/icons-material/AccountCircleTwoTone';
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import StoreTwoToneIcon from '@mui/icons-material/StoreTwoTone';
import AssignmentTurnedInTwoToneIcon from '@mui/icons-material/AssignmentTurnedInTwoTone';
import LocalOfferTwoToneIcon from '@mui/icons-material/LocalOfferTwoTone';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import BarChartTwoToneIcon from '@mui/icons-material/BarChartTwoTone';
import CategoryIcon from '@mui/icons-material/Category';
import { useTranslation } from 'react-i18next';
import InventoryIcon from '@mui/icons-material/Inventory';
import { FEMALE_ID, MALE_ID } from '../../../common/Common';
import { Button, ListSubheader, styled } from '@mui/material';
import { NavLink } from 'react-router-dom';

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
interface DrawerMenuProps {
    open: boolean;
    toggleDrawer: any;
}

const DrawerMenu: React.FC<DrawerMenuProps> = (props) => {
    const { open, toggleDrawer } = props;

    return (
        <div>
            <Drawer open={open} onClose={toggleDrawer(false)}>
                <MenuWrapper>
                    <SubMenuWrapper>
                        <List component="div">
                            <ListItem component="div">
                                <Button
                                    disableRipple
                                    component={NavLink}
                                    onClick={toggleDrawer(false)}
                                    to="/"
                                    startIcon={<SpaceDashboardIcon />}
                                >
                                    Trang chủ
                                </Button>
                            </ListItem>
                            <ListItem component="div">
                                <Button
                                    disableRipple
                                    component={NavLink}
                                    onClick={toggleDrawer(false)}
                                    to="/collections?category=Crocs"
                                    startIcon={<CategoryIcon />}
                                >
                                    Crocs
                                </Button>
                            </ListItem>
                            <ListItem component="div">
                                <Button
                                    disableRipple
                                    component={NavLink}
                                    onClick={toggleDrawer(false)}
                                    to="/collections?category=MLB"
                                    startIcon={<CategoryIcon />}
                                >
                                    MLB
                                </Button>
                            </ListItem>

                            <ListItem component="div">
                                <Button
                                    disableRipple
                                    component={NavLink}
                                    onClick={toggleDrawer(false)}
                                    to="/collections?category=Adidas"
                                    startIcon={<CategoryIcon />}
                                >
                                    Adidas
                                </Button>
                            </ListItem>
                            <ListItem component="div">
                                <Button
                                    disableRipple
                                    component={NavLink}
                                    onClick={toggleDrawer(false)}
                                    to="/collections?category=Trẻ em"
                                    startIcon={<CategoryIcon />}
                                >
                                    Trẻ em
                                </Button>
                            </ListItem>
                            <ListItem component="div">
                                <Button
                                    disableRipple
                                    component={NavLink}
                                    onClick={toggleDrawer(false)}
                                    to="/collections?category=Jibbitz"
                                    startIcon={<CategoryIcon />}
                                >
                                    Jibbitz
                                </Button>
                            </ListItem>
                            <ListItem component="div">
                                <Button
                                    disableRipple
                                    component={NavLink}
                                    onClick={toggleDrawer(false)}
                                    to="/collections?category=Sản phẩm khác"
                                    startIcon={<CategoryIcon />}
                                >
                                    Sản phẩm khác
                                </Button>
                            </ListItem>
                        </List>
                    </SubMenuWrapper>
                </MenuWrapper>
            </Drawer>
        </div>
    );
};
export default DrawerMenu;
