import { DeliveryStatus } from 'globalTypes/realm/laundry.types';
import { deliveryStatus, deliveryStatusLevel } from 'globalUtils/constants';
import { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';

export type Props = {
  show: boolean;
  toggle: (show: boolean) => void;
  onConfirm?: (status: DeliveryStatus, isUndo?: boolean) => void;
  onCancel?: () => void;
  onExited?: () => void;
  status?: DeliveryStatus;
};

const DeliveryStatusUpdateModal = ({
  show,
  toggle,
  onConfirm,
  onCancel,
  onExited,
  status,
}: Props) => {
  const [isUndo, setIsUndo] = useState(false);
  const stat = status || 'pending delivery';
  const statusLevel = deliveryStatusLevel[stat];
  const nextStatus = statusLevel < 4 ? deliveryStatus[statusLevel + 1] : stat;
  const prevStatus = statusLevel > 0 ? deliveryStatus[statusLevel - 1] : stat;
  const isShowUndo = status && !isUndo && statusLevel > 1;

  const handleCancel = () => {
    toggle(false);
    onCancel?.();
  };

  const handleConfirm = () => {
    toggle(false);
    onConfirm?.(isUndo ? prevStatus : nextStatus, isUndo);
  };

  const onShow = () => {
    setIsUndo(false);
    // setStat(status ?? 'pending delivery');
  };

  return (
    <Modal
      show={show}
      onShow={onShow}
      onHide={() => toggle(false)}
      onExited={onExited}
      backdrop="static"
      centered
    >
      <Modal.Header>
        <Modal.Title
          className={`fw-bold text-center d-block w-100 ${
            isUndo && 'text-danger'
          }`}
        >
          {isUndo ? 'Undo' : 'Update'} Delivery Status
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="text-center">
          Are you sure to {isUndo ? 'undo' : 'update'} delivery status to{' '}
          <span
            className={`fw-bold text-capitalize ${isUndo && 'text-danger'}`}
          >
            {isUndo ? prevStatus : nextStatus}
          </span>
          ?
        </p>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-between">
        <div className={isShowUndo ? '' : 'invisible'}>
          <Button
            variant="outline-primary me-2"
            size="sm"
            onClick={() => setIsUndo(true)}
          >
            undo status
          </Button>
        </div>

        <div>
          <Button className="me-2" variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirm}>
            Confirm
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default DeliveryStatusUpdateModal;
