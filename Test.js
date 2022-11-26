



const  arr = require('./readCsv')
// console.log(arr);

arr.retData("./dataset/test.csv").then(function(data){
    console.log('*****');
    console.log(data);
})


arr.retData("./dataset/data.csv").then(function(data){
    console.log('*****');
    console.log(data);
})
