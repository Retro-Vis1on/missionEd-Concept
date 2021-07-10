import React from 'react'
import { Button } from '@material-ui/core'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Link } from 'react-router-dom'

export default function DeletePost(props) {
    return <Dialog
        open={props.open}
        onClose={props.onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
    >
        <DialogTitle id="alert-dialog-title">Do you really want to delete this post ?</DialogTitle>
        <DialogContent>
            <DialogContentText id="alert-dialog-description">
                The post will permanently remove after delete, do you still want to delete!
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button
                onClick={props.onClose}
                color="primary"
                variant='outlined'>
                Cancel
            </Button>
            <Link to='/' style={{ textDecorationLine: 'none' }}>
                <Button
                    onClick={() => props.deleteHandler()}
                    color="primary"
                    variant='contained'
                    disabled={props.isLoading}
                    autoFocus>
                    Yes
                </Button>
            </Link>
        </DialogActions>
    </Dialog>
}
