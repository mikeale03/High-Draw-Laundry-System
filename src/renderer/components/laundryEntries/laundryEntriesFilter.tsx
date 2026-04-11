import { Col, FormLabel, FormSelect, Row } from 'react-bootstrap';
import ReactDatePicker from 'react-datepicker';
import useLaundryFilterStore from 'renderer/store/filtersStore/laundryFilterStore';
import { LaundryPaginatedGetFilter } from 'globalTypes/realm/laundry.types';
import UsersSelect from '../common/selects/usersSelect';
import ShiftSelect, { ShiftSelectProps } from '../common/selects/shiftSelect';

const LaundryEntriesFilter = () => {
  const { state: filter, setState: setFilter } = useLaundryFilterStore(
    (state) => state
  );

  const handleFilterChange = (change: Partial<LaundryPaginatedGetFilter>) => {
    setFilter({
      ...filter,
      ...change,
      pageNumber: change.pageNumber || 1,
    });
  };

  const onShiftSelect: ShiftSelectProps['onSelect'] = ({
    startDate,
    endDate,
  }) => {
    const newEndDate = new Date(startDate);
    newEndDate.setHours(
      endDate.getHours(),
      endDate.getMinutes(),
      endDate.getSeconds(),
      endDate.getMilliseconds()
    );
    handleFilterChange({
      startDate,
      endDate: newEndDate,
    });
  };

  return (
    <Row className="mb-3">
      <Col lg="2" className="mb-2">
        <UsersSelect
          value={filter.userId ?? ''}
          onSelect={(userId) => setFilter({ ...filter, userId })}
        />
      </Col>
      <Col lg="2" className="mb-2">
        <FormLabel>Service</FormLabel>
        <FormSelect
          value={filter.service}
          onChange={(e) => handleFilterChange({ service: e.target.value })}
        >
          <option value="">All</option>
          <option value="drop-off">Drop-Off</option>
          <option value="wash and dry">Wash and Dry</option>
          <option value="wash only">Wash Only</option>
        </FormSelect>
      </Col>
      <Col lg="2" className="mb-2">
        <FormLabel>Start Date</FormLabel>
        <ReactDatePicker
          className="form-control"
          selected={filter.startDate}
          onChange={(startDate) => handleFilterChange({ startDate })}
          dateFormat="MM/dd/yyyy h:mm aa"
          showTimeSelect
          isClearable
          todayButton="Today"
        />
      </Col>
      <Col lg="2" className="mb-2">
        <FormLabel>End Date</FormLabel>
        <ReactDatePicker
          className="form-control"
          selected={filter.endDate}
          onChange={(endDate) => handleFilterChange({ endDate })}
          dateFormat="MM/dd/yyyy h:mm aa"
          showTimeSelect
          isClearable
          todayButton="Today"
        />
      </Col>
      <Col lg="2" className="mb-2">
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
      <Col lg="2" className="mb-2">
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
      <Col lg="2" className="mb-2">
        <FormLabel>Shift</FormLabel>
        <ShiftSelect
          startDate={filter.startDate}
          endDate={filter.endDate}
          onSelect={onShiftSelect}
        />
      </Col>
    </Row>
  );
};

export default LaundryEntriesFilter;
