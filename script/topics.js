const showTopics = async filePath => {
  const importedTopicFile = await d3.json(filePath);

  const topics = importedTopicFile.topics;

  d3
    .select("main")
    .selectAll("div")
    .data(topics)
    .enter()
    .append("div")
    .text(topic => topic)
    .attr("class", "topic");
};
