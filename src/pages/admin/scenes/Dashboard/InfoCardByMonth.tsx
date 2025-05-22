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
import { useNavigate } from 'react-router-dom';

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

interface InfoCardByMonthProps {
    orderCounts: any;
    revenue: any;
    commission: any;
    bonus: any;
}
function InfoCardByMonth(props: InfoCardByMonthProps) {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const { orderCounts, revenue, commission, bonus } = props;
    return (
        <>
            <Grid container spacing={3}>
                <Grid xs={12} sm={6} md={4} item>
                    <Card
                        onClick={() => {
                            navigate('/admin/management/detail-commission', { state: { status: 'ALL' } });
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                        }}
                        style={{
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            cursor: 'pointer',
                        }}
                    >
                        <CardContent>
                            <Grid container spacing={0}>
                                <Grid xs={12} sm={4} item display="flex" justifyContent="center" alignItems="center">
                                    <AvatarWrapper>
                                        <img alt="revenue" src={require('../../../../static/order-commission.png')} />
                                    </AvatarWrapper>
                                </Grid>
                                <Grid xs={12} sm={8} item display="flex" alignItems="center">
                                    <Box
                                        sx={{
                                            pt: 2,
                                        }}
                                    >
                                        <Typography variant="h5" fontSize={17} gutterBottom noWrap>
                                            Doanh thu tháng
                                        </Typography>
                                        <Typography variant="body2" noWrap>
                                            {formatPrice(revenue)}
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid xs={12} sm={6} md={4} item>
                    <Card onClick={() => {
                            navigate('/admin/management/new-orders');
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                        }}
                        style={{
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            cursor: 'pointer',
                        }}>
                        <CardContent>
                            <Grid container spacing={0}>
                                <Grid xs={12} sm={4} item display="flex" justifyContent="center" alignItems="center">
                                    <AvatarWrapper>
                                        <img alt="Ripple" src={require('../../../../static/new-order.png')} />
                                    </AvatarWrapper>
                                </Grid>
                                <Grid xs={12} sm={8} item display="flex" alignItems="center">
                                    <Box
                                        sx={{
                                            pt: 2,
                                        }}
                                    >
                                        <Typography variant="h5" fontSize={17} gutterBottom noWrap>
                                            Đơn hàng mới
                                        </Typography>
                                        <Typography variant="body2" noWrap>
                                            {orderCounts ? orderCounts.newOrderCount : 0}
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid xs={12} sm={6} md={4} item>
                    <Card onClick={() => {
                            navigate('/admin/management/detail-commission', { state: { status: 'ALL' } });
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                        }}
                        style={{
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            cursor: 'pointer',
                        }}>
                        <CardContent>
                            <Grid container spacing={0}>
                                <Grid xs={12} sm={4} item display="flex" justifyContent="center" alignItems="center">
                                    <AvatarWrapper>
                                        <img alt="Ripple" src={require('../../../../static/bonus.png')} />
                                    </AvatarWrapper>
                                </Grid>
                                <Grid xs={12} sm={8} item display="flex" alignItems="center">
                                    <Box
                                        sx={{
                                            pt: 2,
                                        }}
                                    >
                                        <Typography variant="h5" fontSize={17} gutterBottom noWrap>
                                            Hoa hồng & thưởng CTV
                                        </Typography>
                                        <Typography variant="body2" noWrap>
                                            {formatPrice(commission + bonus)}
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid xs={12} sm={6} md={4} item>
                    <Card onClick={() => {
                            navigate('/admin/management/orders', { state: { status: 'SUCCESS' } });
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                        }}
                        style={{
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            cursor: 'pointer',
                        }}>
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
                                        <Typography variant="h5" fontSize={17} gutterBottom noWrap>
                                            Số đơn thành công
                                        </Typography>
                                        <Typography variant="body2" noWrap>
                                            {orderCounts ? orderCounts.successOrderCount : 0}
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid xs={12} sm={6} md={4} item>
                    <Card onClick={() => {
                            navigate('/admin/management/orders', { state: { status: 'CANCEL' } });
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                        }}
                        style={{
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            cursor: 'pointer',
                        }}>
                        <CardContent>
                            <Grid container spacing={0}>
                                <Grid xs={12} sm={4} item display="flex" justifyContent="center" alignItems="center">
                                    <AvatarWrapper>
                                        <img alt="Ripple" src={require('../../../../static/cancel-order.png')} />
                                    </AvatarWrapper>
                                </Grid>
                                <Grid xs={12} sm={8} item display="flex" alignItems="center">
                                    <Box
                                        sx={{
                                            pt: 2,
                                        }}
                                    >
                                        <Typography variant="h5" fontSize={17} gutterBottom noWrap>
                                            Số đơn hủy
                                        </Typography>
                                        <Typography variant="body2" noWrap>
                                            {orderCounts ? orderCounts.cancelOrderCount : 0}
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid xs={12} sm={6} md={4} item>
                    <Card onClick={() => {
                            navigate('/admin/management/orders', { state: { status: 'BOOM' } });
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                        }}
                        style={{
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            cursor: 'pointer',
                        }}>
                        <CardContent>
                            <Grid container spacing={0}>
                                <Grid xs={12} sm={4} item display="flex" justifyContent="center" alignItems="center">
                                    <AvatarWrapper>
                                        <img alt="Ripple" src={require('../../../../static/boom-order.png')} />
                                    </AvatarWrapper>
                                </Grid>
                                <Grid xs={12} sm={8} item display="flex" alignItems="center">
                                    <Box
                                        sx={{
                                            pt: 2,
                                        }}
                                    >
                                        <Typography variant="h5" fontSize={17} gutterBottom noWrap>
                                            Số đơn boom
                                        </Typography>
                                        <Typography variant="body2" noWrap>
                                            {orderCounts ? orderCounts.boomOrderCount : 0}
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

export default InfoCardByMonth;
