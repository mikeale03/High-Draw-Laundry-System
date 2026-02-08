import { LaundryChannels } from 'globalTypes/channels/laundryChannels';
import { Laundry, LaundryCreateData, LaundryPaginatedGetFilter } from 'globalTypes/realm/laundry.types';
import { Response } from 'globalTypes/realm/response.types';

const {
  electron: { ipcRenderer },
} = window;

export const getLaundries = async (params: LaundryPaginatedGetFilter) => {
  const response = await ipcRenderer.invoke<Response<Laundry[]>>(
    LaundryChannels.get,
    params
  );
  return response;
};

export const createLaundry = async (params: LaundryCreateData) => {
  const response = await ipcRenderer.invoke<Response<Laundry[]>>(
    LaundryChannels.create,
    params
  );
  return response;
};

