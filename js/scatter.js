var margin = {
        top: 50,
        right: 300,
        bottom: 50,
        left: 50
    },
    outerWidth = 900,
    outerHeight = 500,
    width = outerWidth,
    height = outerHeight - margin.top - margin.bottom;

var x = d3.scale.linear()
    .range([0, width]).nice();

var y = d3.scale.linear()
    .range([height, 0]).nice();

var colorCat = "klass";

d3.json('../data/dados.json', function(error, data) {
    data = data.rows;
    var xMax = d3.max(data, function(d) {
            return d.values[0];
        }),
        xMin = d3.min(data, function(d) {
            return d.values[0];
        }),
        xMin = xMin > 0 ? 0 : xMin,
        yMax = d3.max(data, function(d) {
            return d.values[1];
        }),
        yMin = d3.min(data, function(d) {
            return d.values[1];
        }),
        yMin = yMin > 0 ? 0 : yMin;

    x.domain([xMin, xMax]);
    y.domain([yMin, yMax]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .tickSize(-height);

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickSize(-width);

    var color = d3.scale.category10();

    var tip = d3.tip()
        .attr("class", "d3-tip")
        .offset([-10, 0])
        .html(function(d) {
            return "valor do x : " + d.values[0] + "<br> valor do y : " + d.values[1];
        });

    var zoomBeh = d3.behavior.zoom()
        .x(x)
        .y(y)
        .scaleExtent([1, 5])
        .on("zoom", zoom);

    var svg = d3.select("#scatter")
        .append("svg")
        .attr("width", outerWidth)
        .attr("height", outerHeight)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .call(zoomBeh);

    svg.call(tip);

    svg.append("rect")
        .attr("width", width)
        .attr("height", height);



    var objects = svg.append("svg")
        .classed("objects", true)
        .attr("width", width)
        .attr("height", height);

    objects.append("svg:line")
        .classed("axisLine hAxisLine", true)
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", width)
        .attr("y2", 0)
        .attr("transform", "translate(0," + height + ")");

    objects.append("svg:line")
        .classed("axisLine vAxisLine", true)
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", 0)
        .attr("y2", height);

    objects.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .classed("dot", true)
        .attr("r", function(d) {
            //raio
            return 2;
        })
        .attr("transform", transform)
        .style("fill", function(d) {
            return color(d[colorCat]);
        })
        .on("mouseover", tip.show)
        .on("mouseout", tip.hide);


    function zoom() {
        svg.select(".x.axis").call(xAxis);
        svg.select(".y.axis").call(yAxis);
        svg.selectAll(".dot")
            .attr("transform", transform);
    }

    function transform(d) {
        return "translate(" + x(d.values[0]) + "," + y(d.values[1]) + ")";
    }

    d3.select("#reset_zoom").on("click", reset);

    function zoomed() {
      svg.select(".x.axis").call(xAxis);
      svg.select(".y.axis").call(yAxis);
    }

    function reset() {
        d3.transition().duration(750).tween("zoom", function() {
            var ix = d3.interpolate(x.domain(), [xMin, xMax]),
                iy = d3.interpolate(y.domain(), [yMin, yMax]);
            return function(t) {
                zoomBeh.x(x.domain(ix(t))).y(y.domain(iy(t)));
                zoom();
            };
        });
    }

});
