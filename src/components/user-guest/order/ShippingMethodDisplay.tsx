import React from 'react';
import { Box, Typography } from '@mui/material';
interface ShippingMethodDisplayProps {
    shippingMethod: 'VIETTELPOST' | 'GRAB' | 'OFFLINE' | string;
}
function ShippingMethodDisplay({ shippingMethod }: ShippingMethodDisplayProps) {
    let imageSrc, altText, labelText;

    switch (shippingMethod) {
        case 'VIETTELPOST':
            imageSrc = require('../../../static/Logo-Viettel-Post-Red.png');
            altText = 'Viettelpost';
            labelText = 'Viettelpost';
            break;
        case 'GRAB':
            imageSrc = require('../../../static/grab_logo_icon.png');
            altText = 'Grab/Kho khác';
            labelText = 'Grab/Kho khác';
            break;
        case 'OFFLINE':
            imageSrc = require('../../../static/store-icon.png');
            altText = 'Offline';
            labelText = 'Offline';
            break;
        default:
            imageSrc = '';
            altText = '';
            labelText = 'Không chọn';
            break;
    }

    return (
        <Box
            style={{
                display: 'flex',
                alignItems: 'center',
                border: '1px solid #ccc',
                borderRadius: '4px',
                padding: '10px',
                margin: '5px 0',
                width: '200px',
                backgroundColor: '#f5f5f5', // Luôn có background khi đã chọn
                transition: 'background-color 0.3s',
            }}
        >
            {imageSrc && (
                <img
                    src={imageSrc}
                    alt={altText}
                    style={{ width: 40, marginRight: 8 }}
                />
            )}
            <Typography>{labelText}</Typography>
        </Box>
    );
}

export default ShippingMethodDisplay;