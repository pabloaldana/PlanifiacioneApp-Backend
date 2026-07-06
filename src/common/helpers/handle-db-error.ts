import { InternalServerErrorException, Logger } from '@nestjs/common';

export function handleDBException(error: any, logger: Logger, duplicateMessage = 'El registro ya existe'): never {
  if (error.code === '23505') {
    throw new InternalServerErrorException(duplicateMessage);
  }
  logger.error(error);
  throw new InternalServerErrorException('Unexpected error, check server logs');
}
