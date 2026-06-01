export const LaundryChannels = {
  create: 'laundries:create',
  update: 'laundries:update',
  delete: 'laundries:delete',
  get: 'laundries:get',
  claim: 'laundries:claim',
  status: 'laundries:status',
  packing: 'laundries:packing',
  updateDelivery: 'laundries:update-delivery',
} as const;

export type LaundryChannels =
  (typeof LaundryChannels)[keyof typeof LaundryChannels];
