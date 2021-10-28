import React from 'react';
import { Dialog, Box, Typography } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { triggerError } from '../../redux/actions';

const ErrorDialog = (props) => {
    const { open, error_message } = props;
    const dispatch = useDispatch()


    const handleClose = () => {
        dispatch(triggerError(null));
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <Box className='dialog_header'>
                <Typography variant='h3'> Generic Error Message</Typography>
            </Box>

            <Box className='dialog_body'>
                <Typography variant='h8'> {error_message} </Typography>
            </Box>
        </Dialog>
    );
};

export default ErrorDialog;
