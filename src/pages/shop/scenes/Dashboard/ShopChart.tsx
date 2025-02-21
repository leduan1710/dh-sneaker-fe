import React, { MouseEvent, useState } from 'react';
import {
  Button,
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Card,
  Typography,
  styled
} from '@mui/material';
import ViewWeekTwoToneIcon from '@mui/icons-material/ViewWeekTwoTone';
import TableRowsTwoToneIcon from '@mui/icons-material/TableRowsTwoTone';
import ShopLineChart from './ShopLineChart';
import ShopBarChart from './ShopBarChart';
import { useTranslation } from 'react-i18next';

interface ShopChartProps{
  dailyOrderCount: any;
  dailyRevenue: any
}
function ShopChart(props: ShopChartProps) {
  const { dailyOrderCount, dailyRevenue } = props;
  const {t} = useTranslation();
  const [tabs, setTab] = useState<string | null>('line_chart');

  const handleViewOrientation = (
    _event: MouseEvent<HTMLElement>,
    newValue: string | null
  ) => {
    setTab(newValue);
  };

  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          pb: 3
        }}
      >
        <Typography variant="h3" fontSize={20}>{t('shopDashboard.RevenuesAndOrderStatistics')}</Typography>
        <ToggleButtonGroup
          value={tabs}
          exclusive
          onChange={handleViewOrientation}
        >
          <ToggleButton disableRipple value="line_chart">
            <ViewWeekTwoToneIcon />
          </ToggleButton>
          <ToggleButton disableRipple value="bar_chart">
            <TableRowsTwoToneIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {tabs === 'line_chart' && <ShopLineChart  dailyOrderCount={dailyOrderCount} dailyRevenue={dailyRevenue}/>}

      {tabs === 'bar_chart' && <ShopBarChart dailyOrderCount={dailyOrderCount} dailyRevenue={dailyRevenue}/>}
    </>
  );
}

export default ShopChart;
