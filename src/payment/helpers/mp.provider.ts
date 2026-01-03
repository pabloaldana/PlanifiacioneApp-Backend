import { Provider } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import MercadoPagoConfig from "mercadopago";

export const MercadoPagoProvider: Provider = {
    provide: 'MERCADO_PAGO',
    inject: [ConfigService],
    useFactory: (config: ConfigService) => {
    const token = config.get<string>('MERCADO_PAGO_ACCESS_TOKEN');

    if (!token) throw new Error('MERCADO_PAGO_ACCESS_TOKEN is missing in .env');
  
    return new MercadoPagoConfig({ accessToken: token });
    }
};