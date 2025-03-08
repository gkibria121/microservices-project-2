import { Request, Response, Router } from "express";
import { body ,validationResult} from 'express-validator'
import ValidationExceptionMiddleware from "../Middlewares/ValidationExceptionMiddleware";
import ValidationException from "../Exceptions/ValidationException";
import {randomBytes} from 'crypto'
import Jwt from 'jsonwebtoken'
const router = Router() 

if(!process.env.JWT_KEY)

    throw new Error("JWT key not found!")

router.post('/api/auth/signin',[
    body('email').notEmpty().withMessage("Email is empty").isEmail().withMessage("Invalid email"),
    body('password').notEmpty().withMessage("passwod is empty")  ],  
    (req:Request,res:Response):any=>{
        const errors = validationResult(req)
        if(!errors.isEmpty()){  
            throw new ValidationException(errors.array());
        }

    const existingUser = {
        id: randomBytes(10).toString('hex'),
        email : "gkibria121@gmail.com", 
    }

    const token = Jwt.sign(
        existingUser,
        process.env.JWT_KEY!
    );



    res.status(200).json({
         jwt : token
    })
})
router.post('/api/auth/signup',[
    body('email').notEmpty().withMessage("Email is empty").isEmail().withMessage("Invalid email"),
    body('password').notEmpty().withMessage("passwod is empty"),
    body('password').isLength({max: 16,min: 8}).withMessage("Password must be between 8 and 16")],(req:Request,res:Response): any=>{
  
    const errors = validationResult(req)
    if(!errors.isEmpty()){  
        throw new ValidationException(errors.array());
    }
    
    const {email, passwod} = req.body
    
    res.status(200).json({
        id: randomBytes(10).toString('hex'),
        email,  
    })
})
router.get('/api/auth/current-user',(req:Request,res:Response)=>{
    res.status(200).send("update server on file change!")
})
router.use(ValidationExceptionMiddleware)

export {router as apiRouter}