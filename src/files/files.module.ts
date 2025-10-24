import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { CloudinaryProvider } from './helpers/cloudinary.provider';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [FilesController],
  providers: [FilesService,CloudinaryProvider],
  // imports: [ConfigModule]
})
export class FilesModule {}
