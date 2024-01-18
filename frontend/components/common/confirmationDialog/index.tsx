import { ReactElement } from "react";
import {
  Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from "@mui/material";

interface ConfirmationDialogPropsType {
  dialogShown: boolean;
  action: string;
  itemName: string;
  onConfirm: () => void;
  onClose: () => void;
  dialogContent: ReactElement;
}

const ConfirmationDialog = ({
  dialogShown, action, itemName, dialogContent, onConfirm, onClose
}: ConfirmationDialogPropsType) => {
  return (
    <>
      {action ? (
        <Dialog
          open={dialogShown}
          onClose={onClose}
        >
          <DialogTitle>
            Do you want to {action.toLowerCase()} the {itemName}?
          </DialogTitle>

          <DialogContent>
            {dialogContent}
          </DialogContent>

          <DialogActions>
            <Button
              onClick={() => {
                onConfirm();
                onClose();
              }}
            >
              {action}
            </Button>

            <Button onClick={onClose}>
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
