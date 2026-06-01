import {
  Button,
  FormControl,
  FormGroup,
  FormLabel,
  Modal,
} from 'react-bootstrap';
import { useContext, useState } from 'react';
import UserContext from 'renderer/context/userContext';
import { createExpense } from 'renderer/service/expenses';
import { toast } from 'react-toastify';
import { Expense } from 'globalTypes/realm/expenses.type';

export type ExpenseForm = {
  type: string;
  amount: string;
  description: string;
};

export type Props = {
  show: boolean;
  toggle: (show: boolean) => void;
  onSuccess?: (expense: Expense) => void;
};

const AddExpenseModal = ({ show, toggle, onSuccess }: Props) => {
  const { user } = useContext(UserContext);

  const [expense, setExpense] = useState<ExpenseForm>({
    type: '',
    amount: '',
    description: '',
  });

  const handleChange = (updates: Partial<ExpenseForm>) => {
    setExpense({ ...expense, ...updates });
  };

  const handleCancel = () => {
    toggle(false);
  };

  const handleConfirm = async () => {
    if (!user) return;
    if (expense.type.toLocaleLowerCase() === 'item charge') {
      toast.error('"Item Charge" as Expense Type is not allowed');
      return;
    }
    const response = await createExpense({
      type: expense.type,
      amount: +expense.amount,
      description: expense.description,
      transact_by: user.username,
      transact_by_user_id: user._id,
      status: 'unpaid',
    });

    if (response.isSuccess && response.result) {
      toast.success(response.message);
      onSuccess?.(response.result);
      toggle(false);
    } else {
      toast.error(response.message);
    }
  };

  return (
    <Modal show={show} onHide={() => toggle(false)} size="sm" centered>
      <Modal.Header>
        <Modal.Title className="fw-bold text-center d-block w-100">
          Add Expense
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <FormGroup className="mb-2">
          <FormLabel>Expense Type</FormLabel>
          <FormControl
            value={expense.type}
            onChange={(e) => handleChange({ type: e.target.value })}
          />
        </FormGroup>
        <FormGroup className="mb-2">
          <FormLabel>Amount</FormLabel>
          <FormControl
            value={expense.amount}
            onChange={(e) => handleChange({ amount: e.target.value })}
            type="number"
            step={0.01}
          />
        </FormGroup>
        <FormGroup className="mb-2">
          <FormLabel>Description</FormLabel>
          <FormControl
            value={expense.description}
            onChange={(e) => handleChange({ description: e.target.value })}
            as="textarea"
            rows={2}
          />
        </FormGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCancel}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleConfirm}>
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddExpenseModal;
