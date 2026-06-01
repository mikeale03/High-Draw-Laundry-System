import { LaundryChannels } from 'globalTypes/channels/laundryChannels';
import { DeliveryStatus, Laundry, LaundryClaimData, LaundryCreateData, LaundryGetFilter, LaundryUpdatePickupDeliveryData } from 'globalTypes/realm/laundry.types';
import { Response } from 'globalTypes/realm/response.types';

const {
  electron: { ipcRenderer },
} = window;

export const getLaundries = async (params: LaundryGetFilter) => {
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

export const updateDeliveryStatus = async (_id: string, status: DeliveryStatus, transactBy: string, transactById: string) => {
  const response = await ipcRenderer.invoke<Response<Laundry>>(
    LaundryChannels.status,
    _id, status, transactBy, transactById
  );
  return response;
};

export const setPackingQuantity = async (_id: string, quantity: number) => {
  const response = await ipcRenderer.invoke<Response<Laundry>>(
    LaundryChannels.packing,
    _id, quantity
  );
  return response;
};


export const updatePickupDeliveryLaundry = async (params: LaundryUpdatePickupDeliveryData) => {
  const response = await ipcRenderer.invoke<Response<Laundry>>(
    LaundryChannels.updateDelivery,
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
