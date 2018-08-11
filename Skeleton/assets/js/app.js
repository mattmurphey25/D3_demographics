var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "obesity";

// function used for updating x-scale var upon click on axis label
function xScale(demData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(demData, d => d[chosenXAxis]) * 0.8,
      d3.max(demData, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;

}

// function used for updating x-scale var upon click on axis label
function yScale(demData, chosenYAxis) {
    // create scales
    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(demData, d => d[chosenYAxis]) * 0.8,
        d3.max(demData, d => d[chosenYAxis]) * 1.2
      ])
      .range([height, 0]);
  
    return yLinearScale;
  
  }

// function used for updating xAxis var upon click on axis label
function xRenderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

// function used for updating xAxis var upon click on axis label
function yRenderAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
  
    yAxis.transition()
      .duration(1000)
      .call(leftAxis);
  
    return yAxis;
}

// function used for updating x circles group with a transition to
// new circles
function xRenderCircles(circlesGroup, newXScale, chosenXAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));

  return circlesGroup;
}

// function used for updating y circles group with a transition to
// new circles
function yRenderCircles(circlesGroup, newYScale, chosenYAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newYScale(d[chosenYAxis]));
  
    return circlesGroup;
  }

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

  if (chosenXAxis === "poverty") {
    var labelX = "Poverty:";
    if (chosenYAxis === "obesity") {
        var labelY = "Obesity:";}
    else if (chosenYAxis === "smokes") {
        var labelY = "Smokes:";}
    else if (chosenYAxis === "healthcare") {
        var labelY = "Healthcare:";}
  } 
  else if (chosenXAxis === "age") {
    var labelX = "Age:";
    if (chosenYAxis === "obesity") {
        var labelY = "Obesity:";}
    else if (chosenYAxis === "smokes") {
        var labelY = "Smokes:";}
    else if (chosenYAxis === "healthcare") {
        var labelY = "Healthcare:";}
  } 
  else if (chosenXAxis === "income") {
    var labelX = "Income:";
    if (chosenYAxis === "obesity") {
        var labelY = "Obesity:";}
    else if (chosenYAxis === "smokes") {
        var labelY = "Smokes:";}
    else if (chosenYAxis === "healthcare") {
        var labelY = "Healthcare:";}
  }

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([0,0])
    .html(function(d) {
      return (`${d.state}<br>${labelX} ${d[chosenXAxis]}<br>${labelY} ${d[chosenYAxis]}`);
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data) {
      toolTip.hide(data);
    });

  return circlesGroup;
}

// Retrieve data from the CSV file and execute everything below
d3.csv("data.csv").then(successHandle, errorHandle);

function errorHandle(error){
  throw error;
}

function successHandle(demData) {

  // parse data
  demData.forEach(function(data) {
    data.poverty = parseFloat(data.poverty);
    data.age = parseFloat(data.age);
    data.income = parseFloat(data.income);
    data.obsity = parseFloat(data.obsity);
    data.smokes = parseFloat(data.smokes);
    data.healthcare = parseFloat(data.healthcare);
  });

  // xLinearScale function above csv import
  var xLinearScale = xScale(demData, chosenXAxis);

  // Create y scale function
  var yLinearScale = yScale(demData, chosenYAxis);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  var yAxis = chartGroup.append("g")
    .call(leftAxis);

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(demData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 15)
    .attr("fill", "blue")
    .attr("opacity", ".6");
  
  // append ST labels
  chartGroup.selectAll("text")
    .data(demData)
    .enter()
    .append("text")
    .text(d => d.abbr)
    .attr("x", d => xLinearScale(d[chosenXAxis]))
    .attr("y", d => yLinearScale(d[chosenYAxis]))
    .attr("font-size", "10px")
    .attr("text-anchor", "middle");

  // Create group for  2 x- axis labels
  var xLabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var povertyLabel = xLabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("In Poverty (%)");

  var ageLabel = xLabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .text("Age (Medium)");

  var incomeLabel = xLabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "income") // value to grab for event listener
    .classed("inactive", true)
    .text("Household Income (Medium)");

  // Create group for  2 x- axis labels
  var yLabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(-20, ${height / 2})`);

  // append y axis
  var obeseLabel = yLabelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -20)
    .attr("x", 0)
    .classed("active", true)
    .text("Obese (%)");
    
  var smokeLabel = yLabelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -40)
    .attr("x", 0)
    .classed("inactive", true)
    .text("Smokes (%)");

  var healthLabel = yLabelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -60)
    .attr("x", 0)
    .classed("inactive", true)
    .text("Lacks Healthcare (%)");

  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

  // x axis labels event listener
  xLabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;

        // console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(demData, chosenXAxis);

        // updates x axis with transition
        xAxis = xRenderAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = xRenderCircles(circlesGroup, xLinearScale, chosenXAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenXAxis === "poverty") {
          povertyLabel
            .classed("active", true)
            .classed("inactive", false);
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else if (chosenXAxis === "age") {
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          ageLabel
            .classed("active", true)
            .classed("inactive", false);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else if (chosenXAxis === "income") {
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("active", true)
            .classed("inactive", false);
        }
      }
    });

// y axis labels event listener
  yLabelsGroup.selectAll("text")
  .on("click", function() {
  // get value of selection
    var value = d3.select(this).attr("value");
    if (value !== chosenYAxis) {

      // replaces chosenXAxis with value
      chosenYAxis = value;

      // console.log(chosenXAxis)

      // functions here found above csv import
      // updates x scale for new data
      yLinearScale = yScale(demData, chosenYAxis);

      // updates x axis with transition
      yAxis = yRenderAxes(yLinearScale, yAxis);

      // updates circles with new x values
      circlesGroup = yRenderCircles(circlesGroup, yLinearScale, chosenYAxis);

      // updates tooltips with new info
      circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

      // changes classes to change bold text
      if (chosenYAxis === "obesity") {
        obeseLabel
          .classed("active", true)
          .classed("inactive", false);
        smokeLabel
          .classed("active", false)
          .classed("inactive", true);
        healthLabel
          .classed("active", false)
          .classed("inactive", true);
      }
      else if (chosenYAxis === "smokes") {
        obeseLabel
          .classed("active", false)
          .classed("inactive", true);
        smokeLabel
          .classed("active", true)
          .classed("inactive", false);
        healthLabel
          .classed("active", false)
          .classed("inactive", true);
      }
      else if (chosenYAxis === "healthcare") {
        obeseLabel
          .classed("active", false)
          .classed("inactive", true);
        smokeLabel
          .classed("active", false)
          .classed("inactive", true);
        healthLabel
          .classed("active", true)
          .classed("inactive", false);
      }
    }
  });
}
