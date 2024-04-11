const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();

// Serve static files from the current directory
app.use(express.static(__dirname));
// Pour analyser les corps de requête JSON
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/data.json", (req, res) => {
  const comment = req.body;
  fs.readFile("./data.json", (err, data) => {
    if (err) throw err;
    let jsonData = JSON.parse(data);
    jsonData.comments.push(comment);
    fs.writeFile("./data.json", JSON.stringify(jsonData), (err) => {
      if (err) throw err;
      res.status(200).send("Commentaire ajouté");
    });
  });
});
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
