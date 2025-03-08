interface ValidationError{
    [tagname:string] : string[]
 }
interface Errors {
    message : string,
    errors?: ValidationError[]  ,

}

abstract class CustomError extends Error {
    abstract   statusCode:number; 
    abstract serializeErrors():Errors[]

}

export {CustomError,Errors,ValidationError}