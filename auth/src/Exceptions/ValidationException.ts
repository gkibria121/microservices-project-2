import { CustomError, Errors } from "../contracts/CustomErrorContract";
import { ValidationError } from 'express-validator'
import { ValidationError as CustomValidationError } from "../contracts/CustomErrorContract";
class ValidationException extends CustomError{

    
    constructor(public errores:ValidationError[]){
        super();  
    }
    statusCode: number = 442;
    serializeErrors(): any  {

        return this.normalizeError(this.errores);
    }

    private normalizeError(errors:ValidationError[]):CustomValidationError{
 
        return errors.reduce((acc,curr)=>{ 
            if(curr.type!=="field")
                return acc
            if(curr.path in acc)
                acc[curr.path].push(curr.msg)
            else
                acc[curr.path] = [curr.msg]
             
            return acc},{} as Record<string,string[]>)
    }
}


export default ValidationException