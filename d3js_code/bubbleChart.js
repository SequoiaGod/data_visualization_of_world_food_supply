var q = d3.queue();
q
.defer(d3.json, "../dataset/chart2.json")
.await(readyChart);

function readyChart(error, topics){



var allGroup = ["2022-2-24", "2022-2-25", "2022-2-26"
                ,"2022-2-27","2022-2-28"]
const content = d3.select(".content")
console.log(content);
// add the options to the button
d3.select("#selectButton")
  .selectAll('myOptions')
  .data(allGroup)
  .enter()
  .append('option')
  .text(function (d) { return d; }) // text showed in the menu
  .attr("value", function (d) { return d; }) // corresponding value returned by the button


console.log(d3.select("#selectButton").property("value"));
d3.select('#selectButton').on('change',function(d){
  console.log('change');
  var selectedOption = d3.select(this).property("value")
  // run the updateChart function with this selected option
  const xhr = new XMLHttpRequest()
  
  xhr.responseType = 'json'
  console.log('http://127.0.0.1:80/api/json-bubble/'+selectedOption);
   xhr.open('GET','http://127.0.0.1:80/api/json-bubble/'+selectedOption)
   xhr.send() 
   xhr.onreadystatechange = function(){
      if(xhr.readyState === 4){
          if(xhr.status >= 200 && xhr.status < 300){
              
              const data = xhr.response
              // console.log(xhr.response);
              update(selectedOption,data)
          }
      }
   }
  
})







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
            
                // console.log(this);
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

        drawBubble()
        function drawBubble(){

            const xhr = new XMLHttpRequest()
            //设置响应体类型
            xhr.responseType = 'json'
             xhr.open('GET','http://127.0.0.1:80/api/json-bubble/2022-2-24')
             xhr.send() 
             xhr.onreadystatechange = function(){
                if(xhr.readyState === 4){
                    if(xhr.status >= 200 && xhr.status < 300){
                        
                        let dataset = xhr.response
                        // console.log(xhr.response);
                        var diameter = 600;
        var color = d3.scaleOrdinal(d3.schemeSet3);

        var bubble = d3.pack(dataset)
            .size([diameter, diameter])
            .padding(1.5);

        d3.select(".app").attr("border","1px solid black")
        .attr("width", diameter)
            .attr("height", diameter)
        const svg2 = d3.select(".app")
            .append("svg")
            .attr("width", diameter)
            .attr("height", diameter)

            .attr("class", "bubble");

        var nodes = d3.hierarchy(dataset)
            .sum(function(d) { return d.Count; });
        // console.log(d3.hierarchy(dataset));
        // console.log(nodes);
        var node = svg2.selectAll(".node")
            .data(bubble(nodes).descendants())
            .enter()
            .filter(function(d){
                return  !d.children
            })
            .append("g")
            .attr("class", "node")
            .attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")";
            })
            .on('mouseover',function(){
                // console.log(this);
                let target = d3.select(this).selectAll("text").text();
                var ul = content.select("ul");
                let date = d3.select("#selectButton").property("value")

                topics.Dates.forEach(function(dates){
                    if(dates.date === date){
                        dates.topic.forEach(function(d){
                            // console.log(d);
                            let flag = false;
                            let str = "";
                            d.forEach(function(ele){
                                str = str + ele + " ";
                                if(ele === target){
                                    flag = true;
            
                                }
                            })
                            if(flag){
                                // console.log(str);
                                ul.append("li").append("text")
                                .transition().duration(9000)
                                .text(function(topics){
                                    return str;
                        })
                            }
                        })
                    }
                })
                console.log(d3.select(this).selectAll("text").text());
                content.transition().duration(900)
                .style("opacity", 1)

                content.style("display","block")
                
            })
            .on('mouseout',function(){
                content.transition().duration(900)
                .style("opacity", 0)
                content.select("ul").selectAll("li").remove();
                // .style("display","none")
                
            });

        node.append("title")
        .transition()
            .duration(1000)
            .text(function(d) {
                // console.log(d);
                return d.data.Name + ": " + d.data.Count;
            });

        node.append("circle")
        .transition()
            .duration(1000)
            .attr("r", function(d) {
                return d.r;
            })
            .style("fill", function(d,i) {
                return color(i);
            });

            
        
        node.append("text")
            .attr("dy", ".2em")
            .style("text-anchor", "middle")
            .text(function(d) {
                // console.log('00000');
                // console.log(d.r /3);
                // console.log(d.data);
                return d.data.Name.substring(0, d.r / 3);
            })
            .attr("font-family", "sans-serif")
            .attr("font-size", function(d){
                return d.r/5;
            })
            .attr("fill", "black");

        node.append("text")
            .attr("dy", "1.3em")
            .style("text-anchor", "middle")
            .text(function(d) {
                return d.data.Count;
            })
            .attr("font-family",  "Gill Sans", "Gill Sans MT")
            .attr("font-size", function(d){
                return d.r/5;
            })
            .attr("fill", "black");

        d3.select(self.frameElement)
            .style("height", diameter + "px");

                        
                    }
                }
             }



        // console.log("0000000");
        // console.log(d3.selectAll(".node"));

        // d3.selectAll("circle").on('mouseover',function(){
        //     console.log(this);
        //     // d3.select(this).selectAll("text")
        //     console.log(d3.select(this));
        //     content.style("display","none")
        // })

        // d3.selectAll("circle").on('mouseout',function(){
        //     content.style("display","block")
        // })



        

        }






function update(selectedGroup,dataset){
  d3.selectAll(".bubble").remove()
  var diameter = 600;

        var color = d3.scaleOrdinal(d3.schemeSet3);

        var bubble = d3.pack(dataset)
            .size([diameter, diameter])
            .padding(1.5);

        d3.select(".app").attr("border","1px solid black")
        .attr("width", diameter)
            .attr("height", diameter)
        var svg2 = d3.select(".app")
            .append("svg")
            .attr("width", diameter)
            .attr("height", diameter)

            .attr("class", "bubble");

        var nodes = d3.hierarchy(dataset)
            .sum(function(d) { return d.Count; });
        // console.log(d3.hierarchy(dataset));
        // console.log(nodes);
        var node = svg2.selectAll(".node")
            .data(bubble(nodes).descendants())
            .enter()
            .filter(function(d){
                return  !d.children
            })
            .append("g")
            .attr("class", "node")
            .attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")";
            })
            .on('mouseover',function(){
                // console.log(this);
                let target = d3.select(this).selectAll("text").text();
                var ul = content.select("ul");
                let date = d3.select("#selectButton").property("value")

                topics.Dates.forEach(function(dates){
                    if(dates.date === date){
                        dates.topic.forEach(function(d){
                            // console.log(d);
                            let flag = false;
                            let str = "";
                            d.forEach(function(ele){
                                str = str + ele + " ";
                                if(ele === target){
                                    flag = true;
            
                                }
                            })
                            if(flag){
                                // console.log(str);
                                ul.append("li").append("text")
                                .transition().duration(9000)
                                .text(function(topics){
                                    return str;
                        })
                            }
                        })
                    }
                })
                console.log(d3.select(this).selectAll("text").text());
                content.transition().duration(900)
                .style("opacity", 1)

                content.style("display","block")
                
            })
            .on('mouseout',function(){
                content.transition().duration(900)
                .style("opacity", 0)
                content.select("ul").selectAll("li").remove();
                // .style("display","none")
                
            });

            
            node.append("title")
            .transition()
                .duration(1000)
                .text(function(d) {
                    console.log( d.data.Count);
                    console.log(d.data.Name + ": " + d.data.Count);
                    return selectedGroup + ": " + d.data.Name + ": " + d.data.Count;
                });
    
            node.append("circle")
            .transition()
                .duration(1000)
                .attr("r", function(d) {
                    return d.r;
                })
                .style("fill", function(d,i) {
                    return color(i);
                });
    
            node.append("text")
            .transition()
            .duration(1000)
                .attr("dy", ".2em")
                .style("text-anchor", "middle")
                .text(function(d) {
                    // console.log('00000');
                    // console.log(d.r /3);
                    // console.log(d.data);
                    return d.data.Name.substring(0, d.r / 3);
                })
                .attr("font-family", "sans-serif")
                .attr("font-size", function(d){
                    return d.r/5;
                })
                .attr("fill", "black");
    
            node.append("text")
            .transition()
            .duration(1000)
                .attr("dy", "1.3em")
                .style("text-anchor", "middle")
                .text(function(d) {
                    return d.data.Count;
                })
                .attr("font-family",  "Gill Sans", "Gill Sans MT")
                .attr("font-size", function(d){
                    return d.r/5;
                })
                .attr("fill", "black");
    
            d3.select(self.frameElement)
                .style("height", diameter + "px");
    
            
          

}



}
