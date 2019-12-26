function addAxesAndLegend(svg, xAxis, yAxis, margin, chartWidth, chartHeight) {
    // var legendWidth = 200,
    //     legendHeight = 100;

    // clipping to make sure nothing appears behind legend
    // svg.append('clipPath')
    //     .attr('id', 'axes-clip')
    //     .append('polygon')
    //     .attr('points', (-margin.left) + ',' + (-margin.top) + ' ' +
    //         (chartWidth - legendWidth - 1) + ',' + (-margin.top) + ' ' +
    //         (chartWidth - legendWidth - 1) + ',' + legendHeight + ' ' +
    //         (chartWidth + margin.right) + ',' + legendHeight + ' ' +
    //         (chartWidth + margin.right) + ',' + (chartHeight + margin.bottom) + ' ' +
    //         (-margin.left) + ',' + (chartHeight + margin.bottom));

    var axes = svg.append('g')
        .attr('clip-path', 'url(#axes-clip)');

    axes.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + chartHeight + ')')
        .attr('clip-path', 'url(#rect-clip)')
        .call(xAxis);

    axes.append('g')
        .attr('class', 'y axis')
        .call(yAxis)
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '.71em')
        .style('text-anchor', 'end')
        .text('Relative Level of Busyness');

    // var legend = svg.append('g')
    //     .attr('class', 'legend')
    //     .attr('transform', 'translate(' + (chartWidth - legendWidth) + ', 0)');

    // legend.append('rect')
    //     .attr('class', 'legend-bg')
    //     .attr('width', legendWidth)
    //     .attr('height', legendHeight);

    // legend.append('rect')
    //     .attr('class', 'outer')
    //     .attr('width', 75)
    //     .attr('height', 20)
    //     .attr('x', 10)
    //     .attr('y', 10);

    // legend.append('text')
    //     .attr('x', 115)
    //     .attr('y', 25)
    //     .text('5% - 95%');

    // legend.append('rect')
    //     .attr('class', 'inner')
    //     .attr('width', 75)
    //     .attr('height', 20)
    //     .attr('x', 10)
    //     .attr('y', 40);

    // legend.append('text')
    //     .attr('x', 115)
    //     .attr('y', 55)
    //     .text('25% - 75%');

    // legend.append('path')
    //     .attr('class', 'median-line')
    //     .attr('d', 'M10,80L85,80');

    // legend.append('text')
    //     .attr('x', 115)
    //     .attr('y', 85)
    //     .text('Median');
}

function drawPaths(svg, data, x, y, height, width, margin) {

    // var upperInnerLine = d3.svg.line()
    //     .interpolate('basis')
    //     .x(function (d) { return x(d.date) || 1; })
    //     .y(function (d) { return y(d.pct75); })

    var medianLine = d3.svg.line()
        .interpolate('basis')
        .x(function (d) { return x(d.date); })
        .y(function (d) { return y(d.pct50); });

    // var lowerInnerLine = d3.svg.line()
    //     .interpolate('basis')
    //     .x(function (d) { return x(d.date) || 1; })
    //     .y(function (d) { return y(d.pct25); });

    var tooltip = d3.select("body")
        .append("div")
        .style("position", "absolute")
        .style("z-index", "100")
        .style("visibility", "hidden")
        .text("a simple tooltip");


    /// Average Data path


    var averageLine = svg.append("g").attr("id", "average-line");
    averageLine.datum(data[2]);

    averageLine.append('path')
        .attr('class', 'average-line')
        .attr('d', medianLine)
        .attr('clip-path', 'url(#rect-clip)')
        .on("mouseover", function () { return tooltip.style("visibility", "visible"); })
        .on("mousemove", function () { return tooltip.style("top", (event.pageY - 10) + "px").style("left", (event.pageX + 10) + "px"); })
        .on("mouseout", function () { return tooltip.style("visibility", "hidden"); });



    ///Predicted data path

    var rightPane = svg.append("g").attr("id", "right-pane");
    
    var levels = rightPane.selectAll("prediction-level")
        .data(data[0].slice(-1, data[0].length))
        .enter();

    levels.append("rect")
        .attr("class", "prediction-box")
        .attr("y", 0)
        .attr("x", d => x(d.date))
        .attr("width", d => width - x(d.date))
        .attr("height", height)
        .attr("fill", "#7FDBFF")
        .attr('clip-path', 'url(#rect-clip)');

    levels.append("rect")
        .attr("class", "prediction-box")
        .attr("fill", "#CC527A")
        .attr("y", 0)
        .attr("x", d => x(d.date))
        .attr("width", d => width - x(d.date))
        .attr("height", height / 3)
        .attr('clip-path', 'url(#rect-clip)');

    levels.append("rect")
        .attr("class", "prediction-box")
        .attr("fill", "#9DE0AD")
        .attr("y", 0 + height / 3 * 2)
        .attr("x", d => x(d.date))
        .attr("width", d => width - x(d.date))
        .attr("height", height / 3)
        .attr('clip-path', 'url(#rect-clip)');

    /////

    var predictedLine = svg.append("g").attr("id", "predicted-line");
    var predictedData = data[1];

    predictedLine.datum(predictedData);

    predictedLine.append('path')
        .attr('class', 'predicted-line')
        .attr('d', medianLine)
        .attr('clip-path', 'url(#rect-clip)');

    /////

    // data[1].forEach(element => {
    //     if (element.date >= data[0][data[0].length - 1].date) {
    //         predictedData.push(element);
    //     }
    // });



    var leftPane = svg.append("g").attr("id", "leftpane");
    leftPane.datum(data[0]);

    leftPane.append('path')
        .attr('class', 'median-line')
        .attr('id', 'median-line')
        .attr('d', medianLine)
        .attr('clip-path', 'url(#rect-clip)');


    leftPane.selectAll(".vertical")
        .data(data[0].slice(-1, data[0].length))
        .enter()
        .append("line")
        .attr("x1", (d) => x(d.date))
        .attr("y1", 0)
        .attr("x2", (d) => x(d.date))
        .attr("y2", height)
        .attr("id", "vertical-bar")
        .attr('clip-path', 'url(#rect-clip)');

    leftPane.selectAll(".dot")
        .data(data[0].slice(-1, data[0].length))
        .enter().append("circle")
        .attr("class", "dot") 
        .attr("cx", function (d, i) { return x(d.date) })
        .attr("cy", function (d) { return y(d.pct50) })
        .attr("r", 5)
        .attr('clip-path', 'url(#rect-clip)')
        .node().animate([
            { r: 5, opacity: 1 },
            { r: 5 * 1.2, opacity: 0.9 },
            { r: 5, opacity: 1}
        ], {
                duration: 2000,
                easing: 'linear',
                iterations: Infinity, 
                direction: 'normal', 
                fill: 'forwards'
    });

    

    
}

function startTransitions(chartWidth, rectClip) {
    rectClip.transition()
        .duration(3000)
        .ease(d3.easeCubic)
        .attr('width', chartWidth);

}

var gX, gY;

function makeChart(data, predictedData, averageData) {
    var svgWidth = 960,
        svgHeight = 500,
        margin = { top: 20, right: 20, bottom: 40, left: 40 },
        chartWidth = svgWidth - margin.left - margin.right,
        chartHeight = svgHeight - margin.top - margin.bottom;

    var xDomain = [d3.min(data, (d) => d.date)];
    xDomain.push(d3.time.hour.offset(d3.max(predictedData, (d) => d.date), 1));

    var x = d3.time.scale().range([0, chartWidth])
        .domain(xDomain);
    var y = d3.scale.linear().range([chartHeight, 0])
        .domain([0, d3.max([d3.max(data, function (d) { return d.pct75 * 1.5; }), d3.max(predictedData, function (d) { return d.pct75 * 1.5; })])]);

    gX = x;
    gY = y;


    var xAxis = d3.svg.axis().scale(x).orient('bottom')
                .innerTickSize(-chartHeight).outerTickSize(0).tickPadding(10);
    var yAxis = d3.svg.axis().scale(y).orient('left')
                .innerTickSize(-chartWidth).outerTickSize(0).tickPadding(10);

    var svg = d3.select('body').append('svg')
        .attr('width', svgWidth)
        .attr('height', svgHeight)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    globalSvg = svg;
    var rectClip = svg.append('clipPath')
        .attr('id', 'rect-clip')
        .append('rect')
        .attr('width', 0)
        .attr('height', chartHeight);

    addAxesAndLegend(svg, xAxis, yAxis, margin, chartWidth, chartHeight);
    drawPaths(svg, [data, predictedData, averageData], x, y, chartHeight, chartWidth, margin);
    startTransitions(chartWidth, rectClip);
}


var parseDate = d3.time.format('%H:%M').parse;

d3.json('data.json', function (error, rawData) {
    if (error) {
        console.error(error);
        return;
    }


    var actualData = rawData[0].map(function (d) {
        return {
            date: parseDate(d.date),
            pct25: d.pct25 / 1000,
            pct50: d.pct50 / 1000,
            pct75: d.pct75 / 1000
        };
    });


    var predictedData = rawData[1].map((d) => {
        return {
            date: parseDate(d.date),
            pct25: d.pct25 / 1000,
            pct50: d.pct50 / 1000,
            pct75: d.pct75 / 1000
        };
    })

    var averageData = rawData[2].map((d) => {
        return {
            date: parseDate(d.date),
            pct25: d.pct25 / 1000,
            pct50: d.pct50 / 1000,
            pct75: d.pct75 / 1000
        };
    })

    makeChart(actualData, predictedData, averageData);
});

