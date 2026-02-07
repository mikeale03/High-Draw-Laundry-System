export type Product = {
  _id: string;
  name: string;
  barcode?: number;
  barcodeStr?: string;
  description?: string;
  quantity: number;
  price: number;
  category?: string;
  tags?: string[];
  date_created: Date;
  date_updated?: Date;
  created_by: string;
  created_by_user_id: string;
  updated_by?: string;
  updated_by_user_id?: string;
  last_transaction_date?: Date;
  inventory_verified?: boolean;
  image?: string;
};

export type ProductForm = {
  _id?: string;
  name: string;
  barcode?: string | number;
  description?: string;
  quantity: string | number;
  price: string | number;
  inventory_verified?: boolean;
};
