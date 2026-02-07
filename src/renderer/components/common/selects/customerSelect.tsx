import { ActionMeta, SingleValue } from 'react-select';
import AsyncSelect from 'react-select/async';
import { getCustomers } from 'renderer/service/mobileNumbers';

const handleGetCustomers = async (inputValue: string) => {
  const { isSuccess, result } = await getCustomers(inputValue, 20);
  if (isSuccess && result) {
    return result.map((i) => ({
      label: i.name,
      value: i.number,
    }));
  }
  return [];
};

const loadOptions = (
  inputValue: string,
  callback: (options: { label: string; value: string }[]) => void
) => {
  handleGetCustomers(inputValue)
    // eslint-disable-next-line promise/no-callback-in-promise
    .then((opt) => callback(opt))
    .catch((err) => console.error(err));
};

type Props = {
  onSelect:
    | ((
        newValue: SingleValue<{
          label: string;
          value: string;
        }>,
        actionMeta: ActionMeta<{
          label: string;
          value: string;
        }>
      ) => void)
    | undefined;
};

const CustomerSelect = ({ onSelect }: Props) => {
  return (
    <AsyncSelect
      name="customer"
      cacheOptions
      loadOptions={loadOptions}
      defaultOptions
      onChange={onSelect}
      required
    />
  );
};

export default CustomerSelect;
