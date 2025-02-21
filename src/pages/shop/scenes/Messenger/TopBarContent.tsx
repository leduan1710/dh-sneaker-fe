import React, { useState, SyntheticEvent, useEffect } from 'react';
import {
    Box,
    IconButton,
    Tooltip,
    Avatar,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Drawer,
    Divider,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    styled,
    useTheme,
} from '@mui/material';
import { formatDistance, subMinutes } from 'date-fns';
import CallTwoToneIcon from '@mui/icons-material/CallTwoTone';
import VideoCameraFrontTwoToneIcon from '@mui/icons-material/VideoCameraFrontTwoTone';
import InfoTwoToneIcon from '@mui/icons-material/InfoTwoTone';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import ColorLensTwoToneIcon from '@mui/icons-material/ColorLensTwoTone';
import NotificationsOffTwoToneIcon from '@mui/icons-material/NotificationsOffTwoTone';
import EmojiEmotionsTwoToneIcon from '@mui/icons-material/EmojiEmotionsTwoTone';
import CancelTwoToneIcon from '@mui/icons-material/CancelTwoTone';
import BlockTwoToneIcon from '@mui/icons-material/BlockTwoTone';
import WarningTwoToneIcon from '@mui/icons-material/WarningTwoTone';
import DescriptionTwoToneIcon from '@mui/icons-material/DescriptionTwoTone';
import { GetApi } from '../../../../untils/Api';
import { HOST_BE } from '../../../../common/Common';

const RootWrapper = styled(Box)(
    ({ theme }) => `
        @media (min-width: ${theme.breakpoints.values.md}px) {
          display: flex;
          align-items: center;
          justify-content: space-between;
      }
`,
);

const ListItemIconWrapper = styled(ListItemIcon)(
    ({ theme }) => `
        min-width: 36px;
        color: ${theme.colors.primary.light};
`,
);

const AccordionSummaryWrapper = styled(AccordionSummary)(
    ({ theme }) => `
        &.Mui-expanded {
          min-height: 48px;
        }

        .MuiAccordionSummary-content.Mui-expanded {
          margin: 12px 0;
        }

        .MuiSvgIcon-root {
          transition: ${theme.transitions.create(['color'])};
        }

        &.MuiButtonBase-root {

          margin-bottom: ${theme.spacing(0.5)};

          &:last-child {
            margin-bottom: 0;
          }

          &.Mui-expanded,
          &:hover {
            background: ${theme.colors.alpha.black[10]};

            .MuiSvgIcon-root {
              color: ${theme.colors.primary.main};
            }
          }
        }
`,
);
interface TopBarContentProps {
    oppositeCurrent: any;
}
const TopBarContent: React.FC<TopBarContentProps> = (props) => {
    const { oppositeCurrent } = props;
    const [userOpposite, setUserOpposite] = useState<any>(undefined);
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const getDataUser = async () => {
        const res = await GetApi(`/shop/get-user/${oppositeCurrent.id}`, localStorage.getItem('token'));
        if (res.data.message == 'Success') {
            setUserOpposite(res.data.user);
        }
    };
    useEffect(() => {
        if (oppositeCurrent) {
            getDataUser();
        }
    }, [oppositeCurrent]);
    return (
        <>
            <RootWrapper>
                {userOpposite ? (
                    <>
                        <Box display="flex" alignItems="center">
                            <Avatar
                                variant="rounded"
                                sx={{
                                    width: 48,
                                    height: 48,
                                }}
                                alt={userOpposite.email}
                                src={
                                    userOpposite.image
                                        ? userOpposite.image.startsWith('uploads')
                                            ? `${HOST_BE}/${userOpposite.image}`
                                            : userOpposite.image
                                        : ''
                                }
                            />
                            <Box ml={1}>
                                <Typography variant="h4">{userOpposite.email}</Typography>
                                <Typography variant="subtitle1">
                                    {formatDistance(subMinutes(new Date(), 8), new Date(), {
                                        addSuffix: true,
                                    })}
                                </Typography>
                            </Box>
                        </Box>
                    </>
                ) : (
                    <></>
                )}
            </RootWrapper>
        </>
    );
};

export default TopBarContent;
