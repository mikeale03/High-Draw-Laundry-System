import { MobileNumber } from 'globalTypes/realm/mobileNumber.types';
import { ActionMeta, SingleValue } from 'react-select';
import AsyncSelect from 'react-select/async';
import { getCustomers } from 'renderer/service/mobileNumbers';

const handleGetCustomers = async (inputValue: string) => {
  const { isSuccess, result } = await getCustomers(inputValue, 20);
  if (isSuccess && result) {
    return result.map((i) => ({
      label: `${i.name} ${i.mobile && `- cell#: ${i.mobile}`}`,
      value: i.number,
      customer: i,
    }));
  }
  return [];
};

const loadOptions = (
  inputValue: string,
  callback: (
    options: { label: string; value: string; customer: MobileNumber }[]
  ) => void
) => {
  handleGetCustomers(inputValue)
    // eslint-disable-next-line promise/no-callback-in-promise
    .then((opt) => callback(opt))
    .catch((err) => console.error(err));
};

export type CustomerSelectOption = SingleValue<{
  label: string;
  value: string;
  customer: MobileNumber;
}>;

type Props = {
  value: CustomerSelectOption | null;
  onSelect:
    | ((
        newValue: CustomerSelectOption,
        actionMeta: ActionMeta<{
          label: string;
          value: string;
          customer: MobileNumber;
        }>
      ) => void)
    | undefined;
};

const CustomerSelect = ({ value, onSelect }: Props) => {
  return (
    <AsyncSelect
      name="customer"
      cacheOptions
      loadOptions={loadOptions}
      defaultOptions
      value={value}
      onChange={onSelect}
      required
    />
  );
};

export default CustomerSelect;
