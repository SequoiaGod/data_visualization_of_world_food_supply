const fs = require("fs");
const Papa = require("papaparse");
const { resolve } = require("path");

const options = { header: true };



// this function is used to read CSV file.
  module.exports.retData =  async function(path){
    let results = []
    await new Promise(resolve =>{
      fs.createReadStream(path)
      .pipe(Papa.parse(Papa.NODE_STREAM_INPUT, options))
      .on("data", (data) => {
          results.push(data);
      })
      .on("end", () => {
          // console.log(results);
          resolve(results)
      });


    })

    console.log('----');
    // console.log(results);
    let str = JSON.stringify(results)
    return results
  }








//   var fs = require('fs').promises;
// var parse = require('csv-parse/lib/sync');
// (async function () {
//     const fileContent = await fs.readFile(__dirname+'/dataset/data.csv');
//     const records = parse(fileContent, {columns: true});
//     console.log(records)
// })();