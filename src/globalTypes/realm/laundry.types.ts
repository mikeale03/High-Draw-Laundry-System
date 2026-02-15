export type AddOn = {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  totalPrice: number;
}

export type Laundry = {
  _id: string;
  service: 'drop-off' | 'self-service';
  servicePrice: number;
  customer: string;
  loads: number[];
  addOns: AddOn[];
  addOnsPrice: number;
  isPaid: boolean;
  payment?: 'cash' | 'gcash';
  claimedDate?: Date;
  dropOffDate: Date;
  totalAmount: number;
  customerNumber?: string;
  transactBy: string;
  claimedBy?: string;
  transactById: string;
  claimedById?: string;
  transactionId: string;
}

export type LaundryCreateData = Omit<Laundry, '_id'>

export type LaundryClaimData = {
  _id: string;
  payment?: 'cash' | 'gcash';
  claimedBy: string;
  claimedById: string;
}

export type LaundryPaginatedGetFilter = {
  pageNumber: number;
  pageSize: number;
  customer: string;
  service: string;
  dropOffDate?: Date | null;
  claimedDate?: Date | null;
  isPaid: string;
  isClaimed: string;
}
