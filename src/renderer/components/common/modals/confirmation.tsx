import { ReactNode } from 'react';
import { Button, Modal } from 'react-bootstrap';

export type Props = {
  show: boolean;
  toggle: (show: boolean) => void;
  message: string | ReactNode;
  onConfirm?: () => void;
  onCancel?: () => void;
  onExited?: () => void;
  size?: 'sm' | 'lg' | 'xl';
  cancelLabel?: string;
  confirmLabel?: string;
};

const ConfirmationModal = ({
  show,
  toggle,
  message,
  onConfirm,
  onCancel,
  onExited,
  cancelLabel,
  confirmLabel,
  size = 'sm',
}: Props) => {
  const handleCancel = () => {
    toggle(false);
    onCancel?.();
  };

  const handleConfirm = () => {
    toggle(false);
    onConfirm?.();
  };

  return (
    <Modal
      show={show}
      onHide={() => toggle(false)}
      size={size}
      onExited={onExited}
      backdrop="static"
      centered
    >
      <Modal.Header>
        <Modal.Title className="fw-bold text-center d-block w-100">
          Confirmation
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCancel}>
          {cancelLabel ?? 'Cancel'}
        </Button>
        <Button variant="primary" onClick={handleConfirm}>
          {confirmLabel ?? 'Confirm'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmationModal;
