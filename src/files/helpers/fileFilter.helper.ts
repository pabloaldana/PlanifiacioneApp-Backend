import { BadRequestException } from "@nestjs/common"

export const fileFilter =  (req:Express.Request,file:Express.Multer.File, callback:Function)=>
{
    // console.log('file')
    if (!file) return callback(new BadRequestException('El archivo es obligatorio'),false)
    
    const fileExtension = file.mimetype.split('/')[1]
    const validExtension = ['pdf','msword','vnd.openxmlformats-officedocument.wordprocessingml.document'] //el ultimo es para .doc
    
    if (validExtension.includes(fileExtension)) return callback(null,true)

    callback( new BadRequestException('Tipo de archivo no permitido. Solo PDF o DOC.'),false)
}

export const imageFileFilter =  (req:Express.Request,file:Express.Multer.File, callback:Function)=>
{
    if (!file) return callback(new BadRequestException('La imagen es obligatoria'),false)

    const fileExtension = file.mimetype.split('/')[1]
    const validExtension = ['jpg','jpeg','png','webp']

    if (validExtension.includes(fileExtension)) return callback(null,true)

    callback( new BadRequestException('Tipo de archivo no permitido. Solo JPG, PNG o WEBP.'),false)
}