const showTopics = async filePath => {
  const importedAdInterests = await d3.json(filePath);

  const topics = importedAdInterests.topics;

  d3
    .select("main")
    .selectAll("div")
    .data(topics)
    .text(topic => topic)
    .enter()
    .append("div")
    .text(topic => topic)
    .attr("class", "topic");
};
