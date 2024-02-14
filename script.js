const root = d3.select(".canvas").style("background-color", "#FFFFFF");
root.append("h1").text("United States GDP").attr("id", "title");

const w = 800;
const h = 400;
const barWidth = w / 275;

fetch(
"https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json").

then(res => res.json()).
then(dataset => {
  const data = dataset.data;
  let svg = root.
  append("svg").
  attr("width", w + 100).
  attr("height", h + 60);
  const dateMin = d3.min(data, d => new Date(d[0]));
  const dateMax = d3.max(data, d => new Date(d[0]));
  const gdpMin = d3.min(data, d => d[1]);
  const gdpMax = d3.max(data, d => d[1]);

  const yAxisScale = d3.scaleLinear([0, gdpMax], [h, 0]);
  const yScale = d3.scaleLinear([0, gdpMax], [0, h]);
  console.log(yScale(gdpMax));
  const yAxis = d3.axisLeft(yAxisScale);
  let tooltip = root.append("div").attr("id", "tooltip");
  svg.
  append("g").
  attr("transform", `translate(50, 0)`).
  attr("id", "y-axis").
  call(yAxis);

  const xScale = d3.scaleTime([dateMin, dateMax], [0, w]);
  const xAxis = d3.axisBottom(xScale);
  svg.
  append("g").
  attr("transform", `translate(50, ${h})`).
  attr("id", "x-axis").
  call(xAxis);

  svg.
  selectAll("rect").
  data(data).
  join("rect").
  attr("data-date", d => d[0]).
  attr("data-gdp", d => d[1]).
  attr("class", "bar").
  attr("x", (d, i) => xScale(new Date(d[0]))).
  attr("width", barWidth).
  attr("y", (d, i) => h - yScale(d[1])).

  attr("height", (d, i) => yScale(d[1])).
  attr("index", (d, i) => i).

  attr("transform", `translate(50, 0)`).

  on("mouseover", (event, d) => {
    let leftpos = xScale(new Date(d[0])) + 100;
    let temp = "";
    let html = "";

    let dadate = d[0];
    let dagdp = d[1];

    if (dadate.charAt(6) == "1") {
      temp = "Q1";
    } else if (dadate.charAt(6) == "4") {
      temp = "Q2";
    } else if (dadate.charAt(6) == "7") {
      temp = "Q3";
    } else if (dadate.charAt(6) == "0") {
      temp = "Q4";
    } else {
      temp = "QError";
    }
    html += "<div>" + dadate.substring(0, 4) + " " + temp + "</div>";
    html += "<div>$" + dagdp + " Billion";

    tooltip.
    style("opacity", "1").
    style("left", leftpos + "px").
    attr("data-date", dadate).
    html(html);
  }).
  on("mouseout", event => tooltip.style("opacity", "0"));
  svg.call(yTitle);
});

const yTitle = p => p.append("text").attr("x", 50).attr("y", 80).text("Gross Domestic Product →").attr("text-anchor", "end").attr("transform", `translate(0, 100) rotate(-90)`);