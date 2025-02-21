import { Card, Box, Typography, Avatar, Grid, alpha, useTheme, styled } from '@mui/material';
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

interface AdminLineChartProps {
    dailyBannerCommission: DailyData[];
    dailyOrderCommission: DailyData[];
    dailyOrderCount: DailyData[];
}

function AdminLineChart(props: AdminLineChartProps) {
    const theme = useTheme();
    const { t } = useTranslation();

    const { dailyBannerCommission, dailyOrderCommission, dailyOrderCount } = props;

    const orderCommissionData = dailyOrderCommission.map((item: DailyData) => item.revenue);
    const bannerCommissionData = dailyBannerCommission.map((item: DailyData) => item.commission);
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
            gradient: {
                shade: 'light',
                type: 'vertical',
                shadeIntensity: 0.1,
                opacityFrom: 0.8,
                opacityTo: 0,
                stops: [0, 100],
            },
        },
        dataLabels: {
            enabled: false,
        },
        theme: {
            mode: theme.palette.mode,
        },
        stroke: {
            show: true,
            width: 3,
        },
        legend: {
            show: false,
        },
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
        colors: [theme.palette.primary.main],
    };

    const bannerChartOptions: ApexOptions = {
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
        colors: [theme.palette.primary.main],
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
        colors: [theme.palette.primary.main],
    };
    return (
        <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
            <Grid item md={12} xs={12}>
                <Card>
                    <Chart
                        options={orderChartOptions}
                        series={[{ name: t('adminDashboard.OrderCommission'), data: orderCommissionData }]}
                        type="line"
                        height={300}
                    />
                </Card>
            </Grid>

            <Grid item md={6} xs={12}>
                <Card>
                    <Chart
                        options={bannerChartOptions}
                        series={[{ name: t('adminDashboard.BannerCommission'), data: bannerCommissionData }]}
                        type="line"
                        height={300}
                    />
                </Card>
            </Grid>
            <Grid item md={6} xs={12}>
                <Card>
                    <Chart
                        options={orderCountChartOptions}
                        series={[{ name: t('adminDashboard.OrderCount'), data: orderCountData }]}
                        type="line"
                        height={300}
                    />
                </Card>
            </Grid>
        </Grid>
    );
}

export default AdminLineChart;
