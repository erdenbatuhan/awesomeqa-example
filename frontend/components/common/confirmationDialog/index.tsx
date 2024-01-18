import {
  Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from "@mui/material";

interface ConfirmationDialogPropsType {
  dialogShown: boolean;
  action: string;
  itemName: string;
  onConfirm: () => void;
  onClose: () => void;
}

const ConfirmationDialog = ({ dialogShown, action, itemName, onConfirm, onClose }: ConfirmationDialogPropsType) => {
  return (
    <>
      {action ? (
        <Dialog
          open={dialogShown}
          onClose={onClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            Do you want to {action.toLowerCase()} the {itemName}?
          </DialogTitle>

          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Do you want to {action.toLowerCase()} the {itemName}?
            </DialogContentText>
          </DialogContent>

          <DialogActions>
            <Button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              color="info"
            >
              {action}
            </Button>

            <Button onClick={onClose} color="error">
              CANCEL
            </Button>
          </DialogActions>
        </Dialog>
      ) : (
        <></>
      )}
    </>
  );
};

export default ConfirmationDialog;
