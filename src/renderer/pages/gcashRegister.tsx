/* eslint-disable no-nested-ternary */
import {
  faBuildingColumns,
  faCircleMinus,
  faCirclePlus,
  faPaperPlane,
  faPenToSquare,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { v4 as uuid } from 'uuid';
import { GcashCreate, GcashType } from 'globalTypes/realm/gcash.types';
import { useCallback, useContext, useEffect, useState } from 'react';
import { Button, Card, Col, Row, Table } from 'react-bootstrap';
import { toast } from 'react-toastify';
import ConfirmationModal from 'renderer/components/common/modals/confirmation';
import SetCashInOutModal, {
  GCashItem,
} from 'renderer/components/gcashRegister/setCashInOutModal';
import UserContext from 'renderer/context/userContext';
import {
  createGcashTransactions,
  getGcashBalance,
} from 'renderer/service/gcash';
import { pesoFormat } from 'renderer/utils/helper';
import format from 'date-fns/format';
import AddDeductGcashBalanceModal from 'renderer/components/gcashRegister/addDeductGcashBalanceModal';

let key = 0;

const GcashRegisterPage = () => {
  const [showCashInOutModal, setShowCashInOutModal] = useState(false);
  const [showAddDeductBalanceModal, setShowAddDeductBalanceModal] =
    useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [type, setType] = useState<GcashType>('cash in');
  const [items, setItems] = useState<GCashItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<GCashItem | undefined>();
  const [totalCashIn, setTotalCashIn] = useState(0);
  const [totalCashOut, setTotalCashOut] = useState(0);
  const [totalChargeCash, setTotalChargeCash] = useState(0);
  const [totalChargeGcash, setTotalChargeGcash] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalAddBalance, setTotalAddBalance] = useState(0);
  const [totalDeductBalance, setTotalDeductBalance] = useState(0);
  const [gcashBalance, setGcashBalance] = useState(0);
  // const [balances, setBalances] = useState<number[]>([]);

  const { user } = useContext(UserContext);

  const handleGetBalance = useCallback(async () => {
    const response = await getGcashBalance();
    if (response.isSuccess) {
      setGcashBalance(response.result ?? 0);
    } else {
      toast.error(response.message);
    }
  }, []);

  useEffect(() => {
    handleGetBalance();
  }, [handleGetBalance]);

  useEffect(() => {
    let tCashIn = 0;
    let tCashOut = 0;
    let tChargeCash = 0;
    let tChargeGcash = 0;
    let tAmount = 0;
    let tAddBalance = 0;
    let tDeductBalance = 0;

    const balanceArr: number[] = [];
    items.forEach((item) => {
      if (item.type === 'cash in') tCashIn += item.amount;
      else if (item.type === 'cash out') tCashOut += item.amount;
      else if (item.type === 'add balance') tAddBalance += item.amount;
      else if (item.type === 'deduct balance') tDeductBalance += item.amount;

      tChargeCash += item.charge_payment === 'cash' ? item.charge : 0;
      tChargeGcash += item.charge_payment !== 'cash' ? item.charge : 0;
      tAmount += item.amount + item.charge;

      const currentBalance = balanceArr.length
        ? balanceArr[balanceArr.length - 1]
        : gcashBalance;

      let balance = currentBalance;
      if (item.type === 'cash in' || item.type === 'deduct balance') {
        balance -= item.amount;
      } else if (item.type === 'cash out' || item.type === 'add balance') {
        balance += item.amount;
      }

      balanceArr.push(balance);
    });
    setTotalCashIn(tCashIn);
    setTotalCashOut(tCashOut);
    setTotalChargeCash(tChargeCash);
    setTotalChargeGcash(tChargeGcash);
    setTotalAddBalance(tAddBalance);
    setTotalDeductBalance(tDeductBalance);
    setTotalAmount(tAmount);
    // setBalances(balanceArr);
  }, [items, gcashBalance]);

  const handleSetCashInCashOutModal = (_type: GcashType, item?: GCashItem) => {
    setSelectedItem(item);
    setType(_type);
    setShowCashInOutModal(true);
  };

  const handleAddDeductBalanceModal = (_type: GcashType, item?: GCashItem) => {
    setSelectedItem(item);
    setType(_type);
    setShowAddDeductBalanceModal(true);
  };

  const handleSetItem = (_type: GcashType, item: GCashItem) => {
    // if is edit
    if (item.key) {
      setItems(
        items
          .map((itm) =>
            itm.key === item.key
              ? {
                  ...itm,
                  ...item,
                }
              : itm
          )
          .sort(
            (a, b) => (a.date_transacted as any) - (b.date_transacted as any)
          )
      );
      return;
    }

    key += 1;
    const itm = {
      ...item,
      key,
      type: _type,
    };
    setItems(
      [itm, ...items].sort(
        (a, b) => (a.date_transacted as any) - (b.date_transacted as any)
      )
    );
  };

  const handleSubmit = async () => {
    if (!user) return;

    const transaction_id = uuid();
    const gcashTrans: GcashCreate[] = items.map((item) => ({
      ...item,
      transact_by: user.username,
      transact_by_user_id: user._id,
      transaction_id,
    }));

    const response = await createGcashTransactions(gcashTrans);
    if (response.isSuccess) {
      toast.success(response.message);
      setItems([]);
      handleGetBalance();
    } else {
      toast.error(response.message);
    }
  };

  const handleDeleteItem = (item: GCashItem) => {
    setItems(items.filter((itm) => item.key !== itm.key));
  };

  return (
    <div>
      <SetCashInOutModal
        show={showCashInOutModal}
        toggle={setShowCashInOutModal}
        type={type}
        selectedItem={selectedItem}
        onConfirm={handleSetItem}
      />

      <AddDeductGcashBalanceModal
        show={showAddDeductBalanceModal}
        toggle={setShowAddDeductBalanceModal}
        selectedItem={selectedItem}
        type={type}
        onConfirm={handleSetItem}
      />

      <ConfirmationModal
        show={showConfirmationModal}
        toggle={setShowConfirmationModal}
        onConfirm={handleSubmit}
        message={
          <Row className="mb-2">
            <Col>
              {totalCashIn > 0 && (
                <Row>
                  <Col xs="6" className="fs-5 text-primary">
                    Total Cash In:
                  </Col>
                  <Col xs="6">
                    <p className="m-0 mb-1 fs-5 text-end text-primary">
                      <strong>{pesoFormat(totalCashIn)}</strong>
                    </p>
                  </Col>
                </Row>
              )}
              {totalCashOut > 0 && (
                <Row>
                  <Col xs="6" className="fs-5 text-danger">
                    Total Cash Out:
                  </Col>
                  <Col xs="6">
                    <p className="m-0 mb-1 fs-5 text-end text-danger">
                      <strong>{pesoFormat(totalCashOut)}</strong>
                    </p>
                  </Col>
                </Row>
              )}
              {totalAddBalance > 0 && (
                <Row>
                  <Col xs="6" className="fs-5">
                    Add Balance:
                  </Col>
                  <Col xs="6">
                    <p className="m-0 mb-1 fs-5 text-end">
                      <strong>{pesoFormat(totalAddBalance)}</strong>
                    </p>
                  </Col>
                </Row>
              )}
              {totalDeductBalance > 0 && (
                <Row>
                  <Col xs="6" className="fs-5">
                    Deduct Balance:
                  </Col>
                  <Col xs="6">
                    <p className="m-0 mb-1 fs-5 text-end">
                      <strong>{pesoFormat(totalDeductBalance)}</strong>
                    </p>
                  </Col>
                </Row>
              )}
              <Row>
                <Col xs="6" className="fs-5">
                  Total Charge in Cash:
                </Col>
                <Col xs="6">
                  <p className="m-0 mb-1 fs-5 text-end">
                    <strong>{pesoFormat(totalChargeCash)}</strong>
                  </p>
                </Col>
              </Row>
              <Row>
                <Col xs="6" className="fs-5">
                  Total Charge in GCash:
                </Col>
                <Col xs="6">
                  <p className="m-0 mb-1 fs-5 text-end">
                    <strong>{pesoFormat(totalChargeGcash)}</strong>
                  </p>
                </Col>
              </Row>
              <Row>
                <Col xs="6" className="fs-5">
                  Total Amount:
                </Col>
                <Col xs="6">
                  <p className="m-0 mb-1 fs-5 text-end">
                    <strong>{pesoFormat(totalAmount)}</strong>
                  </p>
                </Col>
              </Row>
            </Col>
          </Row>
        }
      />

      <h3>GCash Register</h3>
      <div className="my-3">
        <Button
          className="me-2"
          style={{ width: 120 }}
          onClick={() => handleSetCashInCashOutModal('cash in')}
        >
          Cash In <FontAwesomeIcon icon={faBuildingColumns} />
        </Button>
        <Button
          className="me-2"
          variant="outline-primary"
          style={{ width: 120 }}
          onClick={() => handleSetCashInCashOutModal('cash out')}
        >
          Cash Out <FontAwesomeIcon icon={faPaperPlane} color="red" />
        </Button>
        <Button
          className="me-2"
          variant="secondary"
          style={{ width: 160 }}
          onClick={() => handleAddDeductBalanceModal('add balance')}
        >
          Add Balance <FontAwesomeIcon icon={faCirclePlus} />
        </Button>
        <Button
          variant="outline-secondary"
          style={{ width: 160 }}
          onClick={() => handleAddDeductBalanceModal('deduct balance')}
        >
          Deduct Balance <FontAwesomeIcon icon={faCircleMinus} />
        </Button>
      </div>

      <Card>
        <Card.Body>
          {/* <div className="d-xl-flex justify-content-between">
            <p className="mx-2 my-2">
              Starting Balance: {pesoFormat(gcashBalance)}
            </p>
            <p className="mx-2 my-2">
              Resulting Balance:{' '}
              {pesoFormat(balances[balances.length - 1] ?? gcashBalance)}
            </p>
          </div> */}
          <Table responsive hover>
            <thead>
              <tr>
                <th>Number</th>
                <th>Amount</th>
                <th>Charge</th>
                <th>Type</th>
                <th>Total</th>
                <th>Date Transacted</th>
                {/* <th>GCash Balance</th> */}
                <th>Note</th>
                <th> </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={`${item.key}`}>
                  <td>{item.number}</td>
                  <td>{pesoFormat(item.amount)}</td>
                  <td>
                    {pesoFormat(item.charge)}
                    {item.charge_payment === 'gcash' ? (
                      <span className="text-primary"> (GCash)</span>
                    ) : (
                      ' (Cash)'
                    )}
                  </td>
                  <td
                    className={`text-capitalize ${
                      item.type === 'cash in'
                        ? 'text-primary'
                        : item.type === 'cash out'
                        ? 'text-danger'
                        : ''
                    }`}
                  >
                    {item.type}
                  </td>
                  <td>{pesoFormat(item.amount + item.charge)}</td>
                  <td>{format(item.date_transacted, 'MM/dd/yyyy h:mm aa')}</td>
                  {/* <td>{pesoFormat(balances[index])}</td> */}
                  <td>{item.note}</td>
                  <td className="align-middle text-center">
                    <FontAwesomeIcon
                      onClick={() =>
                        item.type === 'cash in' || item.type === 'cash out'
                          ? handleSetCashInCashOutModal(item.type, item)
                          : handleAddDeductBalanceModal(item.type, item)
                      }
                      icon={faPenToSquare}
                      title="Edit"
                      className="me-2 cursor-pointer"
                    />
                    <FontAwesomeIcon
                      title="remove"
                      icon={faXmark}
                      className="btn"
                      onClick={() => handleDeleteItem(item)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          {items.length === 0 && (
            <span className="ms-2 fw-light fst-italic text-secondary">
              no transactions
            </span>
          )}
        </Card.Body>
      </Card>
      <div className="d-flex justify-content-end mt-3">
        <Button
          style={{ width: 100 }}
          onClick={() => setShowConfirmationModal(true)}
          disabled={items.length === 0}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default GcashRegisterPage;
