import Realm, { ObjectSchema } from 'realm';
import { Customer, MobileNumber } from 'globalTypes/realm/mobileNumber.types';
import { v4 as uuid } from 'uuid';
import { create } from './realm';

export const MOBILENUMBER = 'MobileNumber'; // name as Customers in front end

export class MobileNumberSchema extends Realm.Object<MobileNumber> {
  static schema: ObjectSchema = {
    name: MOBILENUMBER,
    properties: {
      number: { type: 'string', indexed: true },
      mobile: 'string?',
      name: 'string',
    },
    primaryKey: 'number',
  };
}

export const openMobileNumberRealm = async () => {
  try {
    const realm = await Realm.open({
      path: '../realm/mobile-number',
      schema: [MobileNumberSchema],
      schemaVersion: 2,
      onMigration: (oldRealm, newRealm) => {
        // only apply this change if upgrading to schemaVersion 2
        if (oldRealm.schemaVersion < 2) {
          const oldObjects = oldRealm.objects<MobileNumber>(MOBILENUMBER);
          const newObjects = newRealm.objects<MobileNumber>(MOBILENUMBER);
          // loop through all objects and set the mobile property in the new schema
          for (const objectIndex in oldObjects) {
            const oldObject = oldObjects[objectIndex];
            const newObject = newObjects[objectIndex];
            newObject.mobile = oldObject.number;
          }
        }
      },
    });
    return realm;
  } catch (error) {
    return undefined;
  }
};

export const createMobileNumber = async (data: Customer) => {
  const realm = await openMobileNumberRealm();
  if (!realm) {
    return {
      isSuccess: false,
      message: 'Error opening realm db',
    };
  }

  try {
    const task = create<MobileNumber>(realm, MOBILENUMBER, {
      ...data,
      number: data.mobile || uuid(),
    });
    const result = task?.toJSON() as MobileNumber;
    realm.close();

    return {
      isSuccess: true,
      message: 'Successfully created Customer',
      result,
    };
  } catch (error: any) {
    realm.close();
    console.log(error);
    let message = 'Failed to create Customer';
    if (error.code === 'ObjectAlreadyExists') message = 'Number already exists';

    return {
      isSuccess: false,
      message,
      error,
    };
  }
};

export const updateMobileNumber = async (
  currentNumber: string,
  updates: Customer
) => {
  const realm = await openMobileNumberRealm();
  if (!realm) {
    return {
      isSuccess: false,
      message: 'Error opening realm db',
    };
  }

  try {
    const customer = realm.objectForPrimaryKey<MobileNumber>(
      MOBILENUMBER,
      currentNumber
    );
    if (!customer)
      return {
        isSuccess: false,
        message: 'Customer not found',
      };
    if (updates.mobile && updates.mobile !== customer.mobile) {
      const duplicateNumber = realm.objectForPrimaryKey<MobileNumber>(
        MOBILENUMBER,
        updates.mobile
      );
      if (duplicateNumber) {
        return {
          isSuccess: false,
          message: 'Number already exists',
        };
      }
    }

    realm.write(() => {
      customer.mobile = updates.mobile;
      customer.name = updates.name;
      customer.number = updates.mobile || customer.number;
    });

    const result = customer.toJSON();
    realm.close();

    return {
      isSuccess: true,
      message: 'Successfully updated Mobile Number',
      result,
    };
  } catch (error) {
    realm.close();
    console.log(error);
    return {
      isSuccess: false,
      message: 'Failed to update Mobile Number',
      error,
    };
  }
};

export const getMobileNumbers = async (
  // eslint-disable-next-line default-param-last
  searchText: string = '',
  limit?: number
) => {
  const realm = await openMobileNumberRealm();
  if (!realm) {
    return {
      isSuccess: false,
      message: 'Error opening realm db',
    };
  }
  let query = `(mobile CONTAINS[c] '${searchText}' OR name CONTAINS[c] '${searchText}') AND (mobile != nil AND mobile != '')`;

  if (limit) {
    query += ` LIMIT(${limit})`;
  }

  try {
    const numbers = realm.objects(MOBILENUMBER).filtered(query);
    const result = numbers.toJSON();

    realm.close();
    return {
      isSuccess: true,
      result,
      message: 'Successfully get Mobile Numbers',
    };
  } catch (error) {
    console.error(error);
    realm.close();
    return {
      isSucces: false,
      message: 'Failed to get Mobile Numbers',
      error,
    };
  }
};

export const getCustomers = async (
  // eslint-disable-next-line default-param-last
  searchText: string = '',
  limit?: number
) => {
  const realm = await openMobileNumberRealm();
  if (!realm) {
    return {
      isSuccess: false,
      message: 'Error opening realm db',
    };
  }
  let query = `mobile CONTAINS[c] '${searchText}' OR name CONTAINS[c] '${searchText}'`;

  if (limit) {
    query += ` LIMIT(${limit})`;
  }

  try {
    const numbers = realm.objects(MOBILENUMBER).filtered(query);
    const result = numbers.toJSON();

    realm.close();
    return {
      isSuccess: true,
      result,
      message: 'Successfully get users',
    };
  } catch (error) {
    console.error(error);
    realm.close();
    return {
      isSucces: false,
      message: 'Failed to get users',
      error,
    };
  }
};

export const deleteMobileNumber = async (number: string) => {
  const realm = await openMobileNumberRealm();
  if (!realm) {
    return {
      isSuccess: false,
      message: 'Error opening realm db',
    };
  }

  try {
    let mobileNumber = realm.objectForPrimaryKey<MobileNumber>(
      MOBILENUMBER,
      number
    );
    if (!mobileNumber)
      return {
        isSuccess: false,
        message: 'Number not found',
      };

    realm.write(() => {
      realm.delete(mobileNumber);
      mobileNumber = null;
    });

    realm.close();

    return {
      isSuccess: true,
      message: 'Successfully deleted Mobile Number',
    };
  } catch (error) {
    realm.close();
    return {
      isSucces: false,
      message: 'Failed to delete number',
      error,
    };
  }
};
