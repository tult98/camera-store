import { sdk } from '@/modules/shared/api/medusa-client';

export const uploadImages = async (files: File[]) => {
  const response = await sdk.admin.upload.create({
    files: files,
  });
  return response.files;
};