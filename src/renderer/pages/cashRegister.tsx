import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Product } from 'main/service/productsRealm';
import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { Card, Col, Row, Table } from 'react-bootstrap';
import { useOutletContext } from 'react-router-dom';
import { toast } from 'react-toastify';
import { SelectInstance } from 'react-select/dist/declarations/src';
import PaymentCard from 'renderer/components/cashRegister/paymentCard';
import PaymentConfirmationModal from 'renderer/components/cashRegister/paymentConfirmationModal';
import QuantityInputModal from 'renderer/components/cashRegister/quantityInputModal';
import { getProducts } from 'renderer/service/products';
import { debounce, pesoFormat } from 'renderer/utils/helper';
import ProductsSelect from 'renderer/components/cashRegister/productsSelect';
import useCashRegisterStore from 'renderer/store/cashRegisterStore';
import { BarcodeContext } from './home';

type Opt = {
  value: string;
  label: string;
  product: Product;
};

const handleGetProducts = debounce(async (searchText: string) => {
  return getProducts({
    searchText,
    sortProp: 'last_transaction_date',
    limit: 20,
  });
}, 300);

function CashRegisterPage() {
  const [showInputQuantityModal, setShowInputQuantityModal] = useState(false);
  const [showPaymentConfirmationModal, setShowPaymentConfirmationModal] =
    useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product>();
  const [selectedItem, setSelectedItem] = useState<Product | undefined>();
  const [paymentAmount, setPaymentAmount] = useState('');
  const [selectInputValue, setSelectInputValue] = useState('');
  const [items, setItems] = useState<
    Record<string, Product & { totalPrice: number }>
  >({});
  const [productsSrc, setProductsSrc] = useState<Record<string, Product>>({});
  const productSelectRef = useRef<SelectInstance<Opt> | null>(null);
  const itemKeys = useMemo(() => Object.keys(items), [items]);
  const { barcode, setBarcode } = useOutletContext<BarcodeContext>();
  const [lastUpdatedId, setLastUpdatedId] = useState('');
  const { setHasItems } = useCashRegisterStore((state) => state);

  const handleSelect = (product: Product) => {
    const prod = { ...product };
    setSelectedItem(undefined);
    if (prod) {
      const itemQuantity = items[product._id]?.quantity ?? 0;
      prod.quantity -= itemQuantity;
    }
    setShowInputQuantityModal(true);
    setSelectedProduct(prod);
  };

  const handleSetItems = useMemo(
    () => (item: Product, quantity: number, isEdit?: boolean) => {
      setLastUpdatedId(item._id);
      if (items[item._id]) {
        const itemQuantity = isEdit
          ? quantity
          : items[item._id].quantity + quantity;
        const { price } = items[item._id];
        setItems({
          ...items,
          [item._id]: {
            ...item,
            quantity: itemQuantity,
            totalPrice: price * itemQuantity,
          },
        });
        return;
      }
      const product = { ...item, totalPrice: item.price * quantity };
      product.quantity = quantity;
      const newItems = { ...items, [item._id]: product };
      setItems(newItems);
      setProductsSrc({ ...productsSrc, [item._id]: item });
      setHasItems(true);
    },
    [items, productsSrc, setHasItems]
  );

  const handleConfirmQuantity = useCallback(
    async (
      quantity: string | number,
      isEdit?: boolean
    ): Promise<undefined | void> => {
      if (!selectedProduct) return;
      handleSetItems(selectedProduct, +quantity, isEdit);
    },
    [selectedProduct, handleSetItems]
  );

  useEffect(() => {
    productSelectRef.current?.focus();
  }, [items]);

  useEffect(() => {
    (async () => {
      if (barcode) {
        const response = await handleGetProducts(barcode);
        setBarcode('');
        if (response?.isSuccess && response.result) {
          if (!response.result.length) {
            toast.error('Barcode not found!');
            return;
          }
          handleSetItems(response.result[0], 1);
        } else {
          toast.error(response.message);
        }
      }
    })();
  }, [barcode, setBarcode, handleSetItems]);

  return (
    <>
      <QuantityInputModal
        show={showInputQuantityModal}
        toggle={setShowInputQuantityModal}
        product={selectedProduct}
        onConfirm={handleConfirmQuantity}
        selectedItem={selectedItem} // item to edit
      />
      <PaymentConfirmationModal
        show={showPaymentConfirmationModal}
        toggle={setShowPaymentConfirmationModal}
        items={items}
        onCancel={useCallback(() => {
          setPaymentAmount('');
          setItems({});
          setHasItems(false);
        }, [setHasItems])}
        paymentAmount={+paymentAmount}
        onSuccess={useCallback(() => {
          setPaymentAmount('');
          setItems({});
          setHasItems(false);
        }, [setHasItems])}
        onExited={useCallback(() => {
          setTimeout(() => productSelectRef.current?.focus(), 50);
        }, [])}
      />
      <div>
        <h3>Cash Register</h3>

        <ProductsSelect
          ref={productSelectRef}
          inputValue={selectInputValue}
          onInputChange={setSelectInputValue}
          onSelect={handleSelect}
        />
        <Row className="my-3">
          <Col lg="8" style={{ position: 'relative' }}>
            <Card style={{ minHeight: '100%' }}>
              <Card.Body>
                <Table size="sm" hover>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th className="text-center">Quantity</th>
                      <th className="text-center">Price</th>
                      <th className="text-center">Total Price</th>
                      <th> </th>
                    </tr>
                  </thead>
                  <tbody>
                    {itemKeys.map((key) => (
                      <tr
                        key={items[key]._id}
                        className={
                          lastUpdatedId === items[key]._id ? 'fw-bold' : ''
                        }
                      >
                        <td className="align-middle text-capitalize">
                          {items[key].name}
                        </td>
                        <td className="align-middle text-center">
                          {items[key].quantity}
                        </td>
                        <td className="align-middle text-center">
                          {pesoFormat(items[key].price)}
                        </td>
                        <td className="align-middle text-center">
                          {pesoFormat(items[key].totalPrice)}
                        </td>
                        <td className="align-middle text-center">
                          <FontAwesomeIcon
                            onClick={() => {
                              setShowInputQuantityModal(true);
                              handleSelect(productsSrc[key]);
                              setSelectedItem(items[key]);
                            }}
                            icon={faPenToSquare}
                            title="Edit"
                            className="me-2 cursor-pointer"
                          />
                          {/* <FontAwesomeIcon
                            title="remove"
                            icon={faXmark}
                            className="btn"
                            onClick={() => handleDeleteItem(key)}
                          /> */}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                {itemKeys.length === 0 && (
                  <span className="ms-2 fw-light fst-italic text-secondary">
                    no items
                  </span>
                )}
              </Card.Body>
            </Card>
          </Col>
          <Col lg="4">
            <PaymentCard
              items={items}
              paymentAmount={paymentAmount}
              setPaymentAmount={setPaymentAmount}
              onReset={useCallback(() => {
                setPaymentAmount('');
                setItems({});
                setHasItems(false);
              }, [setHasItems])}
              onPayment={useCallback(() => {
                setShowPaymentConfirmationModal(true);
              }, [])}
            />
          </Col>
        </Row>
      </div>
    </>
  );
}

export default CashRegisterPage;
