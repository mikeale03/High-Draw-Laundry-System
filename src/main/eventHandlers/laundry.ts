import { IpcMain, IpcMainInvokeEvent } from 'electron';
import { LaundryClaimData, LaundryCreateData, LaundryPaginatedGetFilter } from '../../globalTypes/realm/laundry.types';
import { LaundryChannels } from '../../globalTypes/channels/laundryChannels';
import { claimLaundry, createLaundry, deleteLaundry, getLaundries } from '../service/laundryRealm';


const setLaundryEventHandler = (ipcMain: IpcMain) => {
  ipcMain.handle(LaundryChannels.get, async (
    event: IpcMainInvokeEvent,
    params: LaundryPaginatedGetFilter
  ) => {
    const result = await getLaundries(params);
    return result;
  });
  ipcMain.handle(
    LaundryChannels.create,
    async (event: IpcMainInvokeEvent, params: LaundryCreateData) => {
      const result = await createLaundry(params);
      return result;
    }
  );
  ipcMain.handle(
    LaundryChannels.claim,
    async (event: IpcMainInvokeEvent, params: LaundryClaimData) => {
      const result = await claimLaundry(params);
      return result;
    }
  );
  ipcMain.handle(
    LaundryChannels.delete,
    async (event: IpcMainInvokeEvent, _id: string) => {
      const result = await deleteLaundry(_id);
      return result;
    }
  );
};

export default setLaundryEventHandler;
