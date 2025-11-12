import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";


export const RawHeaders = createParamDecorator(
    (data,ctx:ExecutionContext) => {

        const req = ctx.switchToHttp().getRequest();

        const headers = req.rawHeaders;

        if(!headers) throw new InternalServerErrorException('Headers not found - RawHeaders Decorator ');

        return headers;

    }
)


//todo IDEALMENTE ESTE CUSTOM DECORATOR DEBERIA ESTAR EN COMMON YA QUE ES GENERAL NO DE UNA CARPETA PARTICULAR