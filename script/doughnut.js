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

const width = 300;
const height = 300;

const getIPs = async (filePath, minValue) => {
  try {
    const d = await d3.json(filePath);

    const array = d.account_activity.map(item => item.ip_address);

    const ips = countBy(array)
      .filter(ip => ip.value > minValue)
      .sort((ip1, ip2) => ip2.value - ip1.value);
    console.log(ips);

    const dataset = ips.map(ip => ip.value);

    const outerRadius = width / 2;
    const innerRadius = width / 3;
    const arc = d3
      .arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius);

    const pie = d3.pie();
    console.log(dataset);
    console.log(pie(dataset));

    //Easy colors accessible via a 10-step ordinal scale
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    //Create SVG element
    const svg = d3
      .select("pie")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    //Set up groups
    const arcs = svg
      .selectAll("g.arc")
      .data(pie(dataset))
      .enter()
      .append("g")
      .attr("class", "arc")
      .attr("transform", "translate(" + outerRadius + "," + outerRadius + ")");

    //Draw arc paths
    arcs
      .append("path")
      .attr("fill", (d, i) => color(i))
      .attr("d", (d, i) => arc(d, i));

    //Labels
    arcs
      .append("text")
      .attr("transform", function(d) {
        return "translate(" + arc.centroid(d) + ")";
      })
      .attr("text-anchor", "middle")
      .text(function(d) {
        return d.value;
      });

    d3
      .select("pieL")
      .selectAll("div")
      .data(ips)
      .enter()
      .append("div")
      .text(d => d.id + ": " + d.value)
      .attr("style", "font-size:30px");
  } catch (err) {
    console.log(err);
  }
};
