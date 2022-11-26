const div = document.querySelector('#box')
const xhr = new XMLHttpRequest()
var margin = 200
var svg = d3.select("svg")
var width = svg.attr("width") - margin
var height = svg.attr("height") - margin
const xScale = d3.scaleBand().range([0, width]).padding(0.4)
const yScale = d3.scaleLinear().range([height, 0])








function drawLine(data){

    // console.log(g);

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
        // console.log(yScale(d.value));
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
        // console.log('----');
        
        d3.select(this).attr("fill", "red")
    })

    bar.on("mouseout",function(){
        d3.select(this).attr("fill", "grey")
    })





}
