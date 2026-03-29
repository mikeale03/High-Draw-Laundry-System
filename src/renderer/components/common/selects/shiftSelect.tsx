import { ChangeEvent, useEffect, useState } from 'react';
import { FormSelect } from 'react-bootstrap';

export type Props = {
  onSelect: (params: { startDate: Date; endDate: Date }) => void;
  startDate: Date;
  endDate: Date;
};

let shiftAStart = new Date();
let shiftAEnd = new Date();
let shiftBStart = new Date();
let shiftBEnd = new Date();
let shiftCStart = new Date();
let shiftCEnd = new Date();

function ShiftSelect({ startDate, endDate, onSelect }: Props) {
  const [val, setVal] = useState('');
  shiftAStart = new Date(startDate);
  shiftAStart.setHours(7, 0, 0, 0);
  shiftAEnd = new Date(endDate);
  shiftAEnd.setHours(15, 59, 59, 999);
  shiftBStart = new Date(startDate);
  shiftBStart.setHours(8, 0, 0, 0);
  shiftBEnd = new Date(endDate);
  shiftBEnd.setHours(16, 59, 59, 999);
  shiftCStart = new Date(startDate);
  shiftCStart.setHours(16, 0, 0, 0);
  shiftCEnd = new Date(endDate);
  shiftCEnd.setHours(9, 59, 59, 999);

  useEffect(() => {
    if (
      startDate.getTime() === shiftAStart.getTime() &&
      endDate.getTime() === shiftAEnd.getTime()
    )
      setVal('a');
    else if (
      startDate.getTime() === shiftBStart.getTime() &&
      endDate.getTime() === shiftBEnd.getTime()
    )
      setVal('b');
    else if (
      startDate.getTime() === shiftCStart.getTime() &&
      endDate.getTime() === shiftCEnd.getTime()
    )
      setVal('c');
    else setVal('');
  }, [startDate, endDate]);

  const handleSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    if (value === 'a') {
      onSelect({
        startDate: new Date(shiftAStart),
        endDate: new Date(shiftAEnd),
      });
      // startDate.setHours(0, 0, 0, 0);
      // endDate.setHours(6, 59, 59, 999);
    } else if (value === 'b') {
      onSelect({
        startDate: new Date(shiftBStart),
        endDate: new Date(shiftBEnd),
      });
      // startDate.setHours(7, 0, 0, 0);
      // endDate.setHours(15, 59, 59, 999);
    } else if (value === 'c') {
      onSelect({
        startDate: new Date(shiftCStart),
        endDate: new Date(shiftCEnd),
      });
      // startDate.setHours(16, 0, 0, 0);
      // endDate.setHours(23, 59, 59, 999);
    }
    // onSelect({
    //   startDate: new Date(startDate),
    //   endDate: new Date(endDate),
    // });
  };
  return (
    <FormSelect value={val} onChange={handleSelect}>
      <option value="">Select Time Shift</option>
      <option value="a">07:00 AM - 03:59 PM</option>
      <option value="b">08:00 AM - 04:59 PM</option>
      <option value="c">04:00 PM - 09:59 PM</option>
    </FormSelect>
  );
}

export default ShiftSelect;
