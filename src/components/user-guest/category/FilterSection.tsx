import React from 'react';
import { Box, Typography, Button, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

interface FilterSectionProps {
    title: string;
    options: string[];
    selectedOptions: string[];
    toggleOption: (option: string) => void;
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
        <Box sx={{ mt: 2 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
                <Typography variant="h4">{title}</Typography>
                <IconButton size="small" onClick={() => setExpand(!expand)}>
                    {expand ? <CloseIcon sx={{ fontSize: 'inherit' }} /> : <AddIcon sx={{ fontSize: 'inherit' }} />}{' '}
                </IconButton>
            </Box>
            {expand && (
                <Box display="flex" flexWrap="wrap" mt={1}>
                    {options.map((option) => (
                        <Button
                            key={option}
                            variant="outlined"
                            sx={{
                                margin: '4px',
                                width: '95px',
                                height: '36px',
                                backgroundColor: selectedOptions.includes(option)
                                    ? 'rgba(7, 110, 145, 0.89)'
                                    : 'transparent',
                                color: selectedOptions.includes(option) ? 'white' : 'inherit',
                                border: selectedOptions.includes(option)
                                    ? '1px solid rgba(7, 110, 145, 0.89)'
                                    : '1px solid rgba(99, 120, 127, 0.89)',
                                borderRadius: '4px',
                                fontSize: '14px',
                                fontWeight: '700',
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
                            {option}
                        </Button>
                    ))}
                </Box>
            )}
        </Box>
    );
};

export default FilterSection;
