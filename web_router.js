



const express = require('express')
const  arr = require('./readCsv')
const router = express.Router()


router.get('/list',(req,res)=>{
    res.send('get')
})



router.post('/add',(req,res)=>{
    res.send('post')
})



router.all('/json-server/1',(request,response)=>{

    response.setHeader('Access-Control-Allow-Origin','* ')
    response.setHeader('Access-Control-Allow-Headers','* ')
    
    arr.retData('./dataset/data.csv').then(function(data){
        console.log('*****');
        console.log(data);
        let str = JSON.stringify(data)
        response.send(str)
    })
    


})





router.all('/json-server/2',(request,response)=>{

    response.setHeader('Access-Control-Allow-Origin','* ')
    response.setHeader('Access-Control-Allow-Headers','* ')
    
    const data = [
        { year: '2011', value: '10' },
        { year: '2012', value: '20' },
        { year: '2013', value: '4' },
        { year: '2014', value: '70' },
        { year: '2015', value: '20' },
        { year: '2016', value: '80' }
      ]
    //对对象进行字符串转换
    let str = JSON.stringify(data)
    response.send(str)


})


router.all('/json-bubble/2022-2-24',(request,response)=>{

    response.setHeader('Access-Control-Allow-Origin','* ')
    response.setHeader('Access-Control-Allow-Headers','* ')
    
    arr.retData('./dataset/hot-2022-2-24.csv').then(function(data){
        console.log('*****');
        console.log(data);
        data = {
            "children" : data
        }
        console.log(data);
        let str = JSON.stringify(data)
        response.send(str)
    })


})


router.all('/json-bubble/2022-2-25',(request,response)=>{

    response.setHeader('Access-Control-Allow-Origin','* ')
    response.setHeader('Access-Control-Allow-Headers','* ')
    
    arr.retData('./dataset/hot-2022-2-25.csv').then(function(data){
        console.log('*****');
        console.log(data);
        data = {
            "children" : data
        }
        console.log(data);
        let str = JSON.stringify(data)
        response.send(str)
    })


})


router.all('/json-bubble/2022-2-26',(request,response)=>{

    response.setHeader('Access-Control-Allow-Origin','* ')
    response.setHeader('Access-Control-Allow-Headers','* ')
    
    arr.retData('./dataset/hot-2022-2-26.csv').then(function(data){
        console.log('*****');
        console.log(data);
        data = {
            "children" : data
        }
        console.log(data);
        let str = JSON.stringify(data)
        response.send(str)
    })


})

router.all('/json-bubble/2022-2-27',(request,response)=>{

    response.setHeader('Access-Control-Allow-Origin','* ')
    response.setHeader('Access-Control-Allow-Headers','* ')
    
    arr.retData('./dataset/hot-2022-2-27.csv').then(function(data){
        console.log('*****');
        console.log(data);
        data = {
            "children" : data
        }
        console.log(data);
        let str = JSON.stringify(data)
        response.send(str)
    })


})

router.all('/json-bubble/2022-2-28',(request,response)=>{

    response.setHeader('Access-Control-Allow-Origin','* ')
    response.setHeader('Access-Control-Allow-Headers','* ')
    
    arr.retData('./dataset/hot-2022-2-28.csv').then(function(data){
        console.log('*****');
        console.log(data);
        data = {
            "children" : data
        }
        console.log(data);
        let str = JSON.stringify(data)
        response.send(str)
    })


})
module.exports = router