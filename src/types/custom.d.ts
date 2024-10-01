import { Express } from 'express';
import { File } from 'multer'



declare global {
  namespace Express {
    interface Request {
      file?: Multer.File;
    }
  }

interface Error {
    statusCode?: number;
  }

interface SuccessfulRequest extends Request {
    value: {};
}

}