import { KeyboardEvent, forwardRef, useEffect, useState } from 'react';
import { Product } from 'main/service/productsRealm';
import Select, { SelectInstance } from 'react-select';
import { getProducts } from 'renderer/service/products';
import { debounce, pesoFormat, toPascalCase } from 'renderer/utils/helper';

type Opt = {
  value: string;
  label: string;
  product: Product;
};

type Props = {
  onSelect: (product: Product) => void;
  inputValue: string;
  onInputChange: (input: string) => void;
  autofocus?: boolean;
};

const handleGetProducts = debounce(async (searchText: string) => {
  return getProducts({
    searchText,
    sortProp: 'last_transaction_date',
    limit: 20,
  });
}, 300);

const ProductsSelect = forwardRef<SelectInstance<Opt> | null, Props>(
  ({ onSelect, inputValue, onInputChange, autofocus }, ref) => {
    const [productOptions, setProductOptions] = useState<Opt[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [menuIsOpen, setMenuIsOpen] = useState(false);

    const handleGetOptions = async (searchText: string): Promise<Opt[]> => {
      const response = await handleGetProducts(searchText);
      if (response?.isSuccess && response.result) {
        const data = response.result;
        const opts: Opt[] = data.map((item) => ({
          value: item._id,
          label: `${toPascalCase(item.name)} - ${pesoFormat(item.price)} ${
            item.barcode ? `-    #${item.barcode}` : ''
          }`,
          product: item,
        }));
        return opts;
      }
      return [];
    };

    const handleInputChange = (input: string) => {
      input && setIsLoading(true);
      onInputChange(input);
    };

    const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.code === 'Enter') {
        onInputChange('');
        setMenuIsOpen(false);
      }
    };

    useEffect(() => {
      (async () => {
        setIsLoading(true);
        const opt = await handleGetOptions(inputValue);
        setIsLoading(false);
        setProductOptions(opt);
      })();
    }, [inputValue]);

    return (
      <Select
        ref={ref}
        isClearable
        isSearchable
        inputValue={inputValue}
        onInputChange={handleInputChange}
        value={null}
        onChange={(opt) => opt && !isLoading && onSelect(opt.product)}
        options={productOptions}
        autoFocus={autofocus}
        onKeyDown={onKeyDown}
        isLoading={isLoading}
        menuIsOpen={menuIsOpen}
        onMenuOpen={() => setMenuIsOpen(true)}
        onMenuClose={() => setMenuIsOpen(false)}
      />
    );
  }
);

export default ProductsSelect;
