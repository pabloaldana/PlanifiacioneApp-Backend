import { BadRequestException } from "@nestjs/common"

type MulterCallback = (error: Error | null, acceptFile: boolean) => void;

const createFileFilter = (validExtensions: string[], errorMessage: string) =>
  (req: Express.Request, file: Express.Multer.File, callback: MulterCallback) => {
    if (!file) return callback(new BadRequestException('El archivo es obligatorio'), false);
    const ext = file.mimetype.split('/')[1];
    if (validExtensions.includes(ext)) return callback(null, true);
    callback(new BadRequestException(errorMessage), false);
  };

export const fileFilter = createFileFilter(
  ['pdf', 'msword', 'vnd.openxmlformats-officedocument.wordprocessingml.document'],
  'Tipo de archivo no permitido. Solo PDF o DOC.',
);

export const imageFileFilter = createFileFilter(
  ['jpg', 'jpeg', 'png', 'webp'],
  'Tipo de archivo no permitido. Solo JPG, PNG o WEBP.',
);
