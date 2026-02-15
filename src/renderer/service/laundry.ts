import { LaundryChannels } from 'globalTypes/channels/laundryChannels';
import { Laundry, LaundryClaimData, LaundryCreateData, LaundryPaginatedGetFilter } from 'globalTypes/realm/laundry.types';
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

export const claimLaundry = async (params: LaundryClaimData) => {
  const response = await ipcRenderer.invoke<Response<Laundry>>(
    LaundryChannels.claim,
    params
  );
  return response;
};

export const deleteLaundry = async (_id: string) => {
  const response = await ipcRenderer.invoke<Response<void>>(
    LaundryChannels.delete,
    _id
  );
  return response;
};
