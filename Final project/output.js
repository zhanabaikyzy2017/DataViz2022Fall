const fs = require("fs");

fs.readFile("initial.json", "utf-8", (err, initialData) => {
  const articles = JSON.parse(initialData);
  const data = {
    name: "publications",
    children: Object.keys(articles).map((key) => {
      const color = Math.floor(Math.random() * 16777215).toString(16);

      return {
        name: key,
        color: `#${color}`,
        children: articles[key],
      };
    }),
  };

  fs.writeFile("articles.json", JSON.stringify(data), (err) => {});
});
