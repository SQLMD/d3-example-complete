const getIPs = async (filePath, minValue) => {
  const width = 300;
  const height = 300;
  try {
    const importAccountActivity = await d3.json(filePath);

    const activities = importAccountActivity.account_activity.map(
      activity => activity.ip_address
    );

    const activityIPs = countBy(activities)
      .filter(ip => ip.value > minValue)
      .sort((ip1, ip2) => ip2.value - ip1.value);

    console.log("Activity IP Addresses with Counts:", activityIPs);
    const countValues = activityIPs.map(ip => ip.value);

    console.log("Count Values", countValues);
    const outerRadius = width / 2;
    const innerRadius = width / 3;
    const arc = d3
      .arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius);

    const pie = d3.pie();

    console.log("Count Values with Pie", pie(countValues));

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
      .data(pie(countValues))
      .enter()
      .append("g")
      .attr("class", "arc")
      .attr("transform", "translate(" + outerRadius + "," + outerRadius + ")");

    //Draw arc paths
    arcs
      .append("path")
      .attr("fill", (countValue, index) => color(index))
      .attr("d", (countValue, index) => arc(countValue, index));

    //Labels
    arcs
      .append("text")
      .attr("transform", pieCountValue => {
        return "translate(" + arc.centroid(pieCountValue) + ")";
      })
      .attr("text-anchor", "middle")
      .text(pieCountValue => {
        return pieCountValue.value;
      });

    d3
      .select("pieL")
      .selectAll("div")
      .data(activityIPs)
      .enter()
      .append("div")
      .text(ipAddress => ipAddress.id + ": " + ipAddress.value)
      .attr("style", "font-size:30px");
  } catch (err) {
    console.log(err);
  }
};

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
