/* eslint-disable react/no-array-index-key */
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { faPersonWalkingLuggage } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { format } from 'date-fns';
import {
  Laundry,
  LaundryPaginatedGetFilter,
} from 'globalTypes/realm/laundry.types';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import {
  Card,
  Col,
  FormControl,
  FormLabel,
  FormSelect,
  Row,
  Table,
} from 'react-bootstrap';
import ReactDatePicker from 'react-datepicker';
import LaundryEntriesConfirmationModal from 'renderer/components/laundryEntries/laundryEntriesConfirmation';
import { getLaundries } from 'renderer/service/laundry';
import { debounce, pesoFormat } from 'renderer/utils/helper';

const LaundryEntriesPage = () => {
  const [laundries, setLaundries] = useState<Laundry[]>([]);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [confimationAction, setConfimationAction] = useState<
    'delete' | 'claim'
  >('delete');
  const [selectedLaundry, setSelectedLaundry] = useState<Laundry | undefined>();
  const [filter, setFilter] = useState<LaundryPaginatedGetFilter>({
    pageNumber: 1,
    pageSize: 50,
    customer: '',
    service: '',
    dropOffDate: undefined,
    claimedDate: undefined,
    isPaid: '',
    isClaimed: '',
  });

  const handleGetLaundries = useCallback(async () => {
    const { isSuccess, result } = await getLaundries(filter);
    console.log(result);
    if (isSuccess && result) {
      setLaundries(result);
    }
  }, [filter]);

  const handleFilterChange = (change: Partial<LaundryPaginatedGetFilter>) => {
    setFilter({ ...filter, ...change });
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

      <h3>Laundry Entries</h3>
      <Row className="mb-3">
        <Col lg="2">
          <FormLabel>Service</FormLabel>
          <FormSelect
            value={filter.service}
            onChange={(e) => handleFilterChange({ service: e.target.value })}
          >
            <option value="">All</option>
            <option value="drop-off">Drop-Off</option>
            <option value="self-service">Self-Service</option>
          </FormSelect>
        </Col>
        <Col lg="2">
          <FormLabel>Drop-Off Date</FormLabel>
          <ReactDatePicker
            className="form-control"
            selected={filter.dropOffDate}
            onChange={(dropOffDate) => handleFilterChange({ dropOffDate })}
            isClearable
          />
        </Col>
        <Col lg="2">
          <FormLabel>Claimed Date</FormLabel>
          <ReactDatePicker
            className="form-control"
            selected={filter.claimedDate}
            onChange={(claimedDate) => handleFilterChange({ claimedDate })}
            isClearable
          />
        </Col>
        <Col lg="2">
          <FormLabel>Paid</FormLabel>
          <FormSelect
            value={filter.isPaid}
            onChange={(e) => handleFilterChange({ isPaid: e.target.value })}
          >
            <option value="">All</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </FormSelect>
        </Col>
        <Col lg="2">
          <FormLabel>Claimed</FormLabel>
          <FormSelect
            value={filter.isClaimed}
            onChange={(e) => handleFilterChange({ isClaimed: e.target.value })}
          >
            <option value="">All</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </FormSelect>
        </Col>
      </Row>
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
          <Table responsive>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Service</th>
                <th>Service Price</th>
                <th>Loads</th>
                <th>Add-Ons</th>
                <th>Add-Ons Price</th>
                <th>Drop-Off Date</th>
                <th>Total Amount</th>
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
                  <td>{item.servicePrice}</td>
                  <td>{item.loads.map((v) => `${v} kg`).join(', ')}</td>
                  <td>
                    {item.addOns.map((v, i) => (
                      <p key={`${i}`} className="mb-0">{`${v.quantity} ${
                        v.productName
                      } ${pesoFormat(v.price * v.quantity)}`}</p>
                    ))}
                  </td>
                  <td>{pesoFormat(item.addOnsPrice)}</td>
                  <td>{format(item.dropOffDate, 'MM/dd/yyyy hh:mm')}</td>
                  <td>{pesoFormat(item.totalAmount)}</td>
                  <td>{item.isPaid ? 'Yes' : 'No'}</td>
                  <td>
                    {item.claimedDate &&
                      format(item.claimedDate, 'MM-dd-yyyy hh:mm')}
                  </td>
                  <td>{item.claimedBy}</td>
                  <td>{item.transactBy}</td>
                  <td>
                    {/* <FontAwesomeIcon
                      icon={faPenToSquare}
                      title="Edit"
                      size="xl"
                      className="me-2 cursor-pointer"
                      role="button"
                      tabIndex={0}
                    /> */}
                    <FontAwesomeIcon
                      icon={faTrashCan}
                      title="Delete"
                      size="xl"
                      className="me-2 cursor-pointer"
                      role="button"
                      tabIndex={0}
                      onClick={() => handleDeleteConfirmation(item)}
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
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
};

export default LaundryEntriesPage;
