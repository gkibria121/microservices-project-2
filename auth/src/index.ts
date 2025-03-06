import express from 'express'
import { json } from 'express'


const app =express()


app.use(json())



app.get('/api/auth/current-user',(req,res)=>{
    res.status(200).send("hello world!")
})

app.listen(3000,()=>{
    console.log("Server listening on 3000!")
})