import { IpcMain, IpcMainInvokeEvent } from 'electron';
import { Channels } from '../../globalTypes/channels/mobileNumberChannels';
import {
  createMobileNumber,
  deleteMobileNumber,
  getCustomers,
  getMobileNumbers,
  updateMobileNumber,
} from '../service/mobileNumbersRealm';

const setMobileNumbersEventHandler = (ipcMain: IpcMain) => {
  ipcMain.handle(
    Channels.create,
    async (
      event: IpcMainInvokeEvent,
      data: { mobile?: string; name: string }
    ) => {
      const result = await createMobileNumber(data);
      return result;
    }
  );
  ipcMain.handle(
    Channels.getAll,
    async (event: IpcMainInvokeEvent, searchText: string, limit?: number) => {
      const result = await getMobileNumbers(searchText, limit);
      return result;
    }
  );
  ipcMain.handle(
    Channels.getCustomers,
    async (event: IpcMainInvokeEvent, searchText: string, limit?: number) => {
      const result = await getCustomers(searchText, limit);
      return result;
    }
  );
  ipcMain.handle(
    Channels.update,
    async (
      event: IpcMainInvokeEvent,
      currentNumber,
      data: { mobile?: string; name: string }
    ) => {
      const result = await updateMobileNumber(currentNumber, data);
      return result;
    }
  );
  ipcMain.handle(Channels.delete, async (event: IpcMainInvokeEvent, number) => {
    const result = await deleteMobileNumber(number);
    return result;
  });
};

export default setMobileNumbersEventHandler;
