export type AddOn = {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  totalPrice: number;
}

export type LaundryService = 'drop-off' | 'wash and dry' | 'wash only' | 'pickup only' | 'pickup and delivery';
export type DeliveryStatus = 'for pickup' | 'on process' | 'pending delivery' | 'dispatched' | 'completed';

export type Laundry = {
  _id: string;
  laundryId: string;
  service: LaundryService;
  servicePrice: number;
  customer: string;
  loads: number[];
  deliveryCharge?: number;
  deliveryStatus?: DeliveryStatus;
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

export type LaundryCreateData = Omit<Laundry, '_id' | 'laundryId' | 'packingQty'>

export type LaundryUpdatePickupDeliveryData = {
  _id: string;
  loads: number[];
  service: LaundryService;
  deliveryCharge: number;
  deliveryStatus: DeliveryStatus;
  addOns: AddOn[];
  addOnsPrice: number;
  isPaid: boolean;
  payment?: 'cash' | 'gcash';
  totalAmount: number;
  transactBy: string;
  transactById: string;
}

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
  isPaid: string;
  isClaimed: string;
  limit?: number;
  dateFilter: 'claimedDate' | 'dropOffDate',
  deliveryStatus: DeliveryStatus | '',
}


export type LaundryPaginatedGetFilter = {
  pageNumber: number;
  pageSize: number;
  userId?: string;
  customer: string;
  service: string;
  startDate?: Date | null;
  endDate?: Date | null;
  isPaid: string;
  isClaimed: string;
  dateFilter: 'claimedDate' | 'dropOffDate',
  deliveryStatus: DeliveryStatus | '',
}
