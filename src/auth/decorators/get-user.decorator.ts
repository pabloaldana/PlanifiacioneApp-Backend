import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";


export const GetUser = createParamDecorator(
    (data:string,ctx: ExecutionContext)=>{
        //! DATA ES LO Q MANDAMOS POR PARÁMETRO AL DECORADOR DEL CONTROLADOR
        const req = ctx.switchToHttp().getRequest();
        const user = req.user;

        if(!user) throw new InternalServerErrorException('User not found - GetUser Decorator ');


        return (!data) ? user : user[data];

    }
)