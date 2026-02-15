export const LaundryChannels = {
  create: 'laundries:create',
  update: 'laundries:update',
  delete: 'laundries:delete',
  get: 'laundries:get',
  claim: 'laundries:claim',
} as const;

export type LaundryChannels =
  (typeof LaundryChannels)[keyof typeof LaundryChannels];
