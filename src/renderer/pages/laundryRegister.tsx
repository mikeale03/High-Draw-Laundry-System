/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-plusplus */
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Product } from 'globalTypes/realm/products.types';
import {
  FormEvent,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Button,
  Card,
  Col,
  FormCheck,
  FormControl,
  FormGroup,
  FormLabel,
  Row,
  Form,
} from 'react-bootstrap';
import { toast } from 'react-toastify';
import ProductsSelect from 'renderer/components/cashRegister/productsSelect';
import QuantityInputModal from 'renderer/components/cashRegister/quantityInputModal';
import CustomerSelect, {
  CustomerSelectOption,
} from 'renderer/components/common/selects/customerSelect';
import AddOnItemsTable from 'renderer/components/laundryRegister/addOnItemsTable';
import PaymentCard from 'renderer/components/laundryRegister/paymentCard';
import SubmitConfirmationModal from 'renderer/components/laundryRegister/submitConfirmationModal';
import UserContext from 'renderer/context/userContext';
import { createLaundry } from 'renderer/service/laundry';
import { laundryServicePriceRecord } from 'renderer/utils/constants';
import { twoDecimals } from 'renderer/utils/helper';

let keyCtr = 1;

const LaundryRegisterPage = () => {
  const [loads, setLoads] = useState<
    {
      key: number;
      value: number | string;
    }[]
  >([{ key: 1, value: '' }]);
  const [service, setService] = useState<'drop-off' | 'self-service'>(
    'drop-off'
  );
  const [productSelectInputValue, setProductSelectInputValue] = useState('');
  const [showInputQuantityModal, setShowInputQuantityModal] = useState(false);
  const [showSubmitConfirmation, setShowSubmitConfirmation] = useState(false);
  const [selectedAddOnProduct, setSelectedAddOnProduct] = useState<Product>();
  const [addOnItems, setAddOnItems] = useState<
    Record<string, Product & { totalPrice: number }>
  >({});
  const [productsSrc, setProductsSrc] = useState<Record<string, Product>>({});
  const [selectedItem, setSelectedItem] = useState<Product | undefined>(); // add on item to edit
  const [lastUpdatedId, setLastUpdatedId] = useState('');
  const [customer, setCustomer] = useState('');
  const [customerNumber, setCustomerNumber] = useState('');
  const [payment, setPayment] = useState<'unpaid' | 'paid'>('paid');
  const [paymentAmount, setPaymentAmount] = useState(0);
  const dropOffOptionRef = useRef<HTMLDivElement>(null);
  const { user } = useContext(UserContext);

  const itemsKeys = Object.keys(addOnItems);
  const addOnsQty = itemsKeys.length;

  const subTotal = useMemo(() => {
    let t = 0;
    itemsKeys.forEach((k) => {
      t += addOnItems[k].totalPrice;
    });
    const servicePrice = laundryServicePriceRecord[service] * loads.length;
    return twoDecimals(t + servicePrice);
  }, [itemsKeys, addOnItems, service, loads.length]);

  const handleAddLoad = () => {
    setLoads([...loads, { key: ++keyCtr, value: '' }]);
  };

  const handleLoadChange = (update: { key: number; value: string }) => {
    setLoads(loads.map((v) => (v.key === update.key ? update : v)));
  };

  const handleDeleteLoad = (key: number) => {
    setLoads(loads.filter((v) => v.key !== key));
  };

  const handleProductSelect = (product: Product) => {
    const prod = { ...product };
    setSelectedItem(undefined);
    if (prod) {
      const itemQuantity = addOnItems[product._id]?.quantity ?? 0;
      prod.quantity -= itemQuantity;
    }
    setShowInputQuantityModal(true);
    setSelectedAddOnProduct(prod);
  };

  const handleShowQuantityInputModal = (
    product: Product,
    item: Product & { totalPrice: number }
  ) => {
    setShowInputQuantityModal(true);
    setSelectedItem(item);
    setSelectedAddOnProduct(product);
  };

  const handleSetAddOnItems = useMemo(
    () => (item: Product, quantity: number, isEdit?: boolean) => {
      setLastUpdatedId(item._id);
      if (addOnItems[item._id]) {
        const itemQuantity = isEdit
          ? quantity
          : addOnItems[item._id].quantity + quantity;
        const { price } = addOnItems[item._id];
        setAddOnItems({
          ...addOnItems,
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
      const newItems = { ...addOnItems, [item._id]: product };
      setAddOnItems(newItems);
      setProductsSrc({ ...productsSrc, [item._id]: item });
    },
    [productsSrc, addOnItems]
  );

  const handleConfirmQuantity = useCallback(
    async (
      quantity: string | number,
      isEdit?: boolean
    ): Promise<undefined | void> => {
      if (!selectedAddOnProduct) return;
      handleSetAddOnItems(selectedAddOnProduct, +quantity, isEdit);
    },
    [selectedAddOnProduct, handleSetAddOnItems]
  );

  const handleDeleteItem = (key: keyof typeof addOnItems) => {
    const newItems = { ...addOnItems };
    delete newItems[addOnItems[key]._id];
    setAddOnItems(newItems);
  };

  const handleCustomerSelect = (opt: CustomerSelectOption) => {
    if (opt) {
      const { name, mobile } = opt.customer;
      setCustomer(name);
      mobile && setCustomerNumber(mobile);
    }
  };

  const handleSubmitForm = (e: FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowSubmitConfirmation(true);
  };

  const handleConfirm = async (mode: 'paid' | 'unpaid' | 'gcash') => {
    if (!user) return;
    const { isSuccess, message } = await createLaundry({
      service,
      customer,
      customerNumber,
      loads: loads.map((v) => +v.value),
      addOns: addOnsQty,
      isPaid: mode !== 'unpaid',
      amount: subTotal,
      dropOffDate: new Date(),
      transactBy: user.username,
      transactById: user._id,
    });
    if (!isSuccess) {
      toast.error(message);
      return;
    }
    toast.success(message);
  };

  useEffect(() => {
    dropOffOptionRef.current?.focus();
  }, []);

  return (
    <div className="p-3">
      <QuantityInputModal
        show={showInputQuantityModal}
        toggle={setShowInputQuantityModal}
        product={selectedAddOnProduct}
        onConfirm={handleConfirmQuantity}
        selectedItem={selectedItem} // item to edit
      />
      <SubmitConfirmationModal
        show={showSubmitConfirmation}
        toggle={setShowSubmitConfirmation}
        loadQty={loads.length}
        subTotal={subTotal}
        addOnsQty={addOnsQty}
        customer={customer}
        service={service}
        payment={payment}
        paymentAmount={paymentAmount}
        onConfirm={handleConfirm}
      />

      <h3>Laundry Register</h3>

      <Form onSubmit={handleSubmitForm}>
        <Row>
          <Col lg="8">
            <div className="d-flex mb-3">
              <div
                ref={dropOffOptionRef}
                className={`cursor-pointer rounded-4 bg-white me-3 py-2 px-5 transition-all
              ${
                service === 'drop-off' ? 'border border-primary' : 'text-muted'
              }`}
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setService('drop-off')}
                style={{ width: '250px' }}
                onClick={() => setService('drop-off')}
              >
                <p className="m-0">P{laundryServicePriceRecord['drop-off']}</p>
                <h5 className="m-0">DROP-OFF</h5>
              </div>
              <div
                className={`cursor-pointer rounded-4 bg-white me-3 py-2 px-5  transition-all
              ${
                service === 'self-service'
                  ? 'border border-primary'
                  : 'text-muted'
              }`}
                tabIndex={0}
                onKeyDown={(e) =>
                  e.key === 'Enter' && setService('self-service')
                }
                style={{ width: '250px' }}
                onClick={() => setService('self-service')}
              >
                <p className="m-0">
                  P{laundryServicePriceRecord['self-service']}
                </p>
                <h5>SELF-SERVICE</h5>
              </div>
            </div>

            {loads.map((v, i) => (
              <div key={`${v.key}`} className="d-flex align-items-center mb-2">
                <span>Load #{i + 1} Wt: </span>
                <FormControl
                  size="sm"
                  className="text-center ms-1 no-arrow-input"
                  type="number"
                  step="0.01"
                  max="8"
                  min="0.01"
                  style={{ width: '60px' }}
                  required
                  value={v.value}
                  onChange={(e) =>
                    handleLoadChange({ key: v.key, value: e.target.value })
                  }
                />
                <span className="ms-1 me-3">kg</span>
                {i > 0 && (
                  <FontAwesomeIcon
                    icon={faXmark}
                    className="cursor-pointer text-secondary"
                    onClick={() => handleDeleteLoad(v.key)}
                  />
                )}
              </div>
            ))}
            <div>
              <Button onClick={handleAddLoad}>Add load</Button>
            </div>
            <div className="mt-3 me-3">
              <FormGroup>
                <FormLabel className="fw-bold">Customer</FormLabel>
                <CustomerSelect onSelect={handleCustomerSelect} />
              </FormGroup>
            </div>

            <Row className="my-3 me-3">
              <Col lg="8">
                <FormGroup>
                  <FormLabel className="fw-bold">Add-Ons</FormLabel>
                  <ProductsSelect
                    inputValue={productSelectInputValue}
                    onInputChange={setProductSelectInputValue}
                    onSelect={handleProductSelect}
                  />
                </FormGroup>
              </Col>
              <Col lg="4">
                <FormGroup>
                  <FormLabel className="fw-bold">Payment</FormLabel>
                  <div className="d-flex p-2">
                    <FormCheck
                      className="me-3"
                      label="On Drop-off"
                      name="group1"
                      type="radio"
                      checked={payment === 'paid'}
                      onChange={(e) =>
                        setPayment(e.target.checked ? 'paid' : 'unpaid')
                      }
                    />
                    <FormCheck
                      label="On Claim"
                      name="group1"
                      type="radio"
                      checked={payment === 'unpaid'}
                      onChange={(e) =>
                        setPayment(e.target.checked ? 'unpaid' : 'paid')
                      }
                    />
                  </div>
                </FormGroup>
              </Col>
            </Row>
            <Card style={{ minHeight: '200px' }}>
              <Card.Body>
                <AddOnItemsTable
                  lastUpdatedId={lastUpdatedId}
                  items={addOnItems}
                  onShowInputQuantityModal={handleShowQuantityInputModal}
                  productsSrc={productsSrc}
                  onDelete={handleDeleteItem}
                />
              </Card.Body>
            </Card>
          </Col>
          <Col lg="4">
            <PaymentCard
              addOnsQty={addOnsQty}
              loadQty={loads.length}
              subTotal={subTotal}
              service={service}
              customer={customer}
              payment={payment}
              onPaymentAmountChange={(amount) => setPaymentAmount(amount)}
            />
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default LaundryRegisterPage;
