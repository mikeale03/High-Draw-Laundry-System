import { LaundryPaginatedGetFilter } from 'globalTypes/realm/laundry.types';
import { create } from 'zustand';

interface State {
  state: LaundryPaginatedGetFilter;
  setState: (update: Partial<State['state']>) => void;
}

const startDate = new Date();
startDate.setHours(0,0,0,0)
const endDate = new Date();
endDate.setHours(23, 59, 59, 999)

const useLaundryFilterStore = create<State>((set) => ({
  state: {
    pageNumber: 1,
    pageSize: 50,
    userId: '',
    customer: '',
    service: '',
    startDate: null,
    endDate: null,
    isPaid: '',
    isClaimed: '',
    dateFilter: 'dropOffDate'
  },
  setState: (update) =>
    set((state) => ({ state: { ...state.state, ...update } })),
}));

export default useLaundryFilterStore;
