"use strict";
// import { BlobServiceClient } from '@azure/storage-blob';
// import { v1 as uuidv1 } from 'uuid';
// const dotenv = require('dotenv')
// dotenv.config();
// const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING || '';
// if (!AZURE_STORAGE_CONNECTION_STRING) {
//     throw new Error('Azure Storage Connection string not found');
// }
// const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
// export const uploadImageToAzure = async (containerName: string, file: Express.Multer.File): Promise<string> => {
//     const containerClient = blobServiceClient.getContainerClient(containerName);
//     const blobName = `${uuidv1()}-${file.originalname}`;
//     const blockBlobClient = containerClient.getBlockBlobClient(blobName);
//     await blockBlobClient.uploadData(file.buffer, {
//         blobHTTPHeaders: { blobContentType: file.mimetype },
//     });
//     return blockBlobClient.url;
// };
