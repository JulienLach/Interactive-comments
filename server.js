const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();

// Serve static files from the current directory
app.use(express.static(__dirname));
// Pour analyser les corps de requête JSON
app.use(express.json());

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

// Route pour la page d'accueil
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Route pour traiter la requete post et tester avec postman
app.post("/api", (req, res) => {
  const comment = req.body;
  fs.readFile("./data.json", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Erreur lors de la lecture du fichier");
      return;
    }
    let jsonData = JSON.parse(data);
    jsonData.comments.push(comment); // Ajoute le commentaire au tableau 'comments'
    fs.writeFile("./data.json", JSON.stringify(jsonData, null, 2), (err) => {
      if (err) {
        console.error(err);
        res.status(500).send("Erreur lors de l'écriture dans le fichier");
        return;
      }
      res.status(200).send("Commentaire ajouté");
    });
  });
});
