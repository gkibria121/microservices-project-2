import express from 'express'
import { json } from 'express'
import { apiRouter } from './routes/api'


const app =express()


app.use(json())
app.use(apiRouter)
app.listen(3000,()=>{
    console.log("Server listening on 3000!")
})