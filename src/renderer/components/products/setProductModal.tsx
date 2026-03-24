import { Product } from 'main/service/productsRealm';
import { ChangeEvent, FormEvent, useContext, useRef, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import UserContext from 'renderer/context/userContext';
import { createProduct, updateProduct } from 'renderer/service/products';
import {
  createProductAddActivity,
  createProductEditActivity,
} from 'renderer/service/activities';
import FormInput from '../common/forms/formInput';
import TagsSelect from '../common/selects/tagsSelect';
import CategorySelect from '../common/selects/categorySelect';

type ProductForm = {
  _id?: string;
  name: string;
  barcode?: string | number;
  description?: string;
  quantity: string | number;
  price: string | number;
  category?: string;
  tags?: string[];
  inventory_verified?: boolean;
};

const initProduct = {
  name: '',
  barcode: '',
  description: '',
  quantity: '',
  price: '',
  category: '',
  tags: [],
  inventory_verified: false,
};

export type Props = {
  show: boolean;
  toggle: (show: boolean) => void;
  selectedProduct?: ProductForm;
  onCreate?: (product: Product) => void;
  onUpdate?: (product: Product) => void;
};

const SetProductModal = ({
  show,
  toggle,
  selectedProduct,
  onUpdate,
  onCreate,
}: Props) => {
  const [product, setProduct] = useState<ProductForm>(initProduct);
  const productNameInputRef = useRef<HTMLInputElement | null>(null);
  const { user } = useContext(UserContext);

  const handleOnSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.stopPropagation();
    e.preventDefault();
    if (product?._id && user?.username) {
      const response = await updateProduct({
        ...product,
        _id: product._id,
        barcode: product.barcode || null,
        updated_by: user.username,
        updated_by_user_id: user._id,
      });
      if (response.isSuccess && response.result) {
        onUpdate?.(response.result);
        toast.success(response.message);
        toggle(false);
        const result = await createProductEditActivity({
          oldProduct: selectedProduct!,
          newProduct: product,
          transact_by: user.username,
          transact_by_user_id: user._id,
          product_id: product._id,
        });
        return;
      }
      toast.error(response.message);
    } else if (user?.username) {
      const response = await createProduct({
        ...product,
        created_by: user.username,
        created_by_user_id: user._id,
      });
      if (response.isSuccess && response.result) {
        setProduct(initProduct);
        productNameInputRef.current?.focus();
        toast.success(response.message);
        onCreate?.(response.result);
        const result = await createProductAddActivity({
          product,
          transact_by: user.username,
          transact_by_user_id: user._id,
          product_id: response.result._id,
        });
        return;
      }
      toast.error(response.message);
    }
  };

  const handleChange = (updateFields: Partial<ProductForm>) => {
    setProduct({ ...product, ...updateFields });
  };

  const onShow = () => {
    if (selectedProduct) setProduct(selectedProduct);
    else setProduct(initProduct);
  };

  return (
    <Modal show={show} onHide={() => toggle(false)} onShow={onShow} centered>
      <Modal.Header closeButton>
        <Modal.Title>{selectedProduct ? 'Edit' : 'Add'} Product</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleOnSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>
              Product Name <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              ref={productNameInputRef}
              value={product.name}
              onChange={(e) => handleChange({ name: e.target.value })}
              required
              autoFocus
            />
          </Form.Group>
          <FormInput
            formGroupProps={{ className: 'mb-2' }}
            label="Barcode"
            type="number"
            min="0"
            value={product.barcode ?? ''}
            onChange={(e: ChangeEvent<HTMLFormElement>) =>
              handleChange({ barcode: e.target.value })
            }
          />
          <Form.Group className="mb-3">
            <Form.Label>
              Price <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="number"
              min="0"
              step={0.01}
              value={product.price ?? ''}
              onChange={(e) => handleChange({ price: e.target.value })}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>
              Quantity <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="number"
              min="0"
              value={product.quantity}
              onChange={(e) => handleChange({ quantity: e.target.value })}
              required
            />
          </Form.Group>
          <div className="mb-3">
            <CategorySelect
              value={product.category ?? ''}
              onSelect={(category) => handleChange({ category })}
            />
          </div>
          <div className="mb-3">
            <TagsSelect
              value={product.tags ?? []}
              onChange={(v) => handleChange({ tags: v })}
            />
          </div>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              value={product.description ?? ''}
              onChange={(e) => handleChange({ description: e.target.value })}
            />
          </Form.Group>
          {(user?.role === 'admin' || user?.role === 'manager') && (
            <Form.Group className="mb-3">
              <Form.Check
                label="Verified"
                type="checkbox"
                checked={product.inventory_verified ?? false}
                onChange={(e) =>
                  handleChange({ inventory_verified: e.target.checked })
                }
              />
            </Form.Group>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => toggle(false)}>
            Close
          </Button>
          <Button type="submit" variant="primary">
            Save
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default SetProductModal;
