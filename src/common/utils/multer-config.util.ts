import { diskStorage, memoryStorage } from 'multer';
import path, { extname } from 'path';

export const fileDestination = path.join(process.cwd(), 'uploads');

export const multerDiskConfig = {
  storage: diskStorage({
    destination: fileDestination,
    filename: (req, file, callback) => {
      console.info(`Request: ${req}`);
      console.info(`File: ${file}`);

      const ext = extname(file.originalname);
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    },
  }),
  fileFilter: (
    req: Express.Request,
    file: Express.Multer.File,
    callback: (error: Error | null, acceptFile: boolean) => void,
  ) => {
    console.info(`Request: ${req}`);

    if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
      return callback(new Error('Only image files are allowed!'), false);
    }
    callback(null, true);
  },
};

export const multerMemoryConfig = {
  storage: memoryStorage(),
  fileFilter: (
    req: Express.Request,
    file: Express.Multer.File,
    callback: (error: Error | null, acceptFile: boolean) => void,
  ) => {
    if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
      return callback(new Error('Only image files are allowed!'), false);
    }
    callback(null, true);
  },
};
