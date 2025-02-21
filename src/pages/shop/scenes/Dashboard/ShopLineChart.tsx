import { Card, Box, Typography, Avatar, Grid, alpha, useTheme, styled } from '@mui/material';
import React from 'react';

import Chart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
import { useTranslation } from 'react-i18next';

interface DailyData {
  day: number;
  count: number;
  revenue: number;
}

interface ShopLineChartProps {
  dailyOrderCount: DailyData[];
  dailyRevenue: DailyData[];
}

function ShopLineChart(props: ShopLineChartProps) {
  const theme = useTheme();
  const { t } = useTranslation();

  const { dailyOrderCount, dailyRevenue } = props;

  const orderData = dailyOrderCount.map((item: DailyData) => item.count);
  const revenueData = dailyRevenue.map((item: DailyData) => item.revenue);
  const xLabels = dailyOrderCount.map((item: DailyData) => item.day);

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
        text: t('shopDashboard.OrderCount'),
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
      text: t('shopDashboard.OrderCountByDay'),
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

  const revenueChartOptions: ApexOptions = {
    ...commonChartOptions,
    yaxis: {
      title: {
        text: t('shopDashboard.Revenue'),
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
      text: t('shopDashboard.RevenueByDay'),
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
      <Grid item md={6} xs={12}>
        <Card>
        <Chart
            width="100%"
            options={revenueChartOptions}
            series={[{ name: t('shopDashboard.Revenue'), data: revenueData }]}
            type="line"
            height={300}
          />

        </Card>
      </Grid>
      <Grid item md={6} xs={12}>
        <Card>
        <Chart
            width="100%"
            options={orderChartOptions}
            series={[{ name: t('shopDashboard.OrderCount'), data: orderData }]}
            type="line"
            height={300}
          />
        </Card>
      </Grid>
    </Grid>
  );
}

export default ShopLineChart;
