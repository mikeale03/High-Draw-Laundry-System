import { Laundry } from 'globalTypes/realm/laundry.types';
import { FormEvent, useContext, useState } from 'react';
import {
  Button,
  Form,
  FormControl,
  FormGroup,
  FormLabel,
  Modal,
} from 'react-bootstrap';
import { pesoFormat } from 'renderer/utils/helper';
import { claimLaundry, deleteLaundry } from 'renderer/service/laundry';
import UserContext from 'renderer/context/userContext';
import { toast } from 'react-toastify';
import ConfirmationModal from '../common/modals/confirmation';

export type Props = {
  show: boolean;
  toggle: (show: boolean) => void;
  onConfirm: (laundry?: Laundry) => void;
  onCancel?: () => void;
  onExited?: () => void;
  action: 'delete' | 'claim';
  selectedLaundry?: Laundry;
};

const LaundryEntriesConfirmationModal = ({
  show,
  toggle,
  onConfirm,
  onCancel,
  onExited,
  action,
  selectedLaundry,
}: Props) => {
  const [gcashConfirmation, setGcashConfirmation] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const { user } = useContext(UserContext);
  const change = +paymentAmount - (selectedLaundry?.totalAmount ?? 0);

  const handleCancel = () => {
    toggle(false);
    onCancel?.();
  };

  const handleClaim = async (payment?: 'cash' | 'gcash') => {
    if (!selectedLaundry || !user) return;
    const { isSuccess, result, message } = await claimLaundry({
      _id: selectedLaundry._id,
      payment,
      claimedBy: user.username,
      claimedById: user._id,
    });
    if (isSuccess && result) {
      onConfirm(result);
      toast.success(message);
    } else {
      toast.error(message);
    }
  };

  const handleDelete = async () => {
    if (!selectedLaundry) return;
    const { isSuccess, message } = await deleteLaundry(selectedLaundry._id);
    if (isSuccess) {
      onConfirm();
      toast.success(message);
    } else {
      toast.error(message);
    }
  };

  const handleConfirm = (e: FormEvent) => {
    e.preventDefault();
    if (action === 'claim') {
      handleClaim();
    } else {
      handleDelete();
    }
    toggle(false);
  };

  const onShow = () => {
    setPaymentAmount('');
  };

  return (
    <>
      <ConfirmationModal
        show={gcashConfirmation}
        toggle={setGcashConfirmation}
        onConfirm={() => handleClaim('gcash')}
        onCancel={() => toggle(true)}
        message={
          <p className="text-center">
            Are you sure to pay with{' '}
            <span className="text-primary fw-bold">GCash</span> amounting{' '}
            <span className="text-primary fw-bold">
              {pesoFormat(selectedLaundry?.totalAmount ?? 0)}
            </span>
          </p>
        }
      />
      <Modal
        show={show}
        onShow={onShow}
        onHide={() => toggle(false)}
        onExited={onExited}
        backdrop="static"
        centered
      >
        <Form onSubmit={handleConfirm}>
          <Modal.Header>
            <Modal.Title className="fw-bold text-center d-block w-100 text-capitalize">
              {action} Confirmation
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p className="text-center">
              Are you sure to {action} laundry of{' '}
              <b>{selectedLaundry?.customer}</b>?
            </p>
            {!selectedLaundry?.isPaid && action === 'claim' && (
              <>
                <p className="text-center m-0">
                  Amount to Pay:{' '}
                  <strong>
                    {pesoFormat(selectedLaundry?.totalAmount ?? 0)}
                  </strong>
                </p>
                <p className="text-center">
                  Change: <strong>{pesoFormat(Math.max(change, 0))}</strong>
                </p>
                <FormGroup className="mb-3 px-3">
                  <FormLabel className="d-block fw-bold text-center">
                    Payment Amount
                  </FormLabel>
                  <FormControl
                    className="text-center"
                    type="number"
                    step="0.01"
                    min={selectedLaundry?.totalAmount}
                    placeholder="Enter amount"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    tabIndex={0}
                    required
                  />
                </FormGroup>
              </>
            )}
          </Modal.Body>
          <Modal.Footer className="d-flex justify-content-between">
            <div>
              {!selectedLaundry?.isPaid && action === 'claim' && (
                <Button
                  variant="outline-primary me-2"
                  size="sm"
                  onClick={() => {
                    setGcashConfirmation(true);
                    toggle(false);
                  }}
                >
                  GCash Payment
                </Button>
              )}
            </div>

            <div>
              <Button
                variant="secondary"
                onClick={handleCancel}
                className="me-2"
              >
                Cancel
              </Button>
              <Button variant="primary" type="submit" tabIndex={0}>
                Confirm
              </Button>
            </div>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default LaundryEntriesConfirmationModal;
