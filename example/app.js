import GhostFinder from "../dist/ghost-finder";

new GhostFinder({
  input: "#search-input",
  showResult: "#search-result",
  contentApiKey: "26d1e96d8d3b2e57a108950c06",
  homeUrl: "http://localhost:2368",
  singleResultTemplate:
    '<li><a href="##url">##excerpt - ##published_at</a></li>',
  time_format: "MMMM dd yyyy", // Follow line 32 in src/ghost-finder
});
