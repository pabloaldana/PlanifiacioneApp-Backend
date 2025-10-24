import { Injectable, Inject } from '@nestjs/common';
import { v2 as Cloudinary } from 'cloudinary';
import { promises as fs } from 'fs';

@Injectable()
export class FilesService {
  constructor(
    @Inject('CLOUDINARY') private readonly cloudinary: typeof Cloudinary,
  ) {}
//!necesario guardar localmente
//   async uploadFile(file: Express.Multer.File) {
//     try {
//       // Subida a Cloudinary
//       const result = await this.cloudinary.uploader.upload(file.path, {
//         resource_type: 'auto', // acepta cualquier tipo de archivo
//         folder: 'PlanificacionesDB',     // opcional: carpeta en Cloudinary
//         use_filename: true,    // usar el nombre original del archivo
//         unique_filename: false // no generar nombre único automáticamente
//       });

//       // Opcional: eliminar archivo local después de subirlo
//       await fs.unlink(file.path);

//       return {
//         url: result.secure_url,
//         public_id: result.public_id,
//       };
//     } catch (error) {
//       throw new Error(`Error al subir archivo: ${error.message}`);
//     }
//   }

async uploadFile(file: Express.Multer.File) {
  try {
    const result = await new Promise<any>((resolve, reject) => {
      const uploadStream = this.cloudinary.uploader.upload_stream(
        {
            folder: 'PlanificacionesDB',
            resource_type: 'raw',
            use_filename: true,
            unique_filename: false,
            filename_override: file.originalname,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );
      uploadStream.end(file.buffer); // <- enviamos buffer directamente
    });

    return {
      url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    throw new Error(`Error al subir archivo: ${error.message}`);
  }
}
}


