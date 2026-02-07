import {
  Button,
  Form,
  FormControl,
  FormGroup,
  FormLabel,
  Modal,
} from 'react-bootstrap';
import { FormEvent, useState } from 'react';
import {
  createMobileNumber,
  updateMobileNumber,
} from 'renderer/service/mobileNumbers';
import { toast } from 'react-toastify';
import { MobileNumber } from 'globalTypes/realm/mobileNumber.types';

export type CustomerForm = {
  mobile?: string | null;
  name: string;
};

export type Props = {
  show: boolean;
  toggle: (show: boolean) => void;
  selectedMobileNumber?: MobileNumber;
  onSuccess?: (customer: MobileNumber) => void;
};

const SetMobileNumberModal = ({
  show,
  toggle,
  selectedMobileNumber,
  onSuccess,
}: Props) => {
  const [customer, setMobileNumber] = useState<CustomerForm>({
    mobile: '',
    name: '',
  });

  const handleChange = (updates: Partial<CustomerForm>) => {
    setMobileNumber({ ...customer, ...updates });
  };

  const handleCancel = () => {
    toggle(false);
  };

  const handleConfirm = async (e: FormEvent) => {
    e.preventDefault();
    const { mobile, name } = customer;
    const data = { mobile: mobile?.trim() || '', name };
    const response = selectedMobileNumber
      ? await updateMobileNumber(selectedMobileNumber.number, data)
      : await createMobileNumber(data);

    if (response.isSuccess && response.result) {
      toast.success(response.message);
      onSuccess?.(response.result);
      toggle(false);
    } else {
      toast.error(response.message);
    }
  };

  const onShow = () => {
    setMobileNumber(
      selectedMobileNumber ?? {
        mobile: '',
        name: '',
      }
    );
  };

  return (
    <Modal
      show={show}
      onHide={() => toggle(false)}
      onShow={onShow}
      size="sm"
      centered
    >
      <Form onSubmit={handleConfirm}>
        <Modal.Header>
          <Modal.Title className="fw-bold text-center d-block w-100">
            {selectedMobileNumber ? 'Edit' : 'Add'} Customer
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormGroup className="mb-3">
            <FormLabel>Number</FormLabel>
            <FormControl
              value={customer.mobile ?? ''}
              type="number"
              onChange={(e) => handleChange({ mobile: e.target.value })}
            />
          </FormGroup>
          <FormGroup className="mb-3">
            <FormLabel>
              Name <span className="text-danger">*</span>
            </FormLabel>
            <FormControl
              value={customer.name}
              onChange={(e) => handleChange({ name: e.target.value })}
              required
            />
          </FormGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Confirm
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default SetMobileNumberModal;
