


const express = require('express')

const userRouter = require('./web_router')


const app = express()
app.use('/api',userRouter)







app.listen(80,()=>{
    console.log('running at http://127.0.0.1');
})






