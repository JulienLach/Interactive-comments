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
    id: id.v4(),
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
  try {
    let data = fs.readFileSync("./data.json");
    let jsonData = JSON.parse(data);
    jsonData.comments.push(comment);
    fs.writeFileSync("./data.json", JSON.stringify(jsonData, null, 2));
    res.redirect("http://localhost:3000/index.html");
    console.log("Commentaire ajouté avec succès");
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send("Erreur lors de la lecture ou de l'écriture du fichier");
  }
});

// Route pour traiter post d'un reply à un commantaire (tester avec postman)
app.post("/api/replyToPost", (req, res) => {
  const replyText = req.body.content;
  const commentId = req.body.commentId;
  const reply = {
    id: id.v4(),
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
      repliesToReply: [],
    },
  };
  try {
    let data = fs.readFileSync("./data.json");
    let jsonData = JSON.parse(data);
    const comment = jsonData.comments.find(
      (comment) =>
        comment.user.username === reply.replyingTo && comment.id === commentId
    );
    if (comment) {
      comment.replies.push(reply);
      fs.writeFileSync("./data.json", JSON.stringify(jsonData, null, 2));
      res.redirect("http://localhost:3000/index.html");
      console.log("Réponse ajoutée avec succès");
    } else {
      res.status(404).send("Commentaire non trouvé");
    }
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send("Erreur lors de la lecture ou de l'écriture du fichier");
  }
});

// Route pour traiter le delete reply d'un commentaire
app.post("/api/deleteReply", (req, res) => {
  const replyId = req.body.replyId;
  try {
    let data = fs.readFileSync("./data.json", "utf8");
    const jsonData = JSON.parse(data);
    jsonData.comments.forEach((comment) => {
      const index = comment.replies.findIndex((reply) => reply.id === replyId);
      if (index !== -1) {
        comment.replies.splice(index, 1);
      }
    });
    fs.writeFileSync("./data.json", JSON.stringify(jsonData), "utf8");
    res.redirect("http://localhost:3000/index.html");
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send("Erreur lors de la lecture ou de l'écriture du fichier");
  }
});

// Route pour traier le reply d'un reply à un commentaire
app.post("/api/replyToReply", (req, res) => {
  // res.send("Réponse à une réponse");
  const replyText = req.body.content;
  const replyId = req.body.replyId;
  // const commentId = req.body.commentId;
  const replyToReply = {
    id: id.v4(),
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
    username: "juliusamo",
  };
  try {
    let data = fs.readFileSync("./data.json");
    let jsonData = JSON.parse(data);
    jsonData.comments.forEach((comment) => {
      comment.replies.forEach((reply) => {
        if (reply.id === replyId) {
          // Accédez à repliesToReply via reply.repliesToReply
          reply.repliesToReply.push(replyToReply);
          fs.writeFileSync("./data.json", JSON.stringify(jsonData, null, 2));
          res.redirect("http://localhost:3000/index.html");
          console.log("Réponse à une réponse ajoutée avec succès");
        }
      });
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send("Erreur lors de la lecture ou de l'écriture du fichier");
  }
});

app.post("/api/deletePost", (req, res) => {
  const commentId = req.body.commentId;
  try {
    let data = fs.readFileSync("./data.json", "utf8");
    const jsonData = JSON.parse(data);
    const index = jsonData.comments.findIndex(
      (comment) => comment.id === commentId
    );
    if (index !== -1) {
      jsonData.comments.splice(index, 1);
    }
    fs.writeFileSync("./data.json", JSON.stringify(jsonData), "utf8");
    res.redirect("http://localhost:3000/index.html");
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send("Erreur lors de la lecture ou de l'écriture du fichier");
  }
});

app.post("/api/deleteReplyToReply", (req, res) => {
  const replyId = req.body.replyId;
  try {
    let data = fs.readFileSync("./data.json", "utf8");
    const jsonData = JSON.parse(data);
    jsonData.comments.forEach((comment) => {
      comment.replies.forEach((reply) => {
        const index = reply.repliesToReply.findIndex(
          (replyToReply) => replyToReply.id === replyId
        );
        if (index !== -1) {
          reply.repliesToReply.splice(index, 1);
        }
      });
    });
    fs.writeFileSync("./data.json", JSON.stringify(jsonData), "utf8");
    res.redirect("http://localhost:3000/index.html");
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send("Erreur lors de la lecture ou de l'écriture du fichier");
  }
});

// Route pour traiter le update d'une reply à un commentaire
app.post("/api/editReply", (req, res) => {
  // res.send("Réponse mise à jour");
  const replyContent = req.body.content;
  const replyId = req.body.replyId;
  try {
    let data = fs.readFileSync("./data.json");
    let jsonData = JSON.parse(data);
    jsonData.comments.forEach((comment) => {
      comment.replies.forEach((reply) => {
        if (reply.id === replyId) {
          reply.content = replyContent;
          fs.writeFileSync("./data.json", JSON.stringify(jsonData, null, 2));
          res.redirect("http://localhost:3000/index.html");
          console.log("Réponse mise à jour avec succès");
        }
      });
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send("Erreur lors de la lecture ou de l'écriture du fichier");
  }
});
