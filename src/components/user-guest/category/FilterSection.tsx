import React from 'react';
import { Box, Typography, Button, IconButton, Grid } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

interface FilterSectionProps {
    title: string;
    options: any;
    selectedOptions: any;
    toggleOption: (option: any) => void;
    expand: boolean;
    setExpand: (value: boolean) => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({
    title,
    options,
    selectedOptions,
    toggleOption,
    expand,
    setExpand,
}) => {
    return (
        <Box sx={{ mt: 1 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
                <Typography variant="h4" fontSize={18} fontWeight={600}>{title}</Typography>
                <IconButton size="small" onClick={() => setExpand(!expand)}>
                    {expand ? <CloseIcon sx={{ fontSize: 'inherit' }} /> : <AddIcon sx={{ fontSize: 'inherit' }} />}{' '}
                </IconButton>
            </Box>
            {expand && (
                <Grid container spacing={2} mt={1}>
                    {options.map((option: any, index: number) => (
                        <Grid item key={index} xs={6}>
                            {' '}
                            {/* Chia đều 2 cột */}
                            <Button
                                key={index}
                                variant="outlined"
                                sx={{
                                    width: '100%',
                                    height: 'auto',
                                    backgroundColor: selectedOptions.includes(option)
                                        ? 'rgba(7, 110, 145, 0.89)'
                                        : 'white',
                                    color: selectedOptions.includes(option) ? 'white' : 'inherit',
                                    border: selectedOptions.includes(option)
                                        ? '1px solid rgba(7, 110, 145, 0.89)'
                                        : '1px solid rgba(99, 120, 127, 0.89)',
                                    borderRadius: '0px',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    transition: 'background-color 0.3s, color 0.3s, border 0.3s',
                                    '&:hover': {
                                        backgroundColor: selectedOptions.includes(option)
                                            ? 'rgba(7, 110, 145, 0.7)'
                                            : 'rgba(99, 120, 127, 0.1)',
                                        border: '1px solid rgba(7, 110, 145, 0.89)',
                                    },
                                }}
                                onClick={() => toggleOption(option)}
                            >
                                {option.name}
                            </Button>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
};

export default FilterSection;
