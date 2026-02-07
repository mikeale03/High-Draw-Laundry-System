import { useState } from 'react';
import { Button, Col, Modal, Row } from 'react-bootstrap';
import { pesoFormat } from 'renderer/utils/helper';
import ConfirmationModal from '../common/modals/confirmation';

type Props = {
  show: boolean;
  toggle: (show: boolean) => void;
  loadQty: number;
  subTotal: number;
  addOnsQty: number;
  service: 'drop-off' | 'self-service';
  customer: string;
  payment: 'paid' | 'unpaid';
  paymentAmount: number;
  // onCancel?: () => void;
  // onSuccess?: () => void;
  // onExited?: () => void;
  // onError?: () => void;
};

const SubmitConfirmationModal = ({
  show,
  toggle,
  loadQty,
  subTotal,
  addOnsQty,
  customer,
  service,
  payment,
  paymentAmount,
}: Props) => {
  const [showGcashConfirmation, setShowGcashConfirmation] = useState(false);

  const onHide = () => {
    toggle(false);
  };

  const change = paymentAmount - subTotal;
  const paymentDisplay = payment === 'paid' ? 'On Drop-Off' : 'On Claim';

  const handleShowGcashConfirmation = () => {
    onHide();
    setShowGcashConfirmation(true);
  };

  const handleCashPayment = () => {};

  const handleGcashPayment = () => {};

  const message = (
    <p className="text-center">
      Are you sure to pay with{' '}
      <span className="text-primary fw-bold">GCash</span> amounting{' '}
      <span className="text-primary fw-bold">{pesoFormat(subTotal)}</span>
    </p>
  );

  return (
    <>
      <ConfirmationModal
        show={showGcashConfirmation}
        toggle={setShowGcashConfirmation}
        onConfirm={handleGcashPayment}
        onCancel={() => toggle(true)}
        message={message}
      />
      <Modal show={show} onHide={onHide} backdrop="static" centered>
        <Modal.Header>
          <Modal.Title className="fw-bold text-center d-block w-100">
            Confirmation
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="mb-2">
            <Col xs="6" className="fs-5">
              service:
            </Col>
            <Col xs="6">
              <p className="m-0 mb-1 fs-5 text-end text-capitalize">
                <strong>{service}</strong>
              </p>
            </Col>

            <Col xs="6" className="fs-5">
              Customer:
            </Col>
            <Col xs="6">
              <p className="m-0 mb-1 fs-5 text-end">
                <strong>{customer}</strong>
              </p>
            </Col>

            <Col xs="6" className="fs-5">
              loads:
            </Col>
            <Col xs="6">
              <p className="m-0 mb-1 fs-5 text-end">
                <strong>{loadQty}</strong>
              </p>
            </Col>

            <Col xs="6" className="fs-5">
              add-ons:
            </Col>
            <Col xs="6">
              <p className="m-0 mb-1 fs-5 text-end">
                <strong>{addOnsQty}</strong>
              </p>
            </Col>

            <Col xs="6" className="fs-5">
              payment:
            </Col>
            <Col xs="6">
              <p className="m-0 mb-1 fs-5 text-end">
                <strong>{paymentDisplay}</strong>
              </p>
            </Col>

            <Col xs="6" className="fs-5">
              subtotal:
            </Col>
            <Col xs="6">
              <p className="m-0 mb-1 fs-5 text-end">
                <strong>{pesoFormat(subTotal)}</strong>
              </p>
            </Col>
            {payment === 'paid' && (
              <>
                <Col xs="6" className="fs-5">
                  payment amount:
                </Col>
                <Col xs="6">
                  <p className="m-0 mb-1 fs-5 text-end">
                    <strong>{pesoFormat(paymentAmount)}</strong>
                  </p>
                </Col>
                <Col xs="6" className="fs-5">
                  change:
                </Col>
                <Col xs="6">
                  <p className="m-0 mb-1 fs-3 text-end">
                    <strong>{pesoFormat(change < 0 ? 0 : change)}</strong>
                  </p>
                </Col>
              </>
            )}
          </Row>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-between">
          <div>
            {payment === 'paid' && (
              <Button
                variant="outline-primary me-2"
                size="sm"
                onClick={handleShowGcashConfirmation}
              >
                GCash Payment
              </Button>
            )}
          </div>

          <div>
            <Button variant="secondary" onClick={onHide} className="me-2">
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => handleCashPayment()}
              tabIndex={0}
            >
              Confirm
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default SubmitConfirmationModal;
