async function init() {
  let format = d3.format(",");

  // Set tooltips
  // var tip = d3
  //   .tip()
  //   .attr("class", "d3-tip")
  //   .offset([-10, 0])
  //   .html(function (d) {
  //     return (
  //       "<strong>Country: </strong><span class='details'>" +
  //       d.properties.name +
  //       "<br></span>" +
  //       "<strong>Population: </strong><span class='details'>" +
  //       format(d.population) +
  //       "</span>"
  //     );
  //   });

  d3.select("body")
    .append("div")
    .style("display", "none")
    .attr("position", "absolute")
    .attr("class", "d3-tip");
  function tips_show(e, d, html) {
    d3.select(".d3-tip")
      .style("display", "block")
      .style("position", "absolute")
      .style("top", `${e.pageY}px`)
      .style("left", `${e.pageX + 10}px`)
      .html(html);
  }
  function tips_hide() {
    d3.select(".d3-tip").style("display", "none");
  }

  var margin = { top: 0, right: 0, bottom: 0, left: 0 };

  var width = 960 - margin.left - margin.right;
  var height = 500 - margin.top - margin.bottom;

  var color = d3
    .scaleThreshold()
    .domain([
      10000, 100000, 500000, 1000000, 5000000, 10000000, 50000000, 100000000,
      500000000, 1500000000,
    ])
    .range([
      "rgb(247,251,255)",
      "rgb(222,235,247)",
      "rgb(198,219,239)",
      "rgb(158,202,225)",
      "rgb(107,174,214)",
      "rgb(66,146,198)",
      "rgb(33,113,181)",
      "rgb(8,81,156)",
      "rgb(8,48,107)",
      "rgb(3,19,43)",
    ]);

  var path = d3.geoPath();

  var svg = d3
    .select(".map")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("class", "map");

  var projection = d3
    .geoMercator()
    .scale(130)
    .translate([width / 2, height / 1.5]);

  var path = d3.geoPath().projection(projection);
  var centered;
  var x, y, k; //全局判断是不是缩放了,放大的时候不需要线

  let cur_month = "All";
  let bar1_data = await get_bar1_data(get_data_by_month_default);
  let bar2_to_4_data = await get_bar2_to_4_data(get_data_by_month_default);

  function draw_map() {
    let import_data = d3.csv("../dataset/map_data/worldCountryImport.csv");
    let export_data = d3.csv("../dataset/map_data/worldCountryExport.csv");
    let data = d3.json("../dataset/world_countries.json");
    let population = d3.tsv("../dataset/world_population.tsv");

    Promise.all([data, population, import_data, export_data]).then(
      ([data, population, import_data, export_data]) => {
        ready({
          error: undefined,
          data,
          population,
          import_data,
          export_data,
          bar1_data,
          bar2_to_4_data,
        });
        console.log(bar2_to_4_data);
      }
    );

    function ready({ error, data, population, import_data, export_data }) {
      var isClick = false;
      var populationById = {};
      //   console.log(data);
      population.forEach(function (d) {
        populationById[d.id] = +d.population;
      });
      data.features.forEach(function (d) {
        d.population = populationById[d.id];
      });

      var g = svg.append("g");

      g.selectAll("path")
        .data(data.features)
        .join("path")
        .attr("class", (d) => `countries ${d.properties.name}`)
        .attr("d", path)
        .style("fill", function (d) {
          return color(populationById[d.id]);
        })
        .style("stroke", "white")
        .style("stroke-width", 1.5)
        .style("opacity", 0.8)
        // tooltips
        .style("stroke", "white")
        .style("stroke-width", 0.3)
        .on("mouseover", function (e, d) {
          let html =
            "<strong>Country: </strong><span class='details'>" +
            d.properties.name +
            "<br></span>" +
            "<strong>Population: </strong><span class='details'>" +
            format(d.population) +
            "</span>";
          tips_show(e, d, html);
          d3.select(this)
            .style("opacity", 1)
            .style("stroke", "white")
            .style("stroke-width", 3);

          add_import_export_lines(
            e,
            d,
            data.features,
            import_data,
            export_data
          );
        })
        .on("mouseout", function () {
          tips_hide();
          clear_import_export_lines();
          d3.select(this)
            .style("opacity", 0.8)
            .style("stroke", "white")
            .style("stroke-width", 0.3);
        })
        .on("click", clicked);

      svg
        .append("path")
        .datum(
          topojson.mesh(data.features, function (a, b) {
            return a.id !== b.id;
          })
        )
        // .datum(topojson.mesh(data.features, function(a, b) { return a !== b; }))
        .attr("class", "names")
        .attr("d", path);

      //   console.log(populationById);

      d3.select(".map").call(
        d3.zoom().on("zoom", function () {
          svg.attr("transform", d3.transform);
        })
      );
      function add_bars(d) {
        let dimensions = [
          "Area Harvested (1000 HA)",
          "Beginning Stocks (1000 MT)",
          "Production (1000 MT)",
        ];
        const colorScale = d3
          .scaleOrdinal()
          .domain(["Amount", ...dimensions])
          .range(["#E63946", "#1D3557", "#457B9D", "#A8DADC"]);
        // 画柱形图,没有数据不画

        let bar1_value = bar1_data.find(
          (bar) => bar.Country === d.properties.name
        );

        draw_bar({
          class_name: "bar1",
          data: bar1_value,
          title: "Amount",
          color: colorScale("Amount"),
        });
        // Area Harvested (1000 HA)
        // Beginning Stocks (1000 MT)
        // Production (1000 MT)
        let get_bar_2_4_data = (dimension) => {
          return bar2_to_4_data.find(
            (bar2) =>
              bar2.Country === d.properties.name && bar2.Attribute === dimension
          );
        };

        dimensions.forEach((d, i) => {
          draw_bar({
            class_name: `bar${i + 2}`,
            data: get_bar_2_4_data(d),
            title: d,
            color: colorScale(d),
          });
        });
      }
      function clicked(e, d) {
        clear_import_export_lines();

        add_bars(d);
        if (d && centered !== d) {
          var centroid = path.centroid(d);
          x = centroid[0];
          y = centroid[1];
          k = 4;
          centered = d;
        } else {
          x = width / 2;
          y = height / 2;
          k = 1;
          centered = null;
          d3.selectAll(`.bar1`).selectAll("*").remove();
          d3.selectAll(`.bar2`).selectAll("*").remove();
          d3.selectAll(`.bar3`).selectAll("*").remove();
          d3.selectAll(`.bar4`).selectAll("*").remove();
        }

        g.selectAll("path").classed(
          "active",
          centered &&
            function (d) {
              return d === centered;
            }
        );

        g.transition()
          .duration(750)
          .attr(
            "transform",
            "translate(" +
              width / 2 +
              "," +
              height / 2 +
              ")scale(" +
              k +
              ")translate(" +
              -x +
              "," +
              -y +
              ")"
          )
          .style("stroke-width", 1.5 / k + "px");
      }
    }
  }

  draw_map();

  /*********************map export & import partner lines  **************************/
  /*****get data ****/

  function add_import_export_lines(e, d, features, import_data, export_data) {
    // 根据d找到合作伙伴,循环合作伙伴画线图,起点和终点,加曲线,加动画
    // const curve = d3.line().curve(d3.curveNatural)
    //   const points = [[100, 60], [40, 90], [200, 80], [300, 150]];
    // .attr('d', curve(points))
    if (k == 4) return;
    const add_line = (data, filed_name, color) => {
      // 合作伙伴
      const partners = data.filter((item) => {
        return item.Country === d.properties.name;
      });

      // 循环合作伙伴,获取位置的点
      let source_position = path.centroid(d);
      let position_points_line = partners
        .map((v, i) => {
          let target_country = features.find(
            (f) => f.properties.name === v[filed_name]
          );

          if (target_country) {
            let t = path.centroid(target_country);
            return {
              source: { id: i, x: source_position[0], y: source_position[1] },
              target: { x: t[0], y: t[1] },
            };
          }
        })
        .filter((d) => d); //去除undefined;

      // 画线

      /*****添加箭头****/

      svg
        .selectAll(`.defs${filed_name}`)
        .data(position_points_line)
        .join("defs")
        .attr("class", `defs${filed_name}`)
        .selectAll("marker")
        .data((d) => ["end" + d.source.id]) // Different link/path types can be defined here
        .enter()
        .append("svg:marker") // This section adds in the arrows
        .attr("id", String)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 0)
        .attr("refY", 0)
        .attr("markerWidth", 2)
        .attr("markerHeight", 2)
        .attr("orient", "auto")
        .append("svg:path")
        .attr("d", "M0,-5L10,0L0,5")
        .attr("fill", color);

      let g = d3.select("svg .map");
      g.selectAll(`.${filed_name}`)
        .data(position_points_line)
        .join("path")
        .attr("d", curve_line)
        .attr("class", filed_name)
        .attr("stroke", color)
        .attr("fill", "none")
        .attr("marker-end", (d) => `url(#end${d.source.id})`)
        .attr("stroke-width", 4);
    };

    add_line(export_data, "MainExportCountryName", "red");
    add_line(import_data, "MainImportCountryName", "green");

    function curve_line(d) {
      var dx = d.target.x - d.source.x,
        dy = d.target.y - d.source.y,
        dr = Math.sqrt(dx * dx + dy * dy);
      return (
        "M" +
        d.source.x +
        "," +
        d.source.y +
        "A" +
        dr +
        "," +
        dr +
        " 0 0,1 " +
        d.target.x +
        "," +
        d.target.y
      );
    }
  }

  function clear_import_export_lines() {
    d3.selectAll(`.MainImportCountryName`).remove();
    d3.selectAll(`.MainExportCountryName`).remove();
  }

  /*********************barchart**************************/
  /*****get data****/

  const div = d3.select("#month_select");
  let months = [
    "2022/01",
    "2022/02",
    "2022/03",
    "2022/04",
    "2022/05",
    "2022/06",
    "2022/07",
    "2022/08",
  ];
  async function changeEvent(e) {
    let value = e.target.value;
    console.log(value);
    cur_month = value;
    bar1_data = await get_bar1_data(get_data_by_month_default);
    bar2_to_4_data = await get_bar2_to_4_data(get_data_by_month_default);
  }
  add_select({ div, options: months, classname: "monthSelect", changeEvent });
  function add_select({ div, options, classname, changeEvent }) {
    options.unshift("All");
    // label
    div
      .selectAll(`.labelclassname`)
      .data([0])
      .join("label")
      .attr("class", "label" + classname)
      .html(classname);
    // add select
    let select = div
      .selectAll(`.classname`)
      .data([0])
      .join("select")
      .attr("class", classname);
    // opotions
    let option = select
      .selectAll("option")
      .data(options)
      .join("option")
      .attr("value", (d) => d)
      .html((d) => d);

    select.on("change", changeEvent);
  }

  function get_data_by_month_default(d) {
    if (cur_month == "All") {
      return d[0].includes("2022") || d[0].includes("21/22");
    } else if (cur_month == "2022/01") {
      return d[0].includes("2022/01") || d[0].includes("Jan");
    } else if (cur_month == "2022/02") {
      return d[0].includes("2022/02") || d[0].includes("Feb");
    } else if (cur_month == "2022/03") {
      return d[0].includes("2022/03") || d[0].includes("Mar");
    } else if (cur_month == "2022/04") {
      return d[0].includes("2022/04") || d[0].includes("Apr");
    } else if (cur_month == "2022/05") {
      return d[0].includes("2022/05") || d[0].includes("May");
    } else if (cur_month == "2022/06") {
      return d[0].includes("2022/06") || d[0].includes("Jun");
    } else if (cur_month == "2022/07") {
      return d[0].includes("2022/07") || d[0].includes("Jul");
    } else if (cur_month == "2022/08") {
      return d[0].includes("2022/08") || d[0].includes("Aug");
    }
  }

  async function get_bar1_data(get_data_by_month_default) {
    let arr = d3.range(8);
    let export_data = arr.map((d, i) => {
      return d3.csv(`../dataset/map_data/2022-0${i + 1}worldExport.csv`);
    });

    let import_data = arr.map((d, i) => {
      return d3.csv(`../dataset/map_data/2022-0${i + 1}worldImport.csv`);
    });

    const data = await Promise.all([...export_data, ...import_data]);
    let _data = data.flat(Infinity);
    const sum_2022 = (cur_1) =>
      d3.sum(
        Object.entries(cur_1).filter((d) => get_data_by_month_default(d)),
        (d_3) => +d_3[1]
      );
    _data = _data.reduce((pre, cur_2) => {
      let value_1 = pre.find((d_4) => d_4.Country === cur_2.Country);
      if (value_1) {
        value_1["2017/18"] += +cur_2["2017/18"];
        value_1["2018/19"] += +cur_2["2018/19"];
        value_1["2019/20"] += +cur_2["2019/20"];
        value_1["2020/21"] += +cur_2["2020/21"];
        value_1["2021/22"] += sum_2022(cur_2);
      } else {
        pre.push({
          Country: cur_2.Country,
          "2017/18": +cur_2["2017/18"],
          "2018/19": +cur_2["2018/19"],
          "2019/20": +cur_2["2019/20"],
          "2020/21": +cur_2["2020/21"],
          "2021/22": sum_2022(cur_2),
        });
      }

      return pre;
    }, []);
    return _data;
  }

  async function get_bar2_to_4_data(get_data_by_month_default) {
    return new Promise((resolve, reject) => {
      let countries = [
        "Argentina",
        "Australia",
        "Brazil",
        "Brazil",
        "Canada",
        "India",
        "Kazakhstan",
        "Russia",
        "Turkey",
        "Ukraine",
      ];

      let arr = d3.range(8);
      let import_data = countries
        .map((country) => {
          return arr.map((d, i) => {
            return d3.csv(
              `../dataset/map_data/${country}/2022-0${i + 1}ExportData.csv`
            );
          });
        })
        .flat(Infinity);

      Promise.all(import_data)
        .then((data) => {
          countries.forEach((d, i) => {
            arr.forEach((d1, i1) => {
              data[i * 8 + i1].forEach((item) => {
                item["Country"] = d;
              });
            });
          });
          let _data = data.flat(Infinity);
          const sum_2022 = (cur_1) =>
            d3.sum(
              Object.entries(cur_1).filter((d) => get_data_by_month_default(d)),
              (d_3) => +d_3[1]
            );

          _data = _data.reduce((pre, cur_2) => {
            let value_1 = pre.find(
              (d_4) =>
                d_4.Country === cur_2.Country &&
                d_4.Attribute === cur_2.Attribute
            );
            if (value_1) {
              value_1["17/18"] += +cur_2["17/18"] || 0;
              value_1["18/19"] += +cur_2["18/19"];
              value_1["19/20"] += +cur_2["19/20"];
              value_1["20/21"] += +cur_2["20/21"];
              value_1["21/22"] += sum_2022(cur_2);
            } else {
              pre.push({
                Country: cur_2.Country,
                Attribute: cur_2.Attribute,
                "17/18": +cur_2["17/18"] || 0,
                "18/19": +cur_2["18/19"],
                "19/20": +cur_2["19/20"],
                "20/21": +cur_2["20/21"],
                "21/22": sum_2022(cur_2),
              });
            }

            return pre;
          }, []);
          console.log(_data);
          resolve(_data);
        })
        .catch((err) => reject(err));
    });
  }
  /*****画柱形图****/

  function draw_bar({ class_name, data, color, title }) {
    if (!data) {
      d3.select(`.${class_name}`).selectAll("*").remove();
      return;
    }
    let x_axis_label = "Year";
    let y_axis_label = title;
    const div = d3.select(`.${class_name}`);
    div.selectAll("*").remove();
    const width = div.node().getBoundingClientRect().width * 0.9;
    const height = div.node().getBoundingClientRect().height * 0.9;
    const margin = { left: 60, right: 20, top: 30, bottom: 30 };
    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;
    const svg = div.append("svg").attr("width", width).attr("height", height);

    const ChartArea = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const AxisYLeft = ChartArea.append("g");

    const AxisX = ChartArea.append("g").attr(
      "transform",
      `translate(0,${innerH})`
    );

    ChartArea.selectAll(".x_label")
      .data([0])
      .join("text")
      .attr("class", "x_label")
      .attr("transform", `translate(${innerW / 2},${innerH + 30})`)
      .text(x_axis_label);
    // y1 label
    ChartArea.selectAll(".y_label")
      .data([0])
      .join("text")
      .attr("class", "y_label")
      .attr("font-size", 12)
      .attr("transform", ` translate(5,0) rotate(90)`)
      .text(y_axis_label);

    let chart_data = Object.entries(data).filter(
      (d) => d[0] !== "Country" && d[0] !== "Attribute"
    );
    // chart_data.sort((a, b) => (a[0].charCodeAt(0) > b[0].charCodeAt(0) ? -1 : 1));

    // scale
    const x_values = chart_data.map((d) => d[0]);
    const x = d3.scaleBand().domain(x_values).range([0, innerW]).padding(0.3);
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(chart_data, (d) => d[1])])
      .range([innerH, 0]);

    //    axis
    AxisX.call(d3.axisBottom(x));
    AxisYLeft.call(d3.axisLeft(y));

    let rects = ChartArea.selectAll("rect")
      .data(chart_data)
      .join("rect")
      .attr("class", (d) => d[0]) //设置一个类名,方便后续调用
      .attr("x", (d) => x(d[0]))
      .attr("y", (d) => y(d[1]))
      .attr("width", x.bandwidth())
      .attr("height", (d) => innerH - y(d[1]))
      .attr("stroke", "gray")
      .attr("stroke-width", "0.25")
      .attr("fill", color);

    rects
      .on("mouseenter", (e, d) => {
        let html = ` <p> ${d[0]} :${d[1]}  </p>`;
        tips_show(e, d, html);
      })
      .on("mouseout", tips_hide);
  }
}
init();
