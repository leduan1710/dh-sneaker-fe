import React, { MouseEvent, useState } from 'react';
import { Button, Box, ToggleButton, ToggleButtonGroup, Card, Typography, styled } from '@mui/material';
import ViewWeekTwoToneIcon from '@mui/icons-material/ViewWeekTwoTone';
import TableRowsTwoToneIcon from '@mui/icons-material/TableRowsTwoTone';
import AdminBarChart from './AdminBarChart';
import AdminLineChart from './AdminLineChart';
import { useTranslation } from 'react-i18next';

interface AdminChartProps {
    monthlyRevenue: any;
}
function AdminChart(props: AdminChartProps) {
    const { monthlyRevenue } = props;
    const {t} = useTranslation();

    const [tabs, setTab] = useState<string | null>('line_chart');

    const handleViewOrientation = (_event: MouseEvent<HTMLElement>, newValue: string | null) => {
        setTab(newValue);
    };

    return (
        <>
            <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                sx={{
                    pb: 3,
                }}
            >
                <Typography variant="h3" fontSize={20}>
                    Thống kê doanh thu theo tháng trong năm
                </Typography>
                <ToggleButtonGroup value={tabs} exclusive onChange={handleViewOrientation}>
                    <ToggleButton disableRipple value="line_chart">
                        <ViewWeekTwoToneIcon />
                    </ToggleButton>
                    <ToggleButton disableRipple value="bar_chart">
                        <TableRowsTwoToneIcon />
                    </ToggleButton>
                </ToggleButtonGroup>
            </Box>

            {tabs === 'line_chart' && (
                <AdminLineChart
                    monthlyRevenue={monthlyRevenue}
                />
            )}

            {tabs === 'bar_chart' && (
                <AdminBarChart
                    monthlyRevenue={monthlyRevenue}
                />
            )}
        </>
    );
}

export default AdminChart;
