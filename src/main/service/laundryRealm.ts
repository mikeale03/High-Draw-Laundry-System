import Realm, { ObjectSchema } from "realm";
import { Laundry, LaundryCreateData, LaundryPaginatedGetFilter } from "../../globalTypes/realm/laundry.types";
import { create } from "./realm";

const LAUNDRY = 'Laundry';

export class LaundrySchema extends Realm.Object<Laundry> {
  static schema: ObjectSchema = {
    name: LAUNDRY,
    properties: {
      _id: { type: 'objectId', default: () => new Realm.BSON.ObjectId() },
      service: 'string',
      customer: { type: 'string', indexed: true },
      loads: 'float[]',
      addOns: 'int',
      isPaid: 'bool',
      claimDate: 'date?',
      amount: 'float',
      customerNumber: 'string?',
      dropOffDate: { type: 'date', indexed: true },
      transactBy: 'string',
      claimedBy: 'string?',
      transactById: 'string',
      claimById: 'string?',
    },
    primaryKey: '_id',
  };
}

export const openLaundryRealm = async () => {
  try {
    const realm = await Realm.open({
      path: '../realm/laundry',
      schema: [LaundrySchema],
      schemaVersion: 2,
    });
    return realm;
  } catch (error) {
    return undefined;
  }
};

export const createLaundry = async (data: LaundryCreateData) => {
  const realm = await openLaundryRealm();
  if (!realm) {
    return {
      isSuccess: false,
      message: 'Error opening realm db',
    };
  }

  try {
    const task = create<LaundryCreateData>(realm, LAUNDRY, data);
    const result = task?.toJSON() as Laundry;
    realm.close();

    return {
      isSuccess: true,
      message: 'Successfully created Laundry Transaction',
      result,
    };
  } catch (error: any) {
    realm.close();
    console.log(error);
    let message = 'Failed to create Laundry Transaction';

    return {
      isSuccess: false,
      message,
      error,
    };
  }
};



export const getLaundries = async ({
  pageNumber,
  pageSize,
  customer,
  service,
  dropOffDate,
  claimDate,
  isPaid,
  isClaimed,
}: LaundryPaginatedGetFilter) => {
  const realm = await openLaundryRealm();
  if (!realm) {
    return {
      isSuccess: false,
      message: 'Error opening realm db',
    };
  }
  const query: string[] = [];
  const args = [];

  query.push(`customer CONTAINS[c] $${args.length}`);
  args.push(customer);

  if (service) {
    query.push(`service == $${args.length}`);
    args.push(service);
  }
  if (dropOffDate) {
    const dropOffStartDate = new Date(dropOffDate);
    dropOffStartDate.setHours(0, 0, 0, 0);
    query.push(`dropOffDate >= $${args.length}`);
    args.push(dropOffStartDate);

    const dropOffEndDate = new Date(dropOffDate);
    dropOffEndDate.setHours(23, 59, 59, 999);
    query.push(`dropOffDate <= $${args.length}`);
    args.push(dropOffEndDate);
  }
  if (claimDate) {
    const claimStartDate = new Date(claimDate);
    claimStartDate.setHours(0, 0, 0, 0);
    query.push(`claimDate >= $${args.length}`);
    args.push(claimStartDate);

    const claimEndDate = new Date(claimDate);
    claimEndDate.setHours(23, 59, 59, 999);
    query.push(`claimDate <= $${args.length}`);
    args.push(claimEndDate);
  }
  if (isPaid) {
    const isYes = isPaid === 'yes';
    query.push(`isPaid == $${args.length}`);
    args.push(isYes);
  }
  if (isClaimed) {
    const isYes = isClaimed === 'yes';
    isYes ?
      query.push(`claimDate != nil`):
      query.push(`claimDate == nil`)
  }

  try {
    const laundries = realm.objects(LAUNDRY).filtered(
      `${query.join(' && ')} SORT(dropOffDate DESC) LIMIT(${(pageNumber * pageSize) + 1})`,
      ...args
    );
    const result = laundries.toJSON();

    realm.close();
    return {
      isSuccess: true,
      result,
      message: 'Successfully get Laundries',
    };
  } catch (error) {
    console.error(error);
    realm.close();
    return {
      isSucces: false,
      message: 'Failed to get Laundries',
      error,
    };
  }
};
