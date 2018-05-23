const getTimes = async (filePath, minValue) => {
  //Width and height
  const width = 1200;
  const height = 500;

  //For converting Dates to strings
  const formatTime = d3.timeFormat("%m/%d/%y");

  const importedYourPosts = await d3.json(filePath);

  const statusUpdateDates = importedYourPosts.status_updates
    .sort((post1, post2) => post1.timestamp - post2.timestamp)
    .map(post => new Date(post.timestamp * 1000))
    .map(postTimeStamp => formatTime(postTimeStamp));

  const postDates = countBy(statusUpdateDates).filter(
    postDate => postDate.value > minValue
  );

  console.log(postDates);

  const barWidth = width / postDates.length;

  const scale = d3
    .scaleLinear()
    .domain([
      d3.min(postDates, date => date.value),
      d3.max(postDates, date => date.value)
    ])
    .range([110, height - 50]);

  const svg = d3
    .select("barchart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  svg
    .selectAll("rect")
    .data(postDates)
    .enter()
    .append("rect")
    .attr("x", (date, index) => index * barWidth)
    .attr("y", date => height - scale(date.value))
    //.attr("y", date => height - date.value)
    .attr("width", barWidth)
    .attr("height", date => scale(date.value))
    //.attr("height", date => date.value)
    .attr("fill", (date, index) => {
      if (index % 2 === 0) {
        return "blue";
      }
      return "darkblue";
    });

  svg
    .selectAll("text")
    .data(postDates)
    .enter()
    .append("text")
    .text(date => date.id + " - " + date.value)
    .attr("font-size", barWidth / 6 > 8 ? barWidth / 6 : 8)
    .attr("fill", "white")
    .attr("transform", (date, index) => {
      const x = index * barWidth + (barWidth - 8) / 2;
      const y = height - scale(date.value) + 10;
      return "translate(" + x + "," + y + ") rotate(90)";
    });
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
