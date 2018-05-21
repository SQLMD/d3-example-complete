function countBy(items) {
  let counts = [];
  for (let item of items) {
    let id = item;
    let known = counts.findIndex(c => c.id == id);
    if (known == -1) {
      counts.push({ id, value: 1 });
    } else {
      counts[known].value++;
    }
  }
  return counts;
}

const getTimes = async (filePath, minValue) => {
  //Width and height
  const w = 1200;
  const h = 500;

  //For converting timestamps to Dates
  const parseTime = d3.timeParse("%m/%d/%y");

  //For converting Dates to strings
  const formatTime = d3.timeFormat("%m/%d/%y");

  const d = await d3.json(filePath);

  const array = d.status_updates
    .sort((act1, act2) => act1.timestamp - act2.timestamp)
    .map(act => new Date(act.timestamp * 1000))
    .map(ts => formatTime(ts));
  //console.log(array);

  const dates = countBy(array).filter(act => act.value > minValue);

  console.log(dates);
  //Create scale functions
  // const xScale = d3
  //   .scaleTime()
  //   .domain([
  //     d3.min(d.account_activity, act => act.timestamp),
  //     d3.max(d.account_activity, act => act.timestamp)
  //   ])
  //   .range([padding, w - padding]);

  const scale = d3
    .scaleLinear()
    .domain([
      d3.min(dates, date => date.value),
      d3.max(dates, date => date.value)
    ])
    .range([110, h - 50]);

  const svg = d3
    .select("barchart")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

  svg
    .selectAll("rect")
    .data(dates)
    .enter()
    .append("rect")
    .attr("x", (d, i) => i * (w / dates.length))
    .attr("y", d => h - scale(d.value))
    //.attr("y", d => h - d.value)
    .attr("width", w / dates.length)
    .attr("height", d => scale(d.value))
    //.attr("height", d => d.value)
    .attr("fill", (d, i) => {
      if (i % 2 === 0) {
        return "blue";
      }
      return "darkblue";
    });

  svg
    .selectAll("text")
    .data(dates)
    .enter()
    .append("text")
    .text(d => `${d.id} - ${d.value}`)
    .attr("font-size", 12 * scale(d.value - 10) / 100)
    .attr("fill", "white")
    .attr("transform", (d, i) => {
      const x = i * (w / dates.length) + (w / dates.length - 8) / 2;
      const y = h - scale(d.value) + 20;
      return "translate(" + x + "," + y + ") rotate(90)";
    });
};
