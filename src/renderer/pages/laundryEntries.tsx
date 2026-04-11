/* eslint-disable react/no-array-index-key */
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import {
  faPenToSquare,
  faPersonWalkingLuggage,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { format } from 'date-fns';
import {
  Laundry,
  LaundryPaginatedGetFilter,
} from 'globalTypes/realm/laundry.types';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import {
  Button,
  Card,
  Col,
  FormControl,
  Modal,
  Row,
  Table,
} from 'react-bootstrap';
import { toast } from 'react-toastify';
import LaundryEntriesConfirmationModal from 'renderer/components/laundryEntries/laundryEntriesConfirmation';
import LaundryEntriesFilter from 'renderer/components/laundryEntries/laundryEntriesFilter';
import { getLaundries, setPackingQuantity } from 'renderer/service/laundry';
import useLaundryFilterStore from 'renderer/store/filtersStore/laundryFilterStore';
import { debounce, pesoFormat } from 'renderer/utils/helper';

const displayLaundries = (
  pageNumber: number,
  pageSize: number,
  laundries: Laundry[]
) => {
  const startIndex = (pageNumber - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  return laundries.slice(startIndex, endIndex);
};

const LaundryEntriesPage = () => {
  const [laundries, setLaundries] = useState<Laundry[]>([]);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [confimationAction, setConfimationAction] = useState<
    'delete' | 'claim'
  >('delete');
  const [packingQuantiyModal, setPackingQuantiyModal] = useState(false);
  const [selectedLaundry, setSelectedLaundry] = useState<Laundry | undefined>();
  const [hasNextPage, setHasNextPage] = useState(false);
  const [packingQty, setPackingQty] = useState<string | number>(1);

  const [totals, setTotals] = useState({
    loads: 0,
    amount: 0,
  });

  const { state: filter, setState: setFilter } = useLaundryFilterStore(
    (state) => state
  );

  const isDisplayTotals = filter.startDate;

  const handleGetLaundries = useCallback(async () => {
    const { pageNumber, pageSize } = filter;
    // const limit = pageNumber * pageSize + 1;

    const { isSuccess, result, message } = await getLaundries(filter);

    if (isSuccess && result) {
      const t = { loads: 0, amount: 0 };
      for (const item of result) {
        t.loads += item.loads.length;
        t.amount = +(t.amount + item.totalAmount).toFixed(2);
      }
      setTotals(t);
      setLaundries(displayLaundries(pageNumber, pageSize, result));
      setHasNextPage(result.length > pageSize * pageNumber);
    }
    if (!isSuccess) {
      toast.error(message);
    }
  }, [filter]);

  const handleFilterChange = (change: Partial<LaundryPaginatedGetFilter>) => {
    setFilter({
      ...filter,
      ...change,
      pageNumber: change.pageNumber || 1,
    });
  };

  const handleSearchText = debounce((e: ChangeEvent<HTMLInputElement>) => {
    handleFilterChange({ customer: e.target.value.trim() });
  }, 500);

  const handleConfirm = (laundry?: Laundry) => {
    if (!selectedLaundry) return;
    setConfirmationModal(false);
    if (confimationAction === 'claim' && laundry) {
      setLaundries(
        laundries.map((item) => (item._id === laundry._id ? laundry : item))
      );
    } else if (confimationAction === 'delete') {
      setLaundries(
        laundries.filter((item) => item._id !== selectedLaundry._id)
      );
    }
  };

  const handleClaimConfirmation = (laundry: Laundry) => {
    setConfirmationModal(true);
    setConfimationAction('claim');
    setSelectedLaundry(laundry);
  };

  const handleDeleteConfirmation = (laundry: Laundry) => {
    setConfirmationModal(true);
    setConfimationAction('delete');
    setSelectedLaundry(laundry);
  };

  const handleShowPackingModal = async (laundry: Laundry) => {
    setSelectedLaundry(laundry);
    setPackingQty(laundry.packingQty);
    setPackingQuantiyModal(true);
  };

  const handleSetPackingQuantity = async () => {
    if (!selectedLaundry) return;
    const { isSuccess, message } = await setPackingQuantity(
      selectedLaundry?._id,
      +packingQty
    );

    if (isSuccess) {
      const newLaundries = laundries.map((item) =>
        item._id === selectedLaundry._id
          ? { ...item, packingQty: +packingQty }
          : item
      );
      setLaundries(newLaundries);
      setPackingQuantiyModal(false);
    } else {
      toast.error(message);
    }
  };

  useEffect(() => {
    handleGetLaundries();
  }, [handleGetLaundries]);

  return (
    <div>
      <LaundryEntriesConfirmationModal
        show={confirmationModal}
        toggle={setConfirmationModal}
        selectedLaundry={selectedLaundry}
        action={confimationAction}
        onConfirm={handleConfirm}
      />

      <Modal
        show={packingQuantiyModal}
        onHide={() => setPackingQuantiyModal(false)}
        size="sm"
        centered
      >
        <Modal.Header>
          <Modal.Title className="fw-bold text-center d-block w-100">
            Packing Quantity
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormControl
            className="text-center"
            type="number"
            placeholder="Enter Quantity"
            step={1}
            min={1}
            required
            value={packingQty}
            onChange={(e) => setPackingQty(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setPackingQty('');
              setPackingQuantiyModal(false);
            }}
          >
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSetPackingQuantity}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>

      <h3>Laundry Entries</h3>

      <LaundryEntriesFilter />
      <Card>
        <Card.Body>
          <Row className="mb-3">
            <Col md="6">
              <FormControl
                type="search"
                placeholder="Search Customer"
                onChange={handleSearchText}
              />
            </Col>
          </Row>
          <Row>
            <Col lg="6">
              Total Loads: {isDisplayTotals ? totals.loads : 'N/A'}
            </Col>
            <Col lg="6">
              Total Amount:{' '}
              {isDisplayTotals ? pesoFormat(totals.amount) : 'N/A'}
            </Col>
          </Row>
          <hr />
          <Table responsive>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Service</th>
                <th>Loads</th>
                <th>Add-Ons</th>
                <th>Add-Ons Price</th>
                <th>Drop-Off Date</th>
                <th>Total Amount</th>
                <th>Packing Qty</th>
                <th>Paid</th>
                <th>Claimed Date</th>
                <th>Claimed By</th>
                <th>Transact By</th>
                <th> </th>
              </tr>
            </thead>
            <tbody>
              {laundries.map((item) => (
                <tr key={item._id}>
                  <td title={item.customerNumber}>{item.customer}</td>
                  <td>{item.service}</td>
                  <td>
                    {item.loads.map((v) => `${v.toFixed(2)} kg`).join(', ')}
                  </td>
                  <td>
                    {item.addOns.map((v, i) => (
                      <p key={`${i}`} className="mb-0">{`${v.quantity} ${
                        v.productName
                      } ${pesoFormat(v.price * v.quantity)}`}</p>
                    ))}
                  </td>
                  <td>{pesoFormat(item.addOnsPrice)}</td>
                  <td>{format(item.dropOffDate, 'MM/dd/yyyy hh:mm aaa')}</td>
                  <td>{pesoFormat(item.totalAmount)}</td>
                  <td>{item.packingQty.toLocaleString()}</td>
                  <td>{item.isPaid ? 'Yes' : 'No'}</td>
                  <td>
                    {item.claimedDate &&
                      format(item.claimedDate, 'MM/dd/yyyy hh:mm aaa')}
                  </td>
                  <td>{item.claimedBy}</td>
                  <td>{item.transactBy}</td>
                  <td>
                    <FontAwesomeIcon
                      icon={faPenToSquare}
                      title="Update Packing Quantity"
                      size="xl"
                      className="me-2 cursor-pointer"
                      role="button"
                      tabIndex={0}
                      onClick={() => handleShowPackingModal(item)}
                    />
                    {!item.claimedDate && (
                      <FontAwesomeIcon
                        icon={faPersonWalkingLuggage}
                        title="Claim"
                        size="xl"
                        className="me-2 cursor-pointer"
                        role="button"
                        tabIndex={0}
                        onClick={() => handleClaimConfirmation(item)}
                      />
                    )}
                    <FontAwesomeIcon
                      icon={faTrashCan}
                      title="Delete"
                      size="xl"
                      className="me-2 text-danger cursor-pointer"
                      role="button"
                      tabIndex={0}
                      onClick={() => handleDeleteConfirmation(item)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
      <div className="d-flex justify-content-between align-items-center">
        <Button
          variant="outline-primary"
          onClick={() =>
            filter.pageNumber > 1 &&
            setFilter({ ...filter, pageNumber: filter.pageNumber - 1 })
          }
        >
          Previous
        </Button>
        <p className="pt-3 fw-bold">{filter.pageNumber}</p>
        <Button
          variant="outline-primary"
          onClick={() =>
            hasNextPage &&
            setFilter({ ...filter, pageNumber: filter.pageNumber + 1 })
          }
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default LaundryEntriesPage;
