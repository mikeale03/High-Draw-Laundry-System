import { IpcMain, IpcMainInvokeEvent } from 'electron';
import { LaundryCreateData, LaundryPaginatedGetFilter } from '../../globalTypes/realm/laundry.types';
import { LaundryChannels } from '../../globalTypes/channels/laundryChannels';
import { createLaundry, getLaundries } from '../service/laundryRealm';


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
};

export default setLaundryEventHandler;
