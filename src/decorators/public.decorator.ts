import { SetMetadata } from '@nestjs/common';

export const BYPASS_KEY = 'isPublic';
export const Public = () => {
  return SetMetadata(BYPASS_KEY, true);
};
