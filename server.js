const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();

// Déplacez cette ligne avant les routes
app.use(express.static(__dirname)); // Serve static files from the current directory

// Pour analyser les corps de requête JSON
app.use(express.json());

// Middleware pour analyser les corps de requête URL encodés
app.use(express.urlencoded({ extended: true }));

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

// Route pour la page d'accueil
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Route pour traiter la requete post et tester avec postman
app.post("/api", (req, res) => {
  const commentText = req.body.content;
  const comment = {
    content: commentText,
    createdAt: "Aujourd'hui",
    score: 0,
    user: {
      image: {
        png: "./images/avatars/image-juliusomo.png",
        webp: "./images/avatars/image-juliusomo.webp",
      },
      username: "juliusomo",
    },
  };
  fs.readFile("./data.json", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Erreur lors de la lecture du fichier");
      return;
    }
    let jsonData = JSON.parse(data);
    jsonData.comments.push(comment);
    fs.writeFile("./data.json", JSON.stringify(jsonData, null, 2), (err) => {
      if (err) {
        console.error(err);
        res.status(500).send("Erreur lors de l'écriture dans le fichier");
        return;
      } else {
        res.redirect("/");
      }
    });
  });
});
