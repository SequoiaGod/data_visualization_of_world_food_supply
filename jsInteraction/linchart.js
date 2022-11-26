
        
const div = document.querySelector('#box')
const xhr = new XMLHttpRequest()
const margin = 200
const svg = d3.select("svg")
const width = svg.attr("width") - margin
const height = svg.attr("height") - margin
const xScale = d3.scaleBand().range([0, width]).padding(0.4)
const yScale = d3.scaleLinear().range([height, 0])


const g = svg.append("g")
.attr("transform","translate(" + 100 + "," + 100 + ")")

//设置响应体类型
xhr.responseType = 'json'
 xhr.open('GET','http://127.0.0.1:80/api/json-server/1')
 xhr.send('-----') 
 xhr.onreadystatechange = function(){
    if(xhr.readyState === 4){
        if(xhr.status >= 200 && xhr.status < 300){
            
            const data = xhr.response
            // console.log(xhr.response);
            
            

            xScale.domain(
                data.map(function(d){
                    return d.year
                })
            )

            yScale.domain(
                [
                    0,d3.max(data,d =>d.value)
                ]
            )

            g.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(xScale));

            g.append("g")
            .call(
            d3
            .axisLeft(yScale) .tickFormat(function (d) {
            return "$" + d; })
            .ticks(10) )

            drawLine(data)
            
        }
    }
 }



// console.log(data);

const btns = d3.selectAll('button')
btns.on('click',function(){

    console.log(this);
    const xhr = new XMLHttpRequest()
//设置响应体类型
xhr.responseType = 'json'
 xhr.open('GET','http://127.0.0.1:80/api/json-server/'+this.innerText)
 xhr.send() 
 xhr.onreadystatechange = function(){
    if(xhr.readyState === 4){
        if(xhr.status >= 200 && xhr.status < 300){
            
            const data = xhr.response
            // console.log(xhr.response);
             drawLine(data)
        }
    }
 }

})


// drawLine(data)



function drawLine(data){

console.log(g);

const u = g.selectAll("rect")
.data(data)


u.join("rect")
.transition()
.duration(1000)
.attr("class", "bar") 
.attr("x", function (d) {
// console.log(xScale(d.year));
return xScale(d.year); })
.attr("y", function (d) {
console.log(yScale(d.value));
return yScale(d.value); })
.attr("width", xScale.bandwidth())
.attr("height", function (d) {
return height - yScale(d.value); })
.attr("fill", "grey");

// g.selectAll(".bar")
// .data(data)
// .enter()
// .append("rect")
// .attr("class", "bar") 
// .attr("x", function (d) {
//     // console.log(xScale(d.year));
//     return xScale(d.year); })
// .attr("y", function (d) {
//     console.log(yScale(d.value));
// return yScale(d.value); })
// .attr("width", xScale.bandwidth())
// .attr("height", function (d) {
//     return height - yScale(d.value); })
// .attr("fill", "grey");


let bar = d3.selectAll("rect")
bar.on("mouseover",function(){
console.log('----');

d3.select(this).attr("fill", "red")
})

bar.on("mouseout",function(){
d3.select(this).attr("fill", "grey")
})





}




