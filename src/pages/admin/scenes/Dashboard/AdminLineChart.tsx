import { Card, Box, Typography, Avatar, Grid, alpha, useTheme, styled } from '@mui/material';
import React from 'react';

import Chart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
import { useTranslation } from 'react-i18next';

interface RevenueData {
    month: number;
    revenue: number;
}

interface AdminLineChartProps {
    monthlyRevenue: RevenueData[];
}

function AdminLineChart(props: AdminLineChartProps) {
    const theme = useTheme();
    const { t } = useTranslation();

    const { monthlyRevenue } = props;

    const monthlyRevenueData = monthlyRevenue.map((item: RevenueData) => item.revenue);
    const xLabels = monthlyRevenue.map((item: RevenueData) => item.month);

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
                text: "Doanh thu",
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
            text: "Doanh thu theo tháng",
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
                        series={[{ name: "Doanh thu theo tháng", data: monthlyRevenueData }]}
                        type="line"
                        height={300}
                    />
                </Card>
            </Grid>
        </Grid>
    );
}

export default AdminLineChart;
