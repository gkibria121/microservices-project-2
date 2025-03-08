import { Request, Response, Router } from "express";
import { body ,validationResult} from 'express-validator'
import ValidationExceptionMiddleware from "../Middlewares/ValidationExceptionMiddleware";
import ValidationException from "../Exceptions/ValidationException";

const router = Router()  

router.post('/api/auth/signin',[
    body('email').notEmpty().withMessage("Email is empty").isEmail().withMessage("Invalid email"),
    body('password').notEmpty().withMessage("passwod is empty"),
    body('password').isLength({max: 16,min: 8}).withMessage("Password must be between 8 and 16")],  
    (req:Request,res:Response):any=>{
        const errors = validationResult(req)
        if(!errors.isEmpty()){  
            throw new ValidationException(errors.array());
        }
    
    res.status(200).json({
        email : "gkibria121@gmail.com",
        password : "password"
    })
})
router.post('/api/auth/signup',(req:Request,res:Response): any=>{
  
    res.status(200).json({
        email : "gkibria121@gmail.com",
        password : "password", 
    })
})
router.get('/api/auth/current-user',(req:Request,res:Response)=>{
    res.status(200).send("update server on file change!")
})
router.use(ValidationExceptionMiddleware)

export {router as apiRouter}