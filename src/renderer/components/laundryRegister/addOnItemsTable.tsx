import { faPenToSquare, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Product } from 'globalTypes/realm/products.types';
import { useMemo } from 'react';
import { Table } from 'react-bootstrap';
import { pesoFormat } from 'renderer/utils/helper';

type Item = Product & { totalPrice: number };

type Props = {
  lastUpdatedId: string;
  items: Record<string, Item>;
  onShowInputQuantityModal: (product: Product, item: Item) => void;
  productsSrc: Record<string, Product>;
  onDelete: (key: string) => void;
};

const AddOnItemsTable = ({
  lastUpdatedId,
  items,
  productsSrc,
  onShowInputQuantityModal,
  onDelete,
}: Props) => {
  const itemKeys = useMemo(() => Object.keys(items), [items]);

  const handleOnShowInputModal = (itemKey: string) => {
    onShowInputQuantityModal(productsSrc[itemKey], items[itemKey]);
  };

  return (
    <Table size="sm" hover>
      <thead>
        <tr>
          <th>Name</th>
          <th className="text-center">Quantity</th>
          <th className="text-center">Price</th>
          <th className="text-center">Total Price</th>
          <th> </th>
        </tr>
      </thead>
      <tbody>
        {itemKeys.map((key) => (
          <tr
            key={items[key]._id}
            className={lastUpdatedId === items[key]._id ? 'fw-bold' : ''}
          >
            <td className="align-middle text-capitalize">{items[key].name}</td>
            <td className="align-middle text-center">{items[key].quantity}</td>
            <td className="align-middle text-center">
              {pesoFormat(items[key].price)}
            </td>
            <td className="align-middle text-center">
              {pesoFormat(items[key].totalPrice)}
            </td>
            <td className="align-middle text-center">
              <FontAwesomeIcon
                onClick={() => handleOnShowInputModal(key)}
                icon={faPenToSquare}
                title="Edit"
                className="me-2 cursor-pointer"
              />
              <FontAwesomeIcon
                title="remove"
                icon={faXmark}
                className="btn"
                onClick={() => onDelete(key)}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default AddOnItemsTable;
