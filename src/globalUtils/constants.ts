export const laundryServicePriceRecord = {
  ['drop-off']: 170,
  ['wash only']: 50,
  ['wash and dry']: 115,
  ['pickup only']: 170,
  ['pickup and delivery']: 170,
} as const;

export const deliveryChargeRecord = {
  ['pickup only']: 30,
  ['pickup and delivery']: 50,
} as const;

export const deliveryStatusLevel = {
  ['for pickup']: 0,
  ['on process']: 1,
  ['pending delivery']: 2,
  ['dispatched']: 3,
  ['completed']: 4
} as const;

export const deliveryStatus = ['for pickup', 'on process', 'pending delivery', 'dispatched', 'completed'] as const;
