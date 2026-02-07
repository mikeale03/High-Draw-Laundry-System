import { faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MobileNumber } from 'globalTypes/realm/mobileNumber.types';
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Card, Col, FormControl, Row, Table } from 'react-bootstrap';
import { toast } from 'react-toastify';
import ConfirmationModal from 'renderer/components/common/modals/confirmation';
import SetMobileNumberModal from 'renderer/components/mobileNumbers/setMobileNumberModal';
import {
  deleteMobileNumber,
  getCustomers,
} from 'renderer/service/mobileNumbers';
import { debounce } from 'renderer/utils/helper';

function CustomersPage() {
  const [mobileNumbers, setMobileNumbers] = useState<MobileNumber[]>([]);
  const [mobileNumberModal, setMobileNumberModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [selectedMobileNumber, setSelectedMobileNumber] = useState<
    MobileNumber | undefined
  >();
  const [searchText, setSearchText] = useState('');
  const [pageSize] = useState(50);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const handleDeleteMobileNumber = async () => {
    if (!selectedMobileNumber) return;
    const response = await deleteMobileNumber(selectedMobileNumber.number);
    if (response.isSuccess) {
      setMobileNumbers(
        mobileNumbers.filter(
          (item) => item.number !== selectedMobileNumber.number
        )
      );
    } else toast.error(response.message);
  };

  const handleShowConfirmationModal = (mn: MobileNumber) => {
    setSelectedMobileNumber(mn);
    setShowConfirmationModal(true);
  };

  const handleSetMobileNumberSuccess = (mobileNumber: MobileNumber) => {
    if (selectedMobileNumber) {
      setMobileNumbers(
        mobileNumbers.map((mn) =>
          selectedMobileNumber.number === mn.number ? mobileNumber : mn
        )
      );
    } else {
      setMobileNumbers([mobileNumber, ...mobileNumbers]);
    }
  };

  const handleSetMobileNumberModal = (mobileNumber?: MobileNumber) => {
    setSelectedMobileNumber(mobileNumber);
    setMobileNumberModal(true);
  };

  const handleGetMobileNumbers = useCallback(async () => {
    const response = await getCustomers(searchText);
    if (response.isSuccess) {
      const data = response.result;
      console.log(data);
      const mns = data ?? [];
      setTotalPages(Math.ceil(mns.length / pageSize));
      setMobileNumbers(mns);
      setPageNumber(1);
    } else {
      toast.error(response.message);
    }
  }, [pageSize, searchText]);

  const displayMobileNumbers = useMemo(() => {
    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return mobileNumbers.slice(startIndex, endIndex);
  }, [pageNumber, pageSize, mobileNumbers]);

  const handleSearchText = debounce((e: ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value.trim());
  }, 500);

  useEffect(() => {
    handleGetMobileNumbers();
  }, [handleGetMobileNumbers]);

  return (
    <div>
      <ConfirmationModal
        show={showConfirmationModal}
        toggle={setShowConfirmationModal}
        message={
          <p className="text-center">Are you sure to delete this Customer?</p>
        }
        onConfirm={handleDeleteMobileNumber}
      />
      <SetMobileNumberModal
        show={mobileNumberModal}
        toggle={setMobileNumberModal}
        selectedMobileNumber={selectedMobileNumber}
        onSuccess={handleSetMobileNumberSuccess}
      />
      <h3>Customers</h3>
      <Button
        className="mb-3 mt-1"
        onClick={() => handleSetMobileNumberModal()}
      >
        Add Customer
      </Button>

      <Card>
        <Card.Body>
          <Row className="mb-3">
            <Col md="6">
              <FormControl
                type="search"
                placeholder="Search name or number"
                onChange={handleSearchText}
              />
            </Col>
          </Row>
          <Table responsive hover>
            <thead>
              <tr>
                <th>Number</th>
                <th>Name</th>
                <th> </th>
              </tr>
            </thead>
            <tbody>
              {displayMobileNumbers.map((number) => (
                <tr key={number.number}>
                  <td>{number.mobile}</td>
                  <td>{number.name}</td>
                  <td>
                    <FontAwesomeIcon
                      onClick={() => handleSetMobileNumberModal(number)}
                      icon={faPenToSquare}
                      title="Edit"
                      size="xl"
                      className="me-2 cursor-pointer"
                      role="button"
                      tabIndex={0}
                    />
                    <FontAwesomeIcon
                      onClick={() => handleShowConfirmationModal(number)}
                      icon={faTrashCan}
                      title="Delete"
                      size="xl"
                      className="me-2 cursor-pointer"
                      role="button"
                      tabIndex={0}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          {mobileNumbers.length === 0 && (
            <span className="ms-2 fw-light fst-italic text-secondary">
              no customers
            </span>
          )}
        </Card.Body>
      </Card>
      <div className="d-flex justify-content-between align-items-center">
        <Button
          variant="outline-primary"
          onClick={() => pageNumber > 1 && setPageNumber(pageNumber - 1)}
        >
          Previous
        </Button>
        <p className="pt-3 fw-bold">{pageNumber}</p>
        <Button
          variant="outline-primary"
          onClick={() =>
            pageNumber < totalPages && setPageNumber(pageNumber + 1)
          }
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export default CustomersPage;
