import { Product } from 'main/service/productsRealm';
import { FormEvent, useState } from 'react';
import { Button, Form, Modal, Col, Row } from 'react-bootstrap';

export type Props = {
  show: boolean;
  toggle: (show: boolean) => void;
  product?: Product;
  onConfirm?: (quantity: number | string, isEdit?: boolean) => void;
  onCancel?: () => void;
  selectedItem?: Product;
};

const QuantityInputModal = ({
  show,
  toggle,
  product,
  onConfirm,
  onCancel,
  selectedItem, // item to edit
}: Props) => {
  const [quantity, setQuantity] = useState<number | string>(1);
  const [initQty, setInitQty] = useState(0);
  const productQty = product?.quantity ?? 0;
  const remaining = selectedItem
    ? productQty + initQty - +quantity // if edit qty
    : productQty; // if add qty

  const max = selectedItem ? productQty + initQty : productQty;

  const handleCancel = () => {
    toggle(false);
    onCancel?.();
  };

  const handleConfirm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(false);
    onConfirm?.(quantity, !!selectedItem);
  };

  const onShow = () => {
    setQuantity(selectedItem?.quantity ?? 1);
    selectedItem && setInitQty(selectedItem?.quantity);
  };

  return (
    <Modal
      show={show}
      onHide={() => toggle(false)}
      onShow={onShow}
      size="sm"
      centered
    >
      <Form onSubmit={handleConfirm}>
        <Modal.Header>
          <Modal.Title className="w-100 text-center fw-bold text-capitalize">
            {product?.name}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {product?.barcode && (
            <Row className="mx-1">
              <Col xs="6">
                <p className="m-0">Barcode:</p>
              </Col>
              <Col xs="6">
                <p className="m-0 text-end">{product.barcode}</p>
              </Col>
            </Row>
          )}
          <Row className="mx-1">
            <Col xs="6">
              <p className="m-0">Remaining:</p>
            </Col>
            <Col xs="6">
              <p className="m-0 text-end">{remaining.toLocaleString()}</p>
            </Col>
          </Row>
          {product?.description && (
            <Row className="mx-1">
              <Col xs="6">
                <p className="m-0">Description:</p>
              </Col>
              <Col xs="6" className="d-flex justify-content-end">
                <p className="m-0 d-inline">{product.description}</p>
              </Col>
            </Row>
          )}
          <Form.Group className="m-3">
            <Form.Label className="d-block fw-bold text-center">
              {selectedItem ? 'Edit' : 'Add'} Quantity of Items
            </Form.Label>
            <Form.Control
              className="text-center"
              type="number"
              min="1"
              placeholder="Enter quantity"
              max={max}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              autoFocus
              required
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancel}>
            Close
          </Button>
          <Button variant="primary" type="submit">
            Ok
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default QuantityInputModal;
