/* eslint-disable react/no-unstable-nested-components */
import { Laundry } from 'globalTypes/realm/laundry.types';
import { deliveryChargeRecord } from 'globalUtils/constants';
import {
  memo,
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useState,
  useEffect,
} from 'react';
import { Button, Card, Col, Form, FormControl, Row } from 'react-bootstrap';
import { pesoFormat } from 'renderer/utils/helper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPenToSquare,
  faRotateRight,
} from '@fortawesome/free-solid-svg-icons';
import { checkIsDeliveryService } from './serviceOptions';

type Props = {
  loadQty: number;
  subTotal: number;
  addOnsQty: number;
  service: Laundry['service'];
  customer: string;
  isPaid: boolean;
  paymentAmount: string;
  setPaymentAmount: Dispatch<SetStateAction<string>>;
  deliveryCharge: number;
  setDeliveryCharge: Dispatch<SetStateAction<number>>;
};

const PaymentCard = ({
  loadQty,
  addOnsQty,
  subTotal,
  service,
  customer,
  isPaid,
  paymentAmount,
  setPaymentAmount,
  deliveryCharge,
  setDeliveryCharge,
}: Props) => {
  const [isEditCharge, setIsEditCharge] = useState(false);
  const [deliveryChargeInput, setDeliveryChargeInput] = useState<
    number | string
  >('');
  const isDeliveryService = checkIsDeliveryService(service);

  // eslint-disable-next-line no-nested-ternary
  const paymentDisplay = isPaid
    ? isDeliveryService
      ? 'On Pickup'
      : 'On Drop-Off'
    : service === 'pickup and delivery'
    ? 'On Delivery'
    : 'On Claim';

  const handlePaymentChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPaymentAmount(e.target.value);
  };

  const onRestore = () => {
    if (!checkIsDeliveryService(service)) return;
    setDeliveryCharge(deliveryChargeRecord[service]);
  };

  useEffect(() => {
    setDeliveryChargeInput(deliveryCharge);
  }, [deliveryCharge]);

  return (
    <Card>
      <Card.Body>
        <Row className="mb-2">
          <Col xs="6">service:</Col>
          <Col xs="6">
            <p className="m-0 mb-1 text-end text-capitalize">{service}</p>
          </Col>

          <Col xs="6">customer:</Col>
          <Col xs="6">
            <p className="m-0 mb-1 text-end">{customer}</p>
          </Col>
          {checkIsDeliveryService(service) && (
            <div className="mt-1 mb-2 d-flex justify-content-between align-items-center">
              <div>delivery charge:</div>
              <div className="d-flex justify-content-end align-items-center">
                {(deliveryCharge !== deliveryChargeRecord[service] ||
                  isEditCharge) && (
                  <FontAwesomeIcon
                    icon={faRotateRight}
                    title="Restore default"
                    className="me-1 cursor-pointer"
                    onClick={onRestore}
                  />
                )}
                {!isEditCharge && (
                  <FontAwesomeIcon
                    icon={faPenToSquare}
                    title="Edit charge"
                    className="cursor-pointer"
                    onClick={() => setIsEditCharge(true)}
                  />
                )}
                <div
                  className="ms-2 d-flex justify-content-end"
                  style={{ position: 'relative' }}
                >
                  <p
                    className={`my-0 text-end ${isEditCharge && 'invisible'} ${
                      deliveryCharge !== deliveryChargeRecord[service] &&
                      'text-danger'
                    }`}
                  >
                    {pesoFormat(deliveryCharge)}
                  </p>
                  {isEditCharge && (
                    <FormControl
                      style={{
                        width: '100%',
                        position: 'absolute',
                        top: -5,
                        left: 0,
                      }}
                      size="sm"
                      className="mb-3 d-inline"
                      type="number"
                      value={deliveryChargeInput}
                      onChange={(e) => setDeliveryChargeInput(e.target.value)}
                      onBlur={() => {
                        setIsEditCharge(false);
                        setDeliveryCharge(+deliveryChargeInput);
                      }}
                      autoFocus
                    />
                  )}
                </div>
              </div>
            </div>
          )}
          {loadQty > 0 && (
            <>
              <Col xs="6">loads:</Col>
              <Col xs="6">
                <p className="m-0 mb-1 text-end">{loadQty}</p>
              </Col>

              <Col xs="6">add-ons:</Col>
              <Col xs="6">
                <p className="m-0 mb-1 text-end">{addOnsQty}</p>
              </Col>

              <Col xs="6">payment:</Col>
              <Col xs="6">
                <p className="m-0 mb-1 text-end">{paymentDisplay}</p>
              </Col>

              <Col xs="6">subtotal:</Col>
              <Col xs="6">
                <p className="m-0  mb-1 text-end">
                  <strong>{pesoFormat(subTotal)}</strong>
                </p>
              </Col>
              {isPaid && (
                <>
                  <Col xs="6">payment amount:</Col>
                  <Col xs="6">
                    <p className="m-0  mb-1 text-end">
                      {pesoFormat(+paymentAmount)}
                    </p>
                  </Col>
                </>
              )}
            </>
          )}
          {/* <Col xs="6">change:</Col>
            <Col xs="6">
              <p className="m-0  mb-1 text-end">
                <strong>{pesoFormat(change < 0 ? 0 : change)}</strong>
              </p>
            </Col> */}
        </Row>
        {isPaid && (
          <Form.Group className="mb-3">
            <Form.Label className="d-block fw-bold text-center">
              Payment Amount
            </Form.Label>
            <Form.Control
              className="text-center"
              type="number"
              min={subTotal}
              placeholder="Enter amount"
              value={paymentAmount}
              onChange={handlePaymentChange}
              tabIndex={0}
              required
            />
          </Form.Group>
        )}
        <div className="mt-2 d-flex">
          <Button
            className="w-100"
            variant="primary"
            type="submit"
            // eslint-disable-next-line jsx-a11y/tabindex-no-positive
            tabIndex={1}
          >
            Submit
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default memo(PaymentCard);
