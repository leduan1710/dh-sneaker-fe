import React from 'react';
import { Box, Typography, Button, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

interface ColorFilterSectionProps {
    title: string;
    options: any;
    selectedOptions: any;
    toggleOption: (option: string) => void;
    expand: boolean;
    setExpand: (value: boolean) => void;
}

const ColorFilterSection: React.FC<ColorFilterSectionProps> = ({
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
                <Typography variant="h4" fontSize={18} fontWeight={600}>{title}</Typography>
                <IconButton size="small" onClick={() => setExpand(!expand)}>
                    {expand ? <CloseIcon sx={{ fontSize: 'inherit' }} /> : <AddIcon sx={{ fontSize: 'inherit' }} />}{' '}
                </IconButton>
            </Box>
            {expand && (
                <Box display="flex" flexWrap="wrap" mt={1}>
                    {options.map((option: any, index: number) => (
                        <Button
                            key={index}
                            variant="outlined"
                            sx={{
                                margin: '4px',
                                padding: '6px 10px',
                                backgroundColor: selectedOptions.includes(option) ? 'rgb(241, 241, 241)' : 'white',
                                color: 'inherit',
                                border: '1px solid rgb(207, 214, 216)',
                                borderRadius: '20px',
                                fontSize: '12px',
                                whiteSpace: 'nowrap',
                                fontWeight: selectedOptions.includes(option) ? '700' : '500',
                                transition: 'background-color 0.3s, color 0.3s, border 0.3s, box-shadow 0.3s',
                                '&:hover': {
                                    backgroundColor: selectedOptions.includes(option.name)
                                        ? 'rgba(200, 200, 200, 0.7)'
                                        : 'rgba(99, 120, 127, 0.1)',
                                    border: '1px solid rgb(207, 214, 216)',
                                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                                },
                            }}
                            onClick={() => toggleOption(option)}
                        >
                            <Box
                                sx={{
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    backgroundColor: option.colorCode?.toLowerCase(),
                                    display: 'inline-block',
                                    border: selectedOptions.includes(option) ? '2px solid black' : '0.5px solid rgba(200, 200, 200, 0.7)',
                                    marginRight: '8px',
                                }}
                            />
                            {option.name}
                        </Button>
                    ))}
                </Box>
            )}
        </Box>
    );
};

export default ColorFilterSection;
