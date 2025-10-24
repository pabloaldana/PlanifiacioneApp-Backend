import { BadRequestException } from "@nestjs/common"
import { error } from "console"

export const fileFilter =  (req:Express.Request,file:Express.Multer.File, callback:Function)=>
{
    // console.log(file)
    if (!file) return callback(new error('file is empty'),false)
    
    const fileExtension = file.mimetype.split('/')[1]
    const validExtension = ['pdf','msword','vnd.openxmlformats-officedocument.wordprocessingml.document'] //el ultimo es para .doc
    
    if (validExtension.includes(fileExtension)) return callback(null,true)

    callback( new BadRequestException('Tipo de archivo no permitido. Solo PDF o DOC.'),false)
}