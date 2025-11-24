import { Injectable, Inject } from '@nestjs/common';
import { v2 as Cloudinary } from 'cloudinary';

@Injectable()
export class FilesService {
  constructor(
    @Inject('CLOUDINARY') private readonly cloudinary: typeof Cloudinary,
  ) {}


  async uploadFile(file: Express.Multer.File) {
  try {
    const result = await new Promise<any>((resolve, reject) => {
      const uploadStream = this.cloudinary.uploader.upload_stream(
        {
          folder: 'PlanificacionesDB',
          resource_type: 'auto',          // archivos PDF, Excel, etc.
          use_filename: true,
          unique_filename: false,
          access_mode: 'public',
          filename_override: file.originalname,
          // format: 'pdf'
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );
      uploadStream.end(file.buffer);
    });
    // URL que abre en navegador (preview)
    const viewUrl = result.secure_url;

    // URL que fuerza descarga
    const downloadUrl = this.cloudinary.url(result.public_id, {
      resource_type: 'raw',
      transformation: [{ flags: 'attachment' }],  // importante para descarga
    });

    // Retornamos ambos, el que vamos a guardar en DB es downloadUrl
    return {
      url: viewUrl,   // <-- este es el que guardas en la DB
      public_id: result.public_id,
    };

  } catch (error) {
    throw new Error(`Error al subir archivo: ${error.message}`);
  }
  }

  async deleteFile(public_id: string) {
    return this.cloudinary.uploader.destroy(public_id);
  }
}


