export type Sales = {
  _id: string;
  product_id: string;
  product_name: string;
  product_category?: string;
  product_tags: string[];
  quantity: number;
  price: number;
  total_price: number;
  payment: 'cash' | 'gcash';
  date_created: Date;
  transact_by: string;
  transact_by_user_id: string;
  transaction_id: string;
  remaining_quantity?: number;
  isVoid?: boolean;
  saleSource?: 'laundry';
};

export type Items = Record<
  string,
  {
    _id: string;
    quantity: number;
    price: number;
    totalPrice: number;
    name: string;
  }
>;
