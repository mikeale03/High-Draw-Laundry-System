export type AddOn = {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  totalPrice: number;
}

export type Laundry = {
  _id: string;
  service: 'drop-off' | 'wash and dry' | 'wash only';
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
  packingQty: number;
  transactBy: string;
  claimedBy?: string;
  transactById: string;
  claimedById?: string;
  transactionId: string;
}

export type LaundryCreateData = Omit<Laundry, '_id' | 'packingQty'>

export type LaundryClaimData = {
  _id: string;
  payment?: 'cash' | 'gcash';
  claimedBy: string;
  claimedById: string;
}

export type LaundryGetFilter = {
  userId?: string;
  customer: string;
  service: string;
  startDate?: Date | null;
  endDate?: Date | null;
  // dropOffDate?: Date | null;
  // claimedDate?: Date | null;
  isPaid: string;
  isClaimed: string;
  limit?: number;
}


export type LaundryPaginatedGetFilter = {
  pageNumber: number;
  pageSize: number;
  userId?: string;
  customer: string;
  service: string;
  startDate?: Date | null;
  endDate?: Date | null;
  // dropOffDate?: Date | null;
  // claimedDate?: Date | null;
  isPaid: string;
  isClaimed: string;
}
