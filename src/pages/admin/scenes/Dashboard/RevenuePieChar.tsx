import React, { useEffect, useState } from 'react';
import {
    Button,
    Card,
    Box,
    Grid,
    Typography,
    useTheme,
    styled,
    Avatar,
    Divider,
    alpha,
    ListItem,
    ListItemText,
    List,
    ListItemAvatar,
} from '@mui/material';
import TrendingUp from '@mui/icons-material/TrendingUp';
import Chart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
import Text from '../../../../components/admin-shop/text/Text';
import { useSelector, useStore } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ReducerProps } from '../../../../reducers/ReducersProps';
import { GetApi } from '../../../../untils/Api';
import { formatPrice } from '../../../../untils/Logic';

const AvatarSuccess = styled(Avatar)(
    ({ theme }) => `
      background-color: ${theme.colors.success.main};
      color: ${theme.palette.success.contrastText};
      width: ${theme.spacing(8)};
      height: ${theme.spacing(8)};
      box-shadow: ${theme.colors.shadows.success};
`,
);

const ListItemAvatarWrapper = styled(ListItemAvatar)(
    ({ theme }) => `
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: ${theme.spacing(1)};
  padding: ${theme.spacing(0.5)};
  border-radius: 60px;
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
interface ProductTopSell {
    productName: string;
    totalRevenue: number;
}
interface RevenuePieCharProps {
    totalRevenue: number;
    totalRevenueUnPaid: number;
    topSellProductData: any;
}
function RevenuePieChar(props: RevenuePieCharProps) {
    const { totalRevenue, topSellProductData, totalRevenueUnPaid } = props;
    const theme = useTheme();
    const { t } = useTranslation();
    const store = useStore();
    const user = useSelector((state: ReducerProps) => state.user);
    const [topSellProduct, setTopSellProduct] = useState<ProductTopSell[]>([]);

    useEffect(() => {
        setTopSellProduct(topSellProductData);
    }, [topSellProductData]);
    // Chuyển đổi dữ liệu sản phẩm thành định dạng cho biểu đồ
    const chartLabels = topSellProduct.length > 0 ? topSellProduct.map((product) => product.productName) : [];
    const chartSeries = topSellProduct.length > 0 ? topSellProduct.map((product) => product.totalRevenue) : [];

    const chartOptions: ApexOptions = {
        chart: {
            background: 'transparent',
            stacked: false,
            toolbar: {
                show: false,
            },
        },
        plotOptions: {
            pie: {
                donut: {
                    size: '60%',
                },
            },
        },
        colors: ['#ff9900', '#1c81c2', '#333', '#5c6ac0'],
        dataLabels: {
            enabled: true,
            formatter: function (val: any) {
                return val.toFixed(2) + '%';
            },
            style: {
                colors: [theme.colors.alpha.trueWhite[100]],
            },
            background: {
                enabled: true,
                foreColor: theme.colors.alpha.trueWhite[100],
                padding: 8,
                borderRadius: 4,
                borderWidth: 0,
                opacity: 0.3,
                dropShadow: {
                    enabled: true,
                    top: 1,
                    left: 1,
                    blur: 1,
                    color: theme.colors.alpha.black[70],
                    opacity: 0.5,
                },
            },
            dropShadow: {
                enabled: true,
                top: 1,
                left: 1,
                blur: 1,
                color: theme.colors.alpha.black[50],
                opacity: 0.5,
            },
        },
        fill: {
            opacity: 1,
        },
        labels: chartLabels,
        legend: {
            labels: {
                colors: theme.colors.alpha.trueWhite[100],
            },
            show: false,
        },
        stroke: {
            width: 0,
        },
        theme: {
            mode: theme.palette.mode,
        },
    };
    const truncateLabel = (label: string, maxLength: number) => {
        return label.length > maxLength ? `${label.slice(0, maxLength)}...` : label;
    };
    return (
        <Card>
            <Grid spacing={0} container>
                <Grid item xs={12} md={5}>
                    <Box p={4}>
                        <Typography
                            sx={{
                                pb: 3,
                            }}
                            variant="h4"
                        >
                            {t('shopDashboard.TotalRevenue')}
                        </Typography>
                        <Box>
                            <Typography variant="h1" gutterBottom>
                                {totalRevenue ? formatPrice(totalRevenue) : formatPrice(0)}
                            </Typography>
                            <Box
                                display="flex"
                                sx={{
                                    py: 4,
                                }}
                                alignItems="center"
                            >
                                <AvatarSuccess
                                    sx={{
                                        mr: 2,
                                    }}
                                    variant="rounded"
                                >
                                    <TrendingUp fontSize="large" />
                                </AvatarSuccess>
                                <Box>
                                    <Typography variant="h4">+ $3,594.00</Typography>
                                    <Typography variant="subtitle2" noWrap>
                                        this month
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Grid>
                <Grid
                    sx={{
                        position: 'relative',
                    }}
                    display="flex"
                    alignItems="center"
                    item
                    xs={12}
                    md={7}
                >
                    <Box
                        component="span"
                        sx={{
                            display: { xs: 'none', md: 'inline-block' },
                        }}
                    >
                        <Divider absolute orientation="vertical" />
                    </Box>
                    <Box py={4} pr={4} pl={1} flex={1}>
                        <Typography
                            sx={{
                                pb: 3,
                            }}
                            variant="h4"
                        >
                            {t('shopDashboard.TopProduct')}
                        </Typography>
                        <Grid container spacing={0}>
                            <Grid xs={12} sm={5} item display="flex" justifyContent="center" alignItems="center">
                                <Chart height={250} options={chartOptions} series={chartSeries} type="donut" />
                            </Grid>
                            <Grid xs={12} sm={7} item display="flex" alignItems="center">
                                <List
                                    disablePadding
                                    sx={{
                                        width: '100%',
                                        pl: 1,
                                    }}
                                >
                                    {topSellProduct.map((product, index) => (
                                        <ListItem key={product.productName} disableGutters>
                                            <ListItemText
                                                primary={truncateLabel(product.productName, 15)}
                                                primaryTypographyProps={{ variant: 'h5' }}
                                                secondary={formatPrice(product.totalRevenue)}
                                                secondaryTypographyProps={{
                                                    variant: 'subtitle2',
                                                    noWrap: true,
                                                }}
                                            />
                                            <Box display="flex" alignItems="center">
                                                <Box
                                                    style={{
                                                        width: 16,
                                                        height: 16,
                                                        background: chartOptions.colors
                                                            ? chartOptions.colors[index % chartOptions.colors.length]
                                                            : '#000',
                                                        marginRight: 8,
                                                    }}
                                                />
                                                <Typography align="right" variant="h4" noWrap>
                                                    {((product.totalRevenue / totalRevenue) * 100).toFixed(2)}%{' '}
                                                </Typography>
                                            </Box>
                                        </ListItem>
                                    ))}

                                    <ListItem disableGutters>
                                        <ListItemText
                                            primary="BTC"
                                            primaryTypographyProps={{ variant: 'h5', noWrap: true }}
                                            secondary="Bitcoin"
                                            secondaryTypographyProps={{
                                                variant: 'subtitle2',
                                                noWrap: true,
                                            }}
                                        />
                                        <Box>
                                            <Typography align="right" variant="h4" noWrap>
                                                20%
                                            </Typography>
                                            <Text color="success">+2.54%</Text>
                                        </Box>
                                    </ListItem>
                                    <ListItem disableGutters>
                                        <ListItemText
                                            primary="XRP"
                                            primaryTypographyProps={{ variant: 'h5', noWrap: true }}
                                            secondary="Ripple"
                                            secondaryTypographyProps={{
                                                variant: 'subtitle2',
                                                noWrap: true,
                                            }}
                                        />
                                        <Box>
                                            <Typography align="right" variant="h4" noWrap>
                                                10%
                                            </Typography>
                                            <Text color="error">-1.22%</Text>
                                        </Box>
                                    </ListItem>
                                    <ListItem disableGutters>
                                        <ListItemText
                                            primary="ADA"
                                            primaryTypographyProps={{ variant: 'h5', noWrap: true }}
                                            secondary="Cardano"
                                            secondaryTypographyProps={{
                                                variant: 'subtitle2',
                                                noWrap: true,
                                            }}
                                        />
                                        <Box>
                                            <Typography align="right" variant="h4" noWrap>
                                                40%
                                            </Typography>
                                            <Text color="success">+10.50%</Text>
                                        </Box>
                                    </ListItem>
                                    <ListItem disableGutters>
                                        <ListItemText
                                            primary="ETH"
                                            primaryTypographyProps={{ variant: 'h5', noWrap: true }}
                                            secondary="Ethereum"
                                            secondaryTypographyProps={{
                                                variant: 'subtitle2',
                                                noWrap: true,
                                            }}
                                        />
                                        <Box>
                                            <Typography align="right" variant="h4" noWrap>
                                                30%
                                            </Typography>
                                            <Text color="error">-12.38%</Text>
                                        </Box>
                                    </ListItem>
                                </List>
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
            </Grid>
        </Card>
    );
}

export default RevenuePieChar;
