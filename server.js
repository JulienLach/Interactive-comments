const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
const id = require("uuid");

// Déplacez cette ligne avant les routes
app.use(express.static(__dirname)); // Serve static files from the current directory

// Pour analyser les corps de requête JSON
app.use(express.json());

// Middleware pour analyser les corps de requête URL encodés (formulaires) pour par exemple faire passer des données de formulaire
app.use(express.urlencoded({ extended: true }));

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

// Route pour la page d'accueil
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Route pour traiter la requete post pour poster un commentaire  (tester avec postman)
app.post("/api", (req, res) => {
  const commentText = req.body.content;
  const comment = {
    id: id.v4(), // créé un id unique avec uuid pour le post d'un commentaire
    content: commentText,
    createdAt: "Aujourd'hui",
    score: 0,
    user: {
      image: {
        png: "./images/avatars/image-juliusomo.png",
        webp: "./images/avatars/image-juliusomo.webp",
      },
      username: "juliusamo",
    },
    replies: [],
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

// Route pour traiter post d'un reply à un commantaire (tester avec postman)
app.post("/api/replyToPost", (req, res) => {
  const replyText = req.body.content;
  const reply = {
    id: id.v4(), // créé un id unique avec uuid pour le post d'une réponse à un commentaire
    content: replyText,
    createdAt: "Aujourd'hui",
    score: 0,
    replyingTo: req.body.replyingTo,
    user: {
      image: {
        png: "./images/avatars/image-juliusomo.png",
        webp: "./images/avatars/image-juliusomo.webp",
      },
      username: "juliusamo",
    },
  };
  // Lire le fichier data.json
  fs.readFile("./data.json", (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send("Erreur lors de la lecture du fichier");
      return;
    }
    let jsonData = JSON.parse(data);
    // Trouver le commentaire auquel on répond
    const comment = jsonData.comments.find(
      (comment) => comment.user.username === reply.replyingTo
    );

    // Vérifier si le commentaire existe
    if (comment) {
      // Ajouter le reply au commentaire
      comment.replies.push(reply);
      // Ecrire le fichier data.json
      fs.writeFile("./data.json", JSON.stringify(jsonData, null, 2), (err) => {
        if (err) {
          console.error(err);
          res.status(500).send("Erreur lors de l'écriture dans le fichier");
          return;
        } else {
          res.redirect("/");
        }
      });
    } else {
      res.status(404).send("Commentaire non trouvé");
    }
  });
});

// Route pour traiter le delete reply d'un commentaire
app.post("/api/deleteReply", (req, res) => {
  const replyId = req.body.replyId;

  fs.readFile("./data.json", "utf8", (err, data) => {
    if (err) {
      res.status(500).send("Erreur lors de la lecture du fichier");
      return;
    }

    const jsonData = JSON.parse(data); // Convertir le contenu du fichier en objet JSON
    jsonData.comments.forEach((comment) => {
      const index = comment.replies.findIndex((reply) => reply.id === replyId);
      if (index !== -1) {
        comment.replies.splice(index, 1);
      }
    });

    fs.writeFile("./data.json", JSON.stringify(jsonData), "utf8", (err) => {
      if (err) {
        res.status(500).send("Erreur lors de l'écriture du fichier");
        return;
      }
      res.redirect("/");
    });
  });
});

// Route pour traiter le le reply à un reply
app.post("/api/replyToReply", (req, res) => {
  const replyText = req.body.content;
  const replyId = req.body.replyId;
  const reply = {
    id: id.v4(), // créé un id unique avec uuid pour le post d'une réponse à un commentaire
    content: replyText,
    createdAt: "Aujourd'hui",
    score: 0,
    replyingTo: req.body.replyingTo,
    user: {
      image: {
        png: "./images/avatars/image-juliusomo.png",
        webp: "./images/avatars/image-juliusomo.webp",
      },
      username: "juliusamo",
    },
  };
  // lire le fichier data.json
  fs.readFile("./data.json", (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send("Erreur lors de la lecture du fichier");
      return;
    }
    let jsonData = JSON.parse(data);
    // trouver la reply à laquelle on répond
    const replyToReply = jsonData.comments.find(
      (replyToReply) => replyToReply.id === replyId
    );

    // vérifier si le reply existe
    if (replyToReply) {
      // ajouter le reply au reply
      replyToReply.replies.push(reply);
      // écrire le fichier data.json
      fs.writeFile("./data.json", JSON.stringify(jsonData, null, 2), (err) => {
        if (err) {
          console.error(err);
          res.status(500).send("Erreur lors de l'écriture dans le fichier");
          return;
        } else {
          res.redirect("/");
        }
      });
    } else {
      res.status(404).send("Reply non trouvé");
    }
  });
});

// Route pour traiter le update d'une reply à un commentaire
app.post("/api/updateReply", (req, res) => {
  res.send("Réponse mise à jour");
});
