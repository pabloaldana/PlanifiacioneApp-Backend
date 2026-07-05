import { Injectable, Inject } from '@nestjs/common';
import { v2 as Cloudinary } from 'cloudinary';

@Injectable()
export class FilesService {
  constructor(
    @Inject('CLOUDINARY') private readonly cloudinary: typeof Cloudinary,
  ) { }


  async uploadFile(file: Express.Multer.File) {
    try {
      const result = await new Promise<any>((resolve, reject) => {
        const uploadStream = this.cloudinary.uploader.upload_stream(
          {
            folder: 'PlanificacionesDB/Planificaciones',
            resource_type: 'raw',          // archivos PDF, Excel, etc.
            type: 'authenticated',
            use_filename: true,
            unique_filename: false,
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

      return {
        url: result.secure_url,
        public_id: result.public_id,
      };

    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error al subir archivo: ${error.message}`);
      }

      throw new Error("Error al subir archivo");
    }
  }

  async deleteFile(public_id: string) {
    return this.cloudinary.uploader.destroy(public_id, { resource_type: 'raw', type: 'authenticated' });
  }

  async uploadImage(file: Express.Multer.File) {
    try {
      const result = await new Promise<any>((resolve, reject) => {
        const uploadStream = this.cloudinary.uploader.upload_stream(
          {
            folder: 'PlanificacionesDB/ImgPlanificaciones',
            resource_type: 'image',          // imagenes publicas para el catalogo
            use_filename: true,
            unique_filename: false,
            filename_override: file.originalname,
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          },
        );
        uploadStream.end(file.buffer);
      });

      return {
        url: result.secure_url,
        public_id: result.public_id,
      };

    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error al subir imagen: ${error.message}`);
      }

      throw new Error("Error al subir imagen");
    }
  }

  async deleteImage(public_id: string) {
    return this.cloudinary.uploader.destroy(public_id, { resource_type: 'image' });
  }

  getSignedDownloadUrl(public_id: string, format = 'pdf'): string {
    return this.cloudinary.utils.private_download_url(public_id, format, {
      resource_type: 'raw',
      type: 'authenticated',
      expires_at: Math.floor(Date.now() / 1000) + 600,
      attachment: true,
    });
  }
}


