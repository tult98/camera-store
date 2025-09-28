import { sdk } from '@modules/shared/api/medusa-client';

export const uploadFile = async (file: File) => {
  const response = await sdk.admin.upload.create({
    files: [file]
  });
  return response.files[0];
};