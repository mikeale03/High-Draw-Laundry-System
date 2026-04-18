import { Col, FormLabel, FormSelect, Row } from 'react-bootstrap';
import ReactDatePicker from 'react-datepicker';
import { useState } from 'react';
import useLaundryFilterStore from 'renderer/store/filtersStore/laundryFilterStore';
import { LaundryPaginatedGetFilter } from 'globalTypes/realm/laundry.types';
import UsersSelect from '../common/selects/usersSelect';
import ShiftSelect, { ShiftSelectProps } from '../common/selects/shiftSelect';

const LaundryEntriesFilter = () => {
  const { state: filter, setState: setFilter } = useLaundryFilterStore(
    (state) => state
  );
  const [selectedShift, setSelectedShift] = useState<{
    startDate: Date | undefined;
    endDate: Date | undefined;
  }>({
    startDate: undefined,
    endDate: undefined,
  });

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
    const newStartDate = new Date(
      filter.startDate || filter.endDate || startDate
    );
    newStartDate.setHours(
      startDate.getHours(),
      startDate.getMinutes(),
      startDate.getSeconds(),
      startDate.getMilliseconds()
    );
    const newEndDate = new Date(
      filter.startDate || filter.endDate || startDate
    );
    newEndDate.setHours(
      endDate.getHours(),
      endDate.getMinutes(),
      endDate.getSeconds(),
      endDate.getMilliseconds()
    );
    handleFilterChange({
      startDate: newStartDate,
      endDate: newEndDate,
    });
    setSelectedShift({
      startDate: newStartDate,
      endDate: newEndDate,
    });
  };

  return (
    <Row className="mb-3">
      <Col lg="3" className="mb-2">
        <UsersSelect
          value={filter.userId ?? ''}
          onSelect={(userId) => setFilter({ ...filter, userId })}
        />
      </Col>
      <Col lg="3" className="mb-2">
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

      <Col lg="3" className="mb-2">
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
      <Col lg="3" className="mb-2">
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
      <Col lg="3" className="mb-3">
        <FormLabel>Date Filter</FormLabel>
        <FormSelect
          value={filter.dateFilter}
          onChange={(e) =>
            handleFilterChange({
              dateFilter: e.target
                .value as LaundryPaginatedGetFilter['dateFilter'],
            })
          }
        >
          <option value="dropOffDate">Drop-Off Date</option>
          <option value="claimedDate">Claimed Date</option>
        </FormSelect>
      </Col>
      <Col lg="3" className="mb-2">
        <FormLabel>Start Date</FormLabel>
        <ReactDatePicker
          className="form-control"
          selected={filter.startDate}
          onChange={(startDate) => {
            handleFilterChange({ startDate });
            setSelectedShift({ startDate: undefined, endDate: undefined });
          }}
          dateFormat="MM/dd/yyyy h:mm aa"
          showTimeSelect
          isClearable
          todayButton="Today"
        />
      </Col>
      <Col lg="3" className="mb-2">
        <FormLabel>End Date</FormLabel>
        <ReactDatePicker
          className="form-control"
          selected={filter.endDate}
          onChange={(endDate) => {
            handleFilterChange({ endDate });
            setSelectedShift({ startDate: undefined, endDate: undefined });
          }}
          dateFormat="MM/dd/yyyy h:mm aa"
          showTimeSelect
          isClearable
          todayButton="Today"
        />
      </Col>
      <Col lg="3" className="mb-2">
        <FormLabel>Shift</FormLabel>
        <ShiftSelect
          startDate={selectedShift.startDate}
          endDate={selectedShift.endDate}
          onSelect={onShiftSelect}
        />
      </Col>
    </Row>
  );
};

export default LaundryEntriesFilter;
