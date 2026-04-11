import Realm, { ObjectSchema } from 'realm';
import {
  Laundry,
  LaundryClaimData,
  LaundryCreateData,
  LaundryGetFilter,
} from '../../globalTypes/realm/laundry.types';
import { create } from './realm';
import { createSales, openSalesRealm, Sales } from './salesRealm';
import { laundryServicePriceRecord } from '../../globalUtils/constants';
import { openProductsRealm, Product, PRODUCTS } from './productsRealm';

const LAUNDRY = 'Laundry';

export class AddOn extends Realm.Object {
  static schema = {
    name: 'AddOn',
    embedded: true,
    properties: {
      productId: 'string',
      productName: 'string',
      quantity: 'int',
      price: 'float',
      totalPrice: 'float',
    },
  };
}

export class LaundrySchema extends Realm.Object<Laundry> {
  static schema: ObjectSchema = {
    name: LAUNDRY,
    properties: {
      _id: { type: 'objectId', default: () => new Realm.BSON.ObjectId() },
      service: 'string',
      servicePrice: 'float',
      customer: { type: 'string', indexed: true },
      loads: 'float[]',
      addOns: { type: 'list', objectType: 'AddOn' },
      addOnsPrice: 'float',
      isPaid: 'bool',
      payment: 'string?',
      claimedDate: 'date?',
      totalAmount: 'float',
      customerNumber: 'string?',
      packingQty: { type: 'int', default: 1 },
      dropOffDate: { type: 'date', indexed: true },
      transactBy: 'string',
      claimedBy: 'string?',
      transactById: 'string',
      claimedById: 'string?',
      transactionId: { type: 'string', indexed: true },
    },
    primaryKey: '_id',
  };
}

export const openLaundryRealm = async () => {
  try {
    const realm = await Realm.open({
      path: '../realm/laundry',
      schema: [LaundrySchema, AddOn],
      schemaVersion: 2,
    });
    return realm;
  } catch (error) {
    console.error(error);
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
  let salesRealm: Realm | undefined;
  let productsRealm: Realm | undefined;
  const { addOns, isPaid, payment, transactBy, transactById } = data;

  try {
    if (isPaid && payment) {
      salesRealm = await openSalesRealm();
      const laundryQuantity = data.loads.length;
      const laundryPrice = laundryServicePriceRecord[data.service];

      const sales: Omit<Sales, '_id'>[] = [
        {
          product_id: `laundry-${data.service}`,
          product_name: `laundry - ${data.service}`,
          quantity: laundryQuantity,
          price: laundryPrice,
          total_price: +(laundryPrice * laundryQuantity).toFixed(2),
          payment,
          date_created: new Date(),
          transact_by: transactBy,
          transact_by_user_id: transactById,
          transaction_id: data.transactionId,
          product_tags: [],
          saleSource: 'laundry',
        },
      ];

      if (addOns.length) {
        productsRealm = await openProductsRealm();

        addOns.forEach((item) => {
          const product = productsRealm?.objectForPrimaryKey<Product>(
            PRODUCTS,
            new Realm.BSON.ObjectID(item.productId)
          );
          if (product) {
            sales.push({
              product_id: 'laundry-add-on',
              product_name: product.name,
              product_category: product.category ?? '',
              product_tags: product.tags ?? [],
              quantity: item.quantity,
              price: item.price,
              total_price: +(item.price * item.quantity).toFixed(2),
              payment,
              date_created: new Date(),
              transact_by: transactBy,
              transact_by_user_id: transactById,
              transaction_id: data.transactionId,
              saleSource: 'laundry',
            });
          }
        });
      }
      await createSales(sales, salesRealm);
      salesRealm.close();
      productsRealm?.close();
    }
  } catch (error) {
    salesRealm?.close();
    console.log(error);
    let message = 'Failed to create Sales for Laundry Transaction';

    return {
      isSuccess: false,
      message,
      error,
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
  limit,
  customer,
  service,
  userId,
  startDate,
  endDate,
  // dropOffDate,
  // claimedDate,
  isPaid,
  isClaimed,
}: LaundryGetFilter) => {
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
  if (userId) {
    query.push(`(transactById == $${args.length} OR claimedById == $${args.length})`);
    args.push(userId);
  }
  if (startDate) {
    query.push(`(dropOffDate >= $${args.length} OR claimedDate >= $${args.length})`);
    args.push(startDate);
  }
  if (endDate) {
    query.push(`(dropOffDate <= $${args.length} OR claimedDate <= $${args.length})`);
    args.push(endDate);
  }
  // if (dropOffDate) {
  //   const dropOffStartDate = new Date(dropOffDate);
  //   dropOffStartDate.setHours(0, 0, 0, 0);
  //   query.push(`dropOffDate >= $${args.length}`);
  //   args.push(dropOffStartDate);

  //   const dropOffEndDate = new Date(dropOffDate);
  //   dropOffEndDate.setHours(23, 59, 59, 999);
  //   query.push(`dropOffDate <= $${args.length}`);
  //   args.push(dropOffEndDate);
  // }
  // if (claimedDate) {
  //   const claimStartDate = new Date(claimedDate);
  //   claimStartDate.setHours(0, 0, 0, 0);
  //   query.push(`claimedDate >= $${args.length}`);
  //   args.push(claimStartDate);

  //   const claimEndDate = new Date(claimedDate);
  //   claimEndDate.setHours(23, 59, 59, 999);
  //   query.push(`claimedDate <= $${args.length}`);
  //   args.push(claimEndDate);
  // }
  if (isPaid) {
    const isYes = isPaid === 'yes';
    query.push(`isPaid == $${args.length}`);
    args.push(isYes);
  }
  if (isClaimed) {
    const isYes = isClaimed === 'yes';
    isYes ? query.push(`claimedDate != nil`) : query.push(`claimedDate == nil`);
  }

  try {
    const laundries = realm
      .objects(LAUNDRY)
      .filtered(
        `${query.join(' && ')} SORT(dropOffDate DESC)${
          limit ? ` LIMIT(${limit})` : ''
        }`,
        ...args
      );
    const result = laundries.toJSON() as Laundry[];

    realm.close();
    return {
      isSuccess: true,
      result: result.map((item) => ({
        ...item,
        _id: item._id.toString(),
      })),
      message: 'Successfully get Laundries',
    };
  } catch (error) {
    console.error(error);
    realm.close();
    return {
      isSuccess: false,
      message: 'Failed to get Laundries',
      error,
    };
  }
};

export const claimLaundry = async ({
  _id,
  payment,
  claimedBy,
  claimedById,
}: LaundryClaimData) => {
  const realm = await openLaundryRealm();
  if (!realm) {
    return {
      isSuccess: false,
      message: 'Error opening realm db',
    };
  }
  try {
    const laundry = realm?.objectForPrimaryKey<Laundry>(
      LAUNDRY,
      new Realm.BSON.ObjectID(_id)
    );

    if (!laundry) {
      realm.close();
      return {
        isSuccess: false,
        message: 'Laundry not found',
      };
    }

    if (!laundry.isPaid) {
      let productsRealm: Realm | undefined;
      const salesRealm = await openSalesRealm();
      const laundryQuantity = laundry.loads.length;
      const laundryPrice = laundryServicePriceRecord[laundry.service];

      const sales: Omit<Sales, '_id'>[] = [
        {
          product_id: `laundry-${laundry.service}`,
          product_name: `laundry - ${laundry.service}`,
          quantity: laundryQuantity,
          price: laundryPrice,
          total_price: +(laundryPrice * laundryQuantity).toFixed(2),
          payment: payment || 'cash',
          date_created: new Date(),
          transact_by: claimedBy,
          transact_by_user_id: claimedById,
          transaction_id: laundry.transactionId,
          product_tags: [],
          saleSource: 'laundry',
        },
      ];
      if (laundry.addOns.length) {
        const { addOns } = laundry;
        productsRealm = await openProductsRealm();

        addOns.forEach((item) => {
          const product = productsRealm?.objectForPrimaryKey<Product>(
            PRODUCTS,
            new Realm.BSON.ObjectID(item.productId)
          );
          if (product) {
            sales.push({
              product_id: 'laundry-add-on',
              product_name: `${product.name}`,
              product_category: product.category ?? '',
              product_tags: product.tags ?? [],
              quantity: item.quantity,
              price: item.price,
              total_price: +(item.price * item.quantity).toFixed(2),
              payment: payment || 'cash',
              date_created: new Date(),
              transact_by: claimedBy,
              transact_by_user_id: claimedById,
              transaction_id: laundry.transactionId,
              saleSource: 'laundry',
            });
          }
        });
      }
      await createSales(sales, salesRealm);
      salesRealm.close();
      productsRealm?.close();
    }
    realm.write(() => {
      laundry.claimedDate = new Date();
      laundry.isPaid = true;
      laundry.claimedBy = claimedBy;
      laundry.claimedById = claimedById;
    });
    let result = laundry?.toJSON() as Laundry;
    result._id = result._id.toString();
    realm.close();

    return {
      isSuccess: true,
      message: 'Successfully claimed Laundry',
      result,
    };
  } catch (error) {
    console.error(error);
    realm.close();
    return {
      isSuccess: false,
      message: 'Failed to claim Laundry',
      error,
    };
  }
};

export const setPackingQuantity = async (_id: string, quantity: number) => {
  const realm = await openLaundryRealm();

  if (!realm)
    return {
      isSuccess: false,
      message: 'Error opening laundry realm db',
    };
  try {
    let laundry = realm.objectForPrimaryKey<Laundry>(
      LAUNDRY,
      new Realm.BSON.ObjectID(_id)
    );
    if (!laundry) {
      realm.close();
      return {
        isSuccess: false,
        message: 'Laundry entry not found',
      };
    }

    realm.write(() => {
      laundry.packingQty = quantity;
    });

    realm?.close();
    return {
      isSuccess: true,
      message: 'Successfully set packing quantity',
    };
  } catch (error) {
    console.log(error);
    realm?.close();
    return {
      isSuccess: false,
      message: 'Failed to update Laundry Entry',
      error,
    };
  }
};

export const deleteLaundry = async (_id: string) => {
  const realm = await openLaundryRealm();

  if (!realm)
    return {
      isSuccess: false,
      message: 'Error opening laundry realm db',
    };
  try {
    let laundry = realm.objectForPrimaryKey<Laundry>(
      LAUNDRY,
      new Realm.BSON.ObjectID(_id)
    );
    if (!laundry) {
      realm.close();
      return {
        isSuccess: false,
        message: 'Laundry entry not found',
      };
    }

    const salesRealm = await openSalesRealm();
    let sales = salesRealm
      .objects<Sales>('Sales')
      .filtered(`transaction_id == '${laundry.transactionId}'`);

    if (sales) {
      salesRealm.write(() => {
        salesRealm.delete(sales);
      });
    }

    realm.write(() => {
      realm.delete(laundry);
      laundry = null;
    });

    realm?.close();
    salesRealm.close();
    return {
      isSuccess: true,
      message: 'Successfully deleted Laundry Entry',
    };
  } catch (error) {
    console.log(error);
    realm?.close();
    return {
      isSuccess: false,
      message: 'Failed to delete Laundry Entry',
      error,
    };
  }
};
