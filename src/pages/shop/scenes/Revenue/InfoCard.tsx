import React from 'react';
import {
    Button,
    Card,
    Grid,
    Box,
    CardContent,
    Typography,
    Avatar,
    alpha,
    Tooltip,
    CardActionArea,
    styled,
} from '@mui/material';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import { formatPrice } from '../../../../untils/Logic';
import { useTranslation } from 'react-i18next';

const AvatarWrapper = styled(Avatar)(
    ({ theme }) => `
    margin: ${theme.spacing(2, 0, 1, -0.5)};
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: ${theme.spacing(1)};
    padding: ${theme.spacing(0.5)};
    border-radius: 10px;
    height: ${theme.spacing(5.5)};
    width: ${theme.spacing(5.5)};
    background: ${
        theme.palette.mode === 'dark' ? theme.colors.alpha.trueWhite[30] : alpha(theme.colors.alpha.black[100], 0.07)
    };
  
    img {
      background: ${theme.colors.alpha.trueWhite[100]};
      padding: ${theme.spacing(0.5)};
      display: block;
      border-radius: inherit;
      height: ${theme.spacing(4.5)};
      width: ${theme.spacing(4.5)};
    }
`,
);

interface InfoCardProps {
    totalRevenue: number;
    orderCount: number;
    deliveringOrderCount: number;
    totalRevenueDelivering: number;
}
function InfoCard(props: InfoCardProps) {
    const { t } = useTranslation();

    const { totalRevenue, orderCount, deliveringOrderCount,totalRevenueDelivering } = props;
    return (
        <>
            <Grid container spacing={3}>
                <Grid xs={12} sm={6} md={3} item>
                    <Card>
                        <CardContent>
                            <Grid container spacing={0}>
                                <Grid xs={12} sm={4} item display="flex" justifyContent="center" alignItems="center">
                                    <AvatarWrapper>
                                        <img alt="revenue" src={require('../../../../static/revenue.png')} />
                                    </AvatarWrapper>
                                </Grid>
                                <Grid xs={12} sm={8} item display="flex" alignItems="center">
                                    <Box
                                        sx={{
                                            pt: 2,
                                        }}
                                    >
                                        <Typography variant="h4" gutterBottom noWrap>
                                            {t('orderRevenue.TotalRevenue')}
                                        </Typography>
                                        <Typography variant="body2" noWrap>
                                            {totalRevenue? formatPrice(totalRevenue) : formatPrice(0)}
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid xs={12} sm={6} md={3} item>
                    <Card>
                        <CardContent>
                            <Grid container spacing={0}>
                                <Grid xs={12} sm={4} item display="flex" justifyContent="center" alignItems="center">
                                    <AvatarWrapper>
                                        <img alt="Ripple" src={require('../../../../static/order-count.png')} />
                                    </AvatarWrapper>
                                </Grid>
                                <Grid xs={12} sm={8} item display="flex" alignItems="center">
                                    <Box
                                        sx={{
                                            pt: 2,
                                        }}
                                    >
                                        <Typography variant="h4" gutterBottom noWrap>
                                            {t('orderRevenue.OrderCount')}
                                        </Typography>
                                        <Typography variant="body2" noWrap>
                                            {orderCount? orderCount : 0}
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid xs={12} sm={6} md={3} item>
                    <Card>
                        <CardContent>
                            <Grid container spacing={0}>
                                <Grid xs={12} sm={4} item display="flex" justifyContent="center" alignItems="center">
                                    <AvatarWrapper>
                                        <img alt="revenue" src={require('../../../../static/revenue.png')} />
                                    </AvatarWrapper>
                                </Grid>
                                <Grid xs={12} sm={8} item display="flex" alignItems="center">
                                    <Box
                                        sx={{
                                            pt: 2,
                                        }}
                                    >
                                        <Typography variant="h4" gutterBottom>
                                            {t('orderRevenue.TotalRevenueDelivering')}
                                        </Typography>
                                        <Typography variant="body2" noWrap>
                                            {totalRevenueDelivering? formatPrice(totalRevenueDelivering) : formatPrice(0)}
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid xs={12} sm={6} md={3} item>
                    <Card>
                        <CardContent>
                            <Grid container spacing={0}>
                                <Grid xs={12} sm={4} item display="flex" justifyContent="center" alignItems="center">
                                    <AvatarWrapper>
                                        <img alt="Ripple" src={require('../../../../static/order-count.png')} />
                                    </AvatarWrapper>
                                </Grid>
                                <Grid xs={12} sm={8} item display="flex" alignItems="center">
                                    <Box
                                        sx={{
                                            pt: 2,
                                        }}
                                    >
                                        <Typography variant="h4" gutterBottom>
                                            {t('orderRevenue.OrderCountDelivering')}
                                        </Typography>
                                        <Typography variant="body2" noWrap>
                                            {deliveringOrderCount? deliveringOrderCount : 0}
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </>
    );
}

export default InfoCard;
