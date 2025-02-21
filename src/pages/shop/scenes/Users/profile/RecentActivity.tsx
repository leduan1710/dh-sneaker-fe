import React from 'react';
import { Box, Typography, Card, CardHeader, Divider, Avatar, useTheme, styled } from '@mui/material';

import ShoppingBagTwoToneIcon from '@mui/icons-material/ShoppingBagTwoTone';
import FavoriteTwoToneIcon from '@mui/icons-material/FavoriteTwoTone';
import StarTwoToneIcon from '@mui/icons-material/StarTwoTone';
import { useTranslation } from 'react-i18next';

const AvatarPrimary = styled(Avatar)(
    ({ theme }) => `
      background: ${theme.colors.primary.lighter};
      color: ${theme.colors.primary.main};
      width: ${theme.spacing(7)};
      height: ${theme.spacing(7)};
`,
);
interface RecentActivityProps {
    shop: any;
}
function RecentActivity(props: RecentActivityProps) {
    const { shop } = props;
    const { t } = useTranslation();
    const theme = useTheme();

    return (
        <Card>
            <CardHeader title={t('shopProfile.RecentActivity')} />
            <Divider />
            <Box px={2} py={4} display="flex" alignItems="flex-start">
                <AvatarPrimary>
                    <ShoppingBagTwoToneIcon />
                </AvatarPrimary>
                <Box pl={2} flex={1}>
                    <Typography variant="h3">{t('shopProfile.Orders')}</Typography>

                    <Box pt={2} display="flex">
                        <Box pr={8}>
                            <Typography
                                gutterBottom
                                variant="caption"
                                sx={{ fontSize: `${theme.typography.pxToRem(16)}` }}
                            >
                                {t('shopProfile.Total')}
                            </Typography>
                            <Typography variant="h2">{shop?.totalOrder}</Typography>
                        </Box>
                        <Box>
                            <Typography
                                gutterBottom
                                variant="caption"
                                sx={{ fontSize: `${theme.typography.pxToRem(16)}` }}
                            >
                                {t('shopProfile.Failed')}
                            </Typography>
                            <Typography variant="h2">{shop?.totalCancelOrder}</Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>
            <Divider />
            <Box px={2} py={4} display="flex" alignItems="flex-start">
                <AvatarPrimary>
                    <FavoriteTwoToneIcon />
                </AvatarPrimary>
                <Box pl={2} flex={1}>
                    <Typography variant="h3">{t('shopProfile.Follows')}</Typography>

                    <Box pt={2} display="flex">
                        <Box pr={8}>
                            <Typography
                                gutterBottom
                                variant="caption"
                                sx={{ fontSize: `${theme.typography.pxToRem(16)}` }}
                            >
                                {t('shopProfile.Users')}
                            </Typography>
                            <Typography variant="h2">{shop?.dataShop.userFollowIdList.length}</Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>
            <Divider />
            <Box px={2} py={4} display="flex" alignItems="flex-start">
                <AvatarPrimary>
                    <StarTwoToneIcon />
                </AvatarPrimary>
                <Box pl={2} flex={1}>
                    <Typography variant="h3">{t('shopProfile.Reviews')}</Typography>

                    <Box pt={2} display="flex">
                        <Box pr={8}>
                            <Typography
                                gutterBottom
                                variant="caption"
                                sx={{ fontSize: `${theme.typography.pxToRem(16)}` }}
                            >
                                {t('shopProfile.Total')}
                            </Typography>
                            <Typography variant="h2">{shop?.totalReviews}</Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Card>
    );
}

export default RecentActivity;
