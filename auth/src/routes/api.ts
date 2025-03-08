import { Request, Response, Router } from "express";
import { body ,validationResult} from 'express-validator'
import ValidationExceptionMiddleware from "../Middlewares/ValidationExceptionMiddleware";
import ValidationException from "../Exceptions/ValidationException";
import {randomBytes} from 'crypto'
import Jwt from 'jsonwebtoken'
import AuthMiddleware from "../Middlewares/AuthMiddleware";
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

    req.session ={
        jwt : token
    }

    res.status(200).json({
        
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
router.get('/api/auth/current-user',AuthMiddleware,(req:Request,res:Response)=>{
 
    const currentUser = req.user;
    res.status(200).json({
        currentUser
    });  
   
})
router.post('/api/auth/signout',AuthMiddleware,(req:Request,res:Response):any=>{
 
   req.session = null;
   res.json({
    message: "Successfully logged out!"
   })
    
   
})
router.use(ValidationExceptionMiddleware)

export {router as apiRouter}