import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { useState, useImperativeHandle, forwardRef, useRef } from "react";

export interface PromptDialogRef {
  open: () => void;
  close: () => void;
}

type PromptProps = {};

export const PromptDialog = forwardRef<PromptDialogRef, PromptProps>(
  ({}, ref) => {
    const [visible, setVisible] = useState(false);

    useImperativeHandle(ref, () => ({
      open: () => setVisible(true),
      close: () => setVisible(false),
    }));

    return (
      <Dialog
        header="Header"
        visible={visible}
        style={{ width: "50vw" }}
        onHide={() => {
          if (!visible) return;
          setVisible(false);
        }}
      >
        <InputText />
      </Dialog>
    );
  },
);
