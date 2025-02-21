import { Card, Avatar, alpha, styled, useTheme, Grid } from '@mui/material';
import React from 'react';
import Chart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
import { useTranslation } from 'react-i18next';

interface DailyData {
    day: number;
    commission: number;
    revenue: number;
    count: number;
}

interface AdminBarChartProps {
    dailyBannerCommission: any;
    dailyOrderCommission: any;
    dailyOrderCount: any;
}
function AdminBarChart(props: AdminBarChartProps) {
    const theme = useTheme();
    const { t } = useTranslation();

    const { dailyBannerCommission, dailyOrderCommission, dailyOrderCount } = props;

    const bannerCommissionData = dailyBannerCommission.map((item: DailyData) => item.commission);
    const orderCommissionData = dailyOrderCommission.map((item: DailyData) => item.revenue);
    const orderCountData = dailyOrderCount.map((item: DailyData) => item.count);

    const xLabels = dailyBannerCommission.map((item: DailyData) => item.day);
    const commonChartOptions: ApexOptions = {
        chart: {
            background: 'transparent',
            toolbar: {
                show: false,
            },
            zoom: {
                enabled: false,
            },
        },
        fill: {
            opacity: 1,
        },
        dataLabels: {
            enabled: false,
        },
        theme: {
            mode: theme.palette.mode,
        },
        colors: [theme.palette.primary.main],
        xaxis: {
            categories: xLabels,
            labels: {
                show: true,
            },
            axisBorder: {
                show: true,
                color: theme.palette.divider,
            },
            axisTicks: {
                show: true,
                color: theme.palette.divider,
            },
        },
        tooltip: {
            x: {
                show: true,
            },
            marker: {
                show: false,
            },
        },
    };

    const orderChartOptions: ApexOptions = {
        ...commonChartOptions,
        yaxis: {
            title: {
                text: t('adminDashboard.OrderCommission'),
                style: {
                    fontSize: '12px',
                    fontWeight: 700,
                    color: theme.palette.text.primary,
                    fontFamily: theme.typography.fontFamily,
                },
            },
            tickAmount: 5,
            labels: {
                show: true,
                style: {
                    colors: theme.palette.text.secondary,
                },
            },
        },
        title: {
            text: t('adminDashboard.OrderCommissionByDay'),
            align: 'center',
            style: {
                fontSize: '16px',
                fontWeight: 700,
                color: theme.palette.text.primary,
                fontFamily: theme.typography.fontFamily,
            },
        },
    };

    const revenueChartOptions: ApexOptions = {
        ...commonChartOptions,
        yaxis: {
            title: {
                text: t('adminDashboard.BannerCommission'),
                style: {
                    fontSize: '12px',
                    fontWeight: 700,
                    color: theme.palette.text.primary,
                    fontFamily: theme.typography.fontFamily,
                },
            },
            tickAmount: 5,
            labels: {
                show: true,
                style: {
                    colors: theme.palette.text.secondary,
                },
            },
        },
        title: {
            text: t('adminDashboard.BannerCommissionByDay'),
            align: 'center',
            style: {
                fontSize: '16px',
                fontWeight: 700,
                color: theme.palette.text.primary,
                fontFamily: theme.typography.fontFamily,
            },
        },
    };
    const orderCountChartOptions: ApexOptions = {
        ...commonChartOptions,
        yaxis: {
            title: {
                text: t('adminDashboard.OrderCount'),
                style: {
                    fontSize: '12px',
                    fontWeight: 700,
                    color: theme.palette.text.primary,
                    fontFamily: theme.typography.fontFamily,
                },
            },
            tickAmount: 5,
            labels: {
                show: true,
                style: {
                    colors: theme.palette.text.secondary,
                },
            },
        },
        title: {
            text: t('adminDashboard.OrderCountByDay'),
            align: 'center',
            style: {
                fontSize: '16px',
                fontWeight: 700,
                color: theme.palette.text.primary,
                fontFamily: theme.typography.fontFamily,
            },
        },
    };
    return (
        <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
            <Grid item md={12} xs={12}>
                <Card>
                    <Chart
                        options={orderChartOptions}
                        series={[{ name: t('adminDashboard.OrderCommission'), data: orderCommissionData }]}
                        type="bar"
                        height={300}
                    />
                </Card>
            </Grid>
            <Grid item md={6} xs={12}>
                <Card>
                    <Chart
                        options={revenueChartOptions}
                        series={[{ name: t('adminDashboard.BannerCommission'), data: bannerCommissionData }]}
                        type="bar"
                        height={300}
                    />
                </Card>
            </Grid>
            <Grid item md={6} xs={12}>
                <Card>
                    <Chart
                        options={orderCountChartOptions}
                        series={[{ name: t('adminDashboard.OrderCount'), data: orderCountData }]}
                        type="bar"
                        height={300}
                    />
                </Card>
            </Grid>
        </Grid>
    );
}
export default AdminBarChart;
