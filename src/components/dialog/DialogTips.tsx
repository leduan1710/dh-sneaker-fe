import React, { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';

import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});
interface DialogTipsProps {
    isOpen: boolean;
    setIsOpen: any;
}
const DialogTips: React.FC<DialogTipsProps> = (props) => {
    const { isOpen, setIsOpen } = props;
    const [open, setOpen] = useState<boolean>(isOpen);
    const size = require('../../static/size.png');
    const handleClose = () => {
        setOpen(false);
        setIsOpen(false);
    };
    useEffect(() => {
        if (isOpen) {
            setOpen(isOpen);
        }
    }, [isOpen]);
    return (
        <React.Fragment>
            <Dialog open={open} TransitionComponent={Transition} keepMounted onClose={handleClose}>
                <img src={size} />
            </Dialog>
        </React.Fragment>
    );
};

export default DialogTips;
