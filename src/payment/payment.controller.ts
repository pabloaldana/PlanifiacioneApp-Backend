import { Controller, Post, Body, Headers } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../auth/entities/auth.entity';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) { }

  @Auth()
  @Post('create-preference')
  createPreference(@GetUser() user: User) {
    return this.paymentService.createPreference(user);
  }

  @Post('webhook')
  processWebhook(
    @Body() body: any,
    @Headers('x-signature') signature: string,
    @Headers('x-request-id') requestId: string,
  ) {
    return this.paymentService.processWebhook(body, signature, requestId);
  }
}
