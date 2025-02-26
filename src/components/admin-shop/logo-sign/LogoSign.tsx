import { Box, Tooltip, Badge, TooltipProps, tooltipClasses, styled, useTheme, Avatar, darken } from '@mui/material';
import { Link } from 'react-router-dom';
import React from 'react';
import { useSelector } from 'react-redux';
import { ReducerProps } from '../../../reducers/ReducersProps';

const LogoWrapper = styled(Link)(
    ({ theme }) => `
        color: ${theme.palette.text.primary};
        display: flex;
        text-decoration: none;
        width: 53px;
        margin: 0 auto;
        font-weight: ${theme.typography.fontWeightBold};
`,
);
const LogoImage = styled(Box)(
    ({ theme }) => `
        width: 100%;
        height: auto;
        background-color: transparent;
        border-radius: ${theme.general.borderRadiusSm};
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
`,
);

const TooltipWrapper = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: theme.colors.alpha.trueWhite[100],
        color: theme.palette.getContrastText(theme.colors.alpha.trueWhite[100]),
        fontSize: theme.typography.pxToRem(12),
        fontWeight: 'bold',
        borderRadius: theme.general.borderRadiusSm,
        boxShadow: '0 .2rem .8rem rgba(7,9,25,.18), 0 .08rem .15rem rgba(7,9,25,.15)',
    },
    [`& .${tooltipClasses.arrow}`]: {
        color: theme.colors.alpha.trueWhite[100],
    },
}));

function Logo() {
    const theme = useTheme();
    const user = useSelector((state: ReducerProps) => state.user);

    return (
        <TooltipWrapper title={"DH Sneaker Admin Management"} arrow>
            <LogoWrapper to={"/admin"}>
                <Badge
                    sx={{
                        '.MuiBadge-badge': {
                            fontSize: theme.typography.pxToRem(11),
                            right: -2,
                            top: 2,
                        },
                    }}
                    overlap="circular"
                    color="success"
                >
                    <LogoImage>
                        <img
                            src={require('../../../static/dhsneaker-logo.png')}
                            alt="Logo"
                            style={{
                                maxWidth: '170px',
                                maxHeight: '90px',
                                objectFit: 'contain',
                            }}
                        />
                    </LogoImage>
                </Badge>
            </LogoWrapper>
        </TooltipWrapper>
    );
}

export default Logo;
