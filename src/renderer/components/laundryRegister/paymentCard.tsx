/* eslint-disable react/no-unstable-nested-components */
import { Laundry } from 'globalTypes/realm/laundry.types';
import { deliveryChargeRecord } from 'globalUtils/constants';
import { memo, ChangeEvent, Dispatch, SetStateAction } from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { pesoFormat } from 'renderer/utils/helper';
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
};

const PaymentCard = ({
  loadQty,
  addOnsQty,
  subTotal,
  service,
  customer,
  isPaid,
  // addOnsQty,
  paymentAmount,
  setPaymentAmount,
}: Props) => {
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
            <>
              <Col xs="6">delivery charge:</Col>
              <Col xs="6">
                <p className="m-0 mb-1 text-end">
                  {pesoFormat(deliveryChargeRecord[service])}
                </p>
              </Col>
            </>
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
