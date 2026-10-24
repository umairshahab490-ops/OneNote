import * as AlertDialog from "@radix-ui/react-alert-dialog";

export type ConfirmRequest = {
  title: string;
  description: string;
  confirmLabel: string;
  tone?: "danger" | "default";
};

export function ConfirmDialog({
  request,
  onCancel,
  onConfirm,
}: {
  request: ConfirmRequest | null;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <AlertDialog.Root
      open={request !== null}
      onOpenChange={(open) => {
        if (!open) onCancel();
      }}
    >
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="dialog-overlay" />
        <AlertDialog.Content className="dialog-content">
          <AlertDialog.Title className="dialog-title">{request?.title}</AlertDialog.Title>
          <AlertDialog.Description className="dialog-copy">{request?.description}</AlertDialog.Description>
          <div className="dialog-actions">
            <AlertDialog.Cancel className="btn btn-quiet">Cancel</AlertDialog.Cancel>
            <AlertDialog.Action
              className={request?.tone === "danger" ? "btn btn-danger" : "btn btn-accent"}
              onClick={(event) => {
                event.preventDefault();
                onConfirm();
              }}
            >
              {request?.confirmLabel ?? "Confirm"}
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
