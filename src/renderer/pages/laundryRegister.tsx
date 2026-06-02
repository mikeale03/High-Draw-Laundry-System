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
import { v4 as uuid } from 'uuid';
import ProductsSelect from 'renderer/components/cashRegister/productsSelect';
import QuantityInputModal from 'renderer/components/cashRegister/quantityInputModal';
import CustomerSelect, {
  CustomerSelectOption,
} from 'renderer/components/common/selects/customerSelect';
import AddOnItemsTable from 'renderer/components/laundryRegister/addOnItemsTable';
import PaymentCard from 'renderer/components/laundryRegister/paymentCard';
import SubmitConfirmationModal from 'renderer/components/laundryRegister/submitConfirmationModal';
import UserContext from 'renderer/context/userContext';
import {
  createLaundry,
  updatePickupDeliveryLaundry,
} from 'renderer/service/laundry';
import { twoDecimals } from 'renderer/utils/helper';
import {
  deliveryChargeRecord,
  laundryServicePriceRecord,
} from 'globalUtils/constants';
import {
  DeliveryStatus,
  Laundry,
  LaundryService,
} from 'globalTypes/realm/laundry.types';
import ServiceOptions from 'renderer/components/laundryRegister/serviceOptions';
import { useLocation, useNavigate } from 'react-router-dom';

let keyCtr = 1;

const checkIsDeliveryService = (service: LaundryService) =>
  service === 'pickup and delivery' || service === 'pickup only';

const checkIsSelfService = (service: LaundryService) =>
  service === 'wash and dry' || service === 'wash only';

const LaundryRegisterPage = () => {
  const [loads, setLoads] = useState<
    {
      key: number;
      value: number | string;
    }[]
  >([{ key: 1, value: '' }]);
  const [service, setService] = useState<LaundryService>('drop-off');
  const [productSelectInputValue, setProductSelectInputValue] = useState('');
  const [showInputQuantityModal, setShowInputQuantityModal] = useState(false);
  const [showSubmitConfirmation, setShowSubmitConfirmation] = useState(false);
  const [selectedAddOnProduct, setSelectedAddOnProduct] = useState<Product>();
  const [addOnItems, setAddOnItems] = useState<
    Record<string, Product & { totalPrice: number }>
  >({});
  const [refetchProductSelectOpts, setRefetchProductSelectOpts] =
    useState(false);
  const [productsSrc, setProductsSrc] = useState<Record<string, Product>>({});
  const [selectedItem, setSelectedItem] = useState<Product | undefined>(); // add on item to edit
  const [lastUpdatedId, setLastUpdatedId] = useState('');
  const [customer, setCustomer] = useState('');
  const [customerSelectValue, setCustomerSelectValue] =
    useState<CustomerSelectOption | null>(null);
  const [customerNumber, setCustomerNumber] = useState('');
  const [isPaid, setIsPaid] = useState(true);
  // const [payment, setPayment] = useState<'cash' | 'gcash'>('cash');
  const [paymentAmount, setPaymentAmount] = useState('');
  const { user } = useContext(UserContext);
  const { state } = useLocation();
  const navigate = useNavigate();
  const laundryEdit = state as Laundry;
  const itemsKeys = Object.keys(addOnItems);
  const addOnsQty = itemsKeys.length;
  const servicePrice = laundryServicePriceRecord[service];
  const totalServicePrice = twoDecimals(loads.length * servicePrice);
  const isShowLoads = !!laundryEdit || !checkIsDeliveryService(service);

  const addOnsPrice = useMemo(() => {
    let t = 0;
    itemsKeys.forEach((k) => {
      t += addOnItems[k].totalPrice;
    });
    return twoDecimals(t);
  }, [itemsKeys, addOnItems]);

  const deliveryCharge = checkIsDeliveryService(service)
    ? deliveryChargeRecord[service]
    : 0;

  const subTotal = twoDecimals(
    addOnsPrice + totalServicePrice + deliveryCharge
  );

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
    setCustomerSelectValue(opt);
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

  const handleServiceSelect = (ser: LaundryService) => {
    if (checkIsDeliveryService(ser)) {
      setIsPaid(false);
      setLoads([]);
    } else if (checkIsDeliveryService(service)) {
      setLoads([{ key: 1, value: '' }]);
    }
    if (checkIsSelfService(ser)) {
      setIsPaid(true);
    }
    setPaymentAmount('');
    setService(ser);
  };

  const handleConfirm = async (payment: 'cash' | 'gcash') => {
    if (!user) return;
    const { isSuccess, message } = laundryEdit
      ? await updatePickupDeliveryLaundry({
          _id: laundryEdit._id,
          service,
          loads: loads.map((v) => +v.value),
          addOns: Object.values(addOnItems).map((v) => ({
            productId: v._id,
            productName: v.name,
            quantity: v.quantity,
            price: v.price,
            totalPrice: v.totalPrice,
          })),
          addOnsPrice,
          deliveryCharge,
          deliveryStatus: 'on process',
          isPaid,
          payment: isPaid ? payment : undefined,
          totalAmount: subTotal,
          transactBy: user.username,
          transactById: user._id,
        })
      : await createLaundry({
          service,
          servicePrice,
          customer,
          customerNumber,
          loads: loads.map((v) => +v.value),
          addOns: Object.values(addOnItems).map((v) => ({
            productId: v._id,
            productName: v.name,
            quantity: v.quantity,
            price: v.price,
            totalPrice: v.totalPrice,
          })),
          addOnsPrice,
          deliveryCharge,
          deliveryStatus: checkIsDeliveryService(service)
            ? 'for pickup'
            : undefined,
          isPaid,
          payment: isPaid ? payment : undefined,
          totalAmount: subTotal,
          dropOffDate: new Date(),
          transactBy: user.username,
          transactById: user._id,
          transactionId: uuid(),
        });

    if (!isSuccess) {
      toast.error(message);
      return;
    }
    toast.success(message);
    setService('drop-off');
    setShowSubmitConfirmation(false);
    setLoads([{ key: 1, value: '' }]);
    setCustomer('');
    setCustomerSelectValue(null);
    setAddOnItems({});
    setPaymentAmount('');
    setIsPaid(true);
    setRefetchProductSelectOpts(true);

    if (laundryEdit) {
      navigate('/home/laundry-entries');
    }
  };

  useEffect(() => {
    console.log(laundryEdit);
    if (laundryEdit) {
      const { customer: c, customerNumber: cn, service: s } = laundryEdit;
      setCustomer(c);
      setCustomerSelectValue({
        label: `${c} ${cn && `- cell#: ${cn}`}`,
        value: c,
        customer: c as any,
      });
      setService(s);
    } else {
      setCustomer('');
      setCustomerSelectValue(null);
      setAddOnItems({});
      setPaymentAmount('');
      setIsPaid(true);
      setService('drop-off');
      setLoads([{ key: 1, value: '' }]);
    }
  }, [laundryEdit]);

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
        isPaid={isPaid}
        paymentAmount={+paymentAmount}
        onConfirm={handleConfirm}
      />

      <h3>{laundryEdit ? 'Pickup And Delivery Update' : 'Laundry Register'}</h3>
      {!!laundryEdit && <p className="fw-bold">ID: {laundryEdit.laundryId}</p>}

      <Form onSubmit={handleSubmitForm}>
        <Row>
          <Col lg="8">
            {!laundryEdit && (
              <ServiceOptions
                service={service}
                onSelect={handleServiceSelect}
                deliveryOnly={!!laundryEdit}
              />
            )}

            {isShowLoads && (
              <>
                {loads.map((v, i) => (
                  <div
                    key={`${v.key}`}
                    className="d-flex align-items-center mt-2 mb-2"
                  >
                    <span>Load #{i + 1} Wt: </span>
                    <FormControl
                      size="sm"
                      className="text-center ms-1 no-arrow-input"
                      type="number"
                      step="0.01"
                      min="0.01"
                      style={{ width: '60px' }}
                      required
                      value={v.value}
                      onChange={(e) =>
                        handleLoadChange({
                          key: v.key,
                          value: e.target.value,
                        })
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
              </>
            )}
            <div className="my-3 me-3">
              <FormGroup>
                <FormLabel className="fw-bold">Customer</FormLabel>
                <CustomerSelect
                  value={customerSelectValue}
                  onSelect={handleCustomerSelect}
                  disabled={!!laundryEdit}
                />
              </FormGroup>
            </div>
            <div className="d-flex">
              {checkIsDeliveryService(service) && (
                <FormGroup className="me-5">
                  <FormLabel className="fw-bold">
                    Pickup and Delivery Option
                  </FormLabel>
                  <div className="d-flex">
                    <div onClick={() => setService('pickup and delivery')}>
                      <FormCheck
                        className="me-3"
                        label="Pickup and Delivery"
                        type="radio"
                        checked={service === 'pickup and delivery'}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setService('pickup and delivery');
                          }
                        }}
                      />
                    </div>
                    <div onClick={() => setService('pickup only')}>
                      <FormCheck
                        label="Pickup Only"
                        type="radio"
                        checked={service === 'pickup only'}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setService('pickup only');
                          }
                        }}
                      />
                    </div>
                  </div>
                </FormGroup>
              )}
              {(service === 'drop-off' ||
                (laundryEdit && !checkIsSelfService(service))) && (
                <FormGroup className="me-5">
                  <FormLabel className="fw-bold">Payment</FormLabel>
                  <div className="d-flex">
                    <div onClick={() => setIsPaid(true)}>
                      <FormCheck
                        className="me-3"
                        label={
                          <span className="cursor-pointer">
                            {checkIsDeliveryService(service)
                              ? 'On Pickup'
                              : 'On Drop-Off'}
                          </span>
                        }
                        name="group1"
                        type="radio"
                        checked={isPaid}
                        onChange={(e) => {
                          setIsPaid(e.target.checked);
                          setPaymentAmount('');
                        }}
                      />
                    </div>
                    <div onClick={() => setIsPaid(false)}>
                      <FormCheck
                        label={
                          <span className="cursor-pointer">
                            {service === 'pickup and delivery'
                              ? 'On Delivery'
                              : 'On Claim'}
                          </span>
                        }
                        name="group1"
                        type="radio"
                        checked={!isPaid}
                        onChange={(e) => {
                          setIsPaid(!e.target.checked);
                          setPaymentAmount('');
                        }}
                      />
                    </div>
                  </div>
                </FormGroup>
              )}
              {checkIsSelfService(service) && (
                <FormGroup>
                  <FormLabel className="fw-bold">Self-Service Option</FormLabel>
                  <div className="d-flex">
                    <div onClick={() => setService('wash and dry')}>
                      <FormCheck
                        className="me-3"
                        label="Wash And Dry"
                        type="radio"
                        checked={service === 'wash and dry'}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setService('wash and dry');
                          }
                        }}
                      />
                    </div>
                    <div onClick={() => setService('wash and dry')}>
                      <FormCheck
                        label="Wash Only"
                        type="radio"
                        checked={service === 'wash only'}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setService('wash only');
                          }
                        }}
                      />
                    </div>
                  </div>
                </FormGroup>
              )}
            </div>
            {(laundryEdit || !checkIsDeliveryService(service)) && (
              <>
                <div className="my-3 me-3">
                  <FormGroup>
                    <FormLabel className="fw-bold">Add-Ons</FormLabel>
                    <ProductsSelect
                      inputValue={productSelectInputValue}
                      onInputChange={setProductSelectInputValue}
                      onSelect={handleProductSelect}
                      refetchOptions={refetchProductSelectOpts}
                      setRefetchOptions={setRefetchProductSelectOpts}
                    />
                  </FormGroup>
                </div>
                <Card className="mt-3" style={{ minHeight: '200px' }}>
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
              </>
            )}
          </Col>
          <Col lg="4">
            <PaymentCard
              addOnsQty={addOnsQty}
              loadQty={loads.length}
              subTotal={subTotal}
              service={service}
              customer={customer}
              isPaid={isPaid}
              paymentAmount={paymentAmount}
              setPaymentAmount={setPaymentAmount}
            />
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default LaundryRegisterPage;
