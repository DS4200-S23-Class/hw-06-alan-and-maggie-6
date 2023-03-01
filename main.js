// First, we need a frame  
const FRAME_HEIGHT = 500;
const FRAME_WIDTH = 500;
const MARGINS = { left: 50, right: 50, top: 50, bottom: 50 };

// Let's do another example, with a scale 
const VIS_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;
const VIS_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right;

const FRAME1 = d3.select("#vis1")
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

        const MAX_Y = d3.max(data, (d) => { return (parseInt(d.Petal_Length) + 1.0); });

        // Define scale functions that maps our data values 
        // (domain) to pixel values (range)
        let X_SCALE = d3.scaleLinear()
            .domain([0, (MAX_X)]) // add some padding  
            .range([0, VIS_WIDTH]);

        // scale function
        let Y_SCALE = d3.scaleLinear()
            .domain([MAX_Y, 0])
            .range([0, VIS_HEIGHT]);

        //Categories of different flower types
        const z = d3.scaleOrdinal()
            .domain(data.map(d => d.species))
            .range(d3.schemeCategory10)


        // Use X_SCALE to plot our points
        FRAME1.selectAll("points")
            .data(data) // passed from .then  
            .enter()
            .append("circle")
            .attr("cx", (d) => { return X_SCALE(d.Sepal_length); })
            .attr("fill", (d) => { return z(d.Species); })
            .attr("cy", (d) => { return 10 + Y_SCALE(d.Petal_Length); })
            .attr("r", 10)
            .attr("fill-opacity", 0.5)
            .attr("class", "point");

        FRAME1
            .call(d3.brush()                 // Add the brush feature using the d3.brush function
                .extent([[0, 0], [width, height]]) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
                .on("start brush", updateChart) // Each time the brush selection changes, trigger the 'updateChart' function
            )

        // Function that is triggered when brushing is performed
        function updateChart() {
            extent = d3.event.selection
            FRAME1.classed("selected", function (d) { return isBrushed(extent, X_SCALE(d.Sepal_Length), Y_SCALE(d.Petal_Length)) })
        }

        // A function that return TRUE or FALSE according if a dot is in the selection or not
        function isBrushed(brush_coords, cx, cy) {
            let x0 = brush_coords[0][0];
            let x1 = brush_coords[1][0];
            let y0 = brush_coords[0][1];
            let y1 = brush_coords[1][1];
            return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;    // This return TRUE or FALSE depending on if the points is in the selected area
        }

    }
  }

make_scatter_plot_left();
