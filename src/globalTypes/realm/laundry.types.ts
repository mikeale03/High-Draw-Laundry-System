export type Laundry = {
  _id: string;
  service: 'drop-off' | 'self-service';
  customer: string;
  loads: number[];
  addOns: number;
  isPaid: boolean;
  claimDate?: Date;
  dropOffDate: Date;
  amount: number;
  customerNumber?: string;
  transactBy: string,
  claimedBy?: string,
  transactById: string,
  claimedById?: string,
}

export type LaundryCreateData = Omit<Laundry, '_id'>

export type LaundryPaginatedGetFilter = {
  pageNumber: number;
  pageSize: number;
  customer: string;
  service: string;
  dropOffDate?: Date | null;
  claimDate?: Date | null;
  isPaid: string;
  isClaimed: string;
}
