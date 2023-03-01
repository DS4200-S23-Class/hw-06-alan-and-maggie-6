// Frame
const FRAME_HEIGHT = 500;
const FRAME_WIDTH = 500;
const MARGINS = { left: 50, right: 50, top: 50, bottom: 50 };

// Height and widths for visualizations
const VIS_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;
const VIS_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right;


// Create the scatter plot frames and bar chart frame
const FRAME1 = d3.select("#vis1")
    .append("svg")
    .attr("height", FRAME_HEIGHT)
    .attr("width", FRAME_WIDTH)
    .attr("class", "frame");

const FRAME2 = d3.select("#vis2")
    .append("svg")
    .attr("height", FRAME_HEIGHT)
    .attr("width", FRAME_WIDTH)
    .attr("class", "frame");

const FRAME3 = d3.select("#vis3")
    .append("svg")
    .attr("height", FRAME_HEIGHT)
    .attr("width", FRAME_WIDTH)
    .attr("class", "frame");


// Building the first scatterplot on the left
function make_scatter_plot_left() {

    d3.csv("data/iris.csv").then((data) => {

        // Build plot inside of .then 
        // find max X
        const MAX_X = d3.max(data, (d) => { return (parseInt(d.Sepal_Length) + 1.0); });

        // find max Y
        const MAX_Y = d3.max(data, (d) => { return (parseInt(d.Petal_Length) + 1.0); });

        // Define scale functions that maps our data values 
        // (domain) to pixel values (range)
        const X_SCALE = d3.scaleLinear()
            .domain([0, (MAX_X)]) // add some padding  
            .range([0, VIS_WIDTH]);

        // scale function
        const Y_SCALE = d3.scaleLinear()
            .domain([MAX_Y, 0])
            .range([0, VIS_HEIGHT]);

        //Categories of different flower types
        const z = d3.scaleOrdinal()
            .domain(data.map(d => d.Species))
            .range(d3.schemeCategory10)

        // Use X_SCALE to plot our points
        scatter_one = FRAME1.selectAll("points")
            .data(data) // passed from .then  
            .enter()
            .append("circle")
            .attr("cx", (d) => { return X_SCALE(d.Sepal_Length); })
            .attr("fill", (d) => { return z(d.Species); })
            .attr("cy", (d) => { return 10 + Y_SCALE(d.Petal_Length); })
            .attr("r", 10)
            .attr("fill-opacity", 0.5)
            .attr("class", "point");

        // Add brush feature
        FRAME1.call(d3.brush()                 
                .extent([[0, 0], [FRAME_WIDTH, FRAME_HEIGHT]]) 
                .on("start brush", updateChart)
                .on("end", () => {})
            );

        // Create Y axis
        FRAME1.append("g")
            .attr("transform",
                "translate(" + (VIS_HEIGHT / 50) + "," + (MARGINS.top) + ")")
            .call(d3.axisRight(Y_SCALE).ticks(10))
            .attr("font-size", "10px");
        
        // Create X axis
        FRAME1.append("g")
            .attr("transform",
                "translate(" + 0 + "," + (VIS_HEIGHT + MARGINS.top + ")"))
            .call(d3.axisTop(X_SCALE).ticks(10))
            .attr("font-size", "10px");

        // Brush on all three graphs
        function updateChart(event) {
            extent = event.selection;
            scatter_one.classed("selected", function (d) { return scatterLinked(extent, X_SCALE(d.Sepal_Length) + MARGINS.left, Y_SCALE(d.Petal_Length) + MARGINS.top) })
            scatter_two.classed("selected", function (d) { return scatterLinked(extent, X_SCALE(d.Sepal_Length) + MARGINS.left, Y_SCALE(d.Petal_Length) + MARGINS.top) })
            bar_points.classed("selected", function (d) { return barLinked(extent, X_SCALE(d.Sepal_Length) + MARGINS.left, Y_SCALE(d.Petal_Length) + MARGINS.top) })
        }

        // Highlight brushed points
        function scatterLinked(brush_coords, cx, cy) {
            let x0 = brush_coords[0][0];
            let x1 = brush_coords[1][0];
            let y0 = brush_coords[0][1];
            let y1 = brush_coords[1][1];
            return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;    
        }


        // Highlight brushed areas on bar chart
        function barLinked(extent, cx, cy) {
            let x0 = extent[0][0];
            let x1 = extent[1][0];
            let y0 = extent[0][1];
            let y1 = extent[1][1];
            return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;
        }

    })
  }


// Making the scatter plot for the petal_length and sepal_length in the middle
function make_scatter_plot_middle () {

  d3.csv("data/iris.csv").then((data) => {

        // Build plot inside of .then 
        // find max X
        const MAX_X2 = d3.max(data, (d) => { return (parseInt(d.Sepal_Width) + 1.0); });

        const MAX_Y2 = d3.max(data, (d) => { return (parseInt(d.Petal_Width) + 1.0); });

        // Define scale functions that maps our data values 
        // (domain) to pixel values (range)
        const X_SCALE2 = d3.scaleLinear()
            .domain([0, (MAX_X2)]) // add some padding  
            .range([0, VIS_WIDTH]);

        // scale function
        const Y_SCALE2 = d3.scaleLinear()
            .domain([MAX_Y2, 0])
            .range([0, VIS_HEIGHT]);

        //Categories of different flower types
        const z2 = d3.scaleOrdinal()
            .domain(data.map(d => d.Species))
            .range(d3.schemeCategory10)



        // Use X_SCALE2 to plot our points
        scatter_two = FRAME2.selectAll("points")
            .data(data) // passed from .then  
            .enter()
            .append("circle")
            .attr("cx", (d) => { return X_SCALE2(d.Sepal_Width); })
            .attr("fill", (d) => { return z2(d.Species); })
            .attr("cy", (d) => { return 10 + Y_SCALE2(d.Petal_Width); })
            .attr("r", 10)
            .attr("fill-opacity", 0.5)
            .attr("class", "point");

        // Add Brush feature
        FRAME2.call(d3.brush()                 
                .extent([[0, 0], [FRAME_WIDTH, FRAME_HEIGHT]]) 
                .on("start brush", updateChart)
                .on("end", () => {})
            );

        // Add Y axis
        FRAME2.append("g")
            .attr("transform",
                "translate(" + (VIS_HEIGHT / 50) + "," + (MARGINS.top) + ")")
            .call(d3.axisRight(Y_SCALE2).ticks(10))
            .attr("font-size", "10px");

        // Add X axis
        FRAME2.append("g")
            .attr("transform",
                "translate(" + 0 + "," + (VIS_HEIGHT + MARGINS.top + ")"))
            .call(d3.axisTop(X_SCALE2).ticks(10))
            .attr("font-size", "10px");

        // Brush on all graphs
        function updateChart(event) {
            extent = event.selection;
            scatter_two.classed("selected", function (d) { return scatterLinked(extent, X_SCALE2(d.Sepal_Width) + MARGINS.left, Y_SCALE2(d.Petal_Width) + MARGINS.top) })
            scatter_one.classed("selected", function (d) { return scatterLinked(extent, X_SCALE2(d.Sepal_Width) + MARGINS.left, Y_SCALE2(d.Petal_Width) + MARGINS.top) })
            bar_points.classed("selected", function (d) { return barLinked(extent, X_SCALE2(d.Sepal_Width) + MARGINS.left, Y_SCALE2(d.Petal_Width) + MARGINS.top) })
        }

        // Highlight brushed points
        function scatterLinked(brush_coords, cx, cy) {
            let x0 = brush_coords[0][0];
            let x1 = brush_coords[1][0];
            let y0 = brush_coords[0][1];
            let y1 = brush_coords[1][1];
            return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1; 
        }

        // Highlight brushed points
        function barLinked(extent, cx, cy) {
            let x0 = extent[0][0];
            let x1 = extent[1][0];
            let y0 = extent[0][1];
            let y1 = extent[1][1];
            return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;
        }

    })
}


function make_bar_chart () {

    d3.csv("data/iris.csv").then((data) => {

        // Define scale functions that maps our data values 
        // (domain) to pixel values (range)
        const X_SCALE3 = d3.scaleBand()
            .range([0, VIS_WIDTH + 1])
            .domain(data.map(function(d) {return d.Species}))
            .padding(0.25); // add some padding  

        // scale function
        const Y_SCALE3 = d3.scaleLinear()
            .domain([0, 60])
            .range([VIS_HEIGHT + 1, 0]);

        //Categories of different flower types
        const z3 = d3.scaleOrdinal()
            .domain(data.map(d => d.Species))
            .range(d3.schemeCategory10);


        // Use X_SCALE3 to make bar chart
        bar_points = FRAME3.selectAll("barchart")
            .data(data)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", function(d) {return X_SCALE3(d.Species) + MARGINS.left})
            .attr("y", function(d) {return Y_SCALE3(50) + MARGINS.top})
            .attr("width", 90)
            .attr("height", function(d) {return VIS_HEIGHT - Y_SCALE3(50)})
            .style("fill", function(d) {return z3(d.Species)});
        
       // Add Y axis
        FRAME3.append("g")
            .attr("transform", "translate(" + MARGINS.left + "," + (MARGINS.top) + ")")
            .call(d3.axisLeft(Y_SCALE3).ticks(10))
            .attr("font-size", "10px");

        // Add X axis
        FRAME3.append("g")
            .attr("transform", "translate(" + MARGINS.left + "," + (MARGINS.top + VIS_HEIGHT) + ")")
            .call(d3.axisBottom(X_SCALE3).ticks(10))
            .attr("font-size", "10px");
        })

}

// Call all three graphs
make_scatter_plot_left();
make_scatter_plot_middle();
make_bar_chart();