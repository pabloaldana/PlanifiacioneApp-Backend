import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly resend: Resend;
  private readonly fromEmail: string;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');
    if (!apiKey) throw new Error('RESEND_API_KEY is missing in .env');

    this.resend = new Resend(apiKey);
    this.fromEmail = this.configService.get<string>('RESEND_FROM_EMAIL') ?? 'onboarding@resend.dev';
  }

  async sendPasswordResetCode(email: string, code: string): Promise<void> {
    try {
      await this.resend.emails.send({
        from: this.fromEmail,
        to: email,
        subject: 'Código para recuperar tu contraseña',
        html: `
          <p>Usá este código para restablecer tu contraseña:</p>
          <h2>${code}</h2>
          <p>Expira en 15 minutos. Si no pediste esto, ignorá este mensaje.</p>
        `,
      });
    } catch (error) {
      this.logger.error(`Error enviando email de reset a ${email}`, error);
      throw error;
    }
  }
}
