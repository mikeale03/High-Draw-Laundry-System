export const LaundryChannels = {
  create: 'laundries:create',
  update: 'laundries:update',
  delete: 'laundries:delete',
  get: 'laundries:get',
  claim: 'laundries:claim',
  packing: 'laundries:packing',
} as const;

export type LaundryChannels =
  (typeof LaundryChannels)[keyof typeof LaundryChannels];
