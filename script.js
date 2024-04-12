// let counters = document.querySelectorAll(".counter");
const plusButtons = document.querySelectorAll(".plus");
const minusButtons = document.querySelectorAll(".minus");
const replyButtons = document.querySelectorAll(".reply-btn");
const editButtons = document.querySelectorAll(".edit-btn");
const deleteButtons = document.querySelectorAll(".delete-btn");

// VOTES //
function increaseVotes() {
  const plusButtons = document.querySelectorAll(".plus");
  const counters = document.querySelectorAll(".counter");
  plusButtons.forEach((button, index) => {
    plusButtons[index].addEventListener("click", () => {
      counters[index].innerText = parseInt(counters[index].innerText) + 1;
    });
  });
}

function decreaseVotes() {
  const minusButtons = document.querySelectorAll(".minus");
  const counters = document.querySelectorAll(".counter");
  minusButtons.forEach((button, index) => {
    minusButtons[index].addEventListener("click", () => {
      counters[index].innerText = parseInt(counters[index].innerText) - 1;
    });
  });
}

// REPLY FUNCTIONS //
// au clic du boutton reply append une div en dessous de la div parente du boutton
function replyToPost() {
  const replyButtons = document.querySelectorAll(".reply-btn");
  replyButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // empêcher de cliquer à nouveau sur le bouton reply
      if (button.classList.contains("clicked")) {
        button.disabled = true;
        return; // arrête l'exécution de la fonction
      }

      const postDiv = button.closest(".post");
      const replyDiv = document.createElement("div");
      const userToReply = button
        .closest(".content")
        .querySelector(".profil-name").innerText;

      replyDiv.innerHTML = `<div class="post">
      <form action="/api/replyToPost" method="POST">
        <img src="./images/avatars/image-juliusomo.png" alt="" />
        <textarea
          name="content"
          class="comment-text"
          rows="4"
          placeholder="Add a comment..."
        >@${userToReply} </textarea>
        <input type="hidden" name="replyingTo" value="${userToReply}" />
        <button id="submitButton" class="sendButton">REPLY</button>
      </form>
    </div>
  </div>`;
      postDiv.insertAdjacentElement("afterend", replyDiv);
    });
  });
}

function replyToReply() {
  const replyButtons = document.querySelectorAll(".reply-btn");

  replyButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // empêcher de cliquer à nouveau sur le bouton reply
      if (button.classList.contains("clicked")) {
        button.disabled = true;
        return; // arrête l'exécution de la fonction
      }

      const postDiv = button.closest(".reply");
      const replyDiv = document.createElement("div");
      button.classList.add("clicked");
      replyDiv.innerHTML = `<div class="reply">
      <form action="index.html">
        <img src="./images/avatars/image-juliusomo.png" alt="" />
        <textarea
          class="comment-text"
          rows="4"
          placeholder="Add a comment..."
        >@taggedUser </textarea>
        <button id="submitButton" class="sendButton">REPLY</button>
      </form>
    </div>
  </div>`;
      postDiv.insertAdjacentElement("afterend", replyDiv);
    });
  });
}

// EDIT FUNCTION //
function editReply() {
  const editButtons = document.querySelectorAll(".edit-btn");

  editButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // empêcher de cliquer à nouveau sur le bouton reply
      if (button.classList.contains("clicked")) {
        button.disabled = true;
        return; // arrête l'exécution de la fonction
      }
      const postDiv = button.closest(".reply");
      const replyDiv = document.createElement("div");
      button.classList.add("clicked");

      replyDiv.innerHTML = `<div class="reply">
      <form action="index.html">
        <img src="./images/avatars/image-juliusomo.png" alt="" />
        <textarea
          class="comment-text"
          rows="4"
          placeholder="Add a comment..."
        >@taggedUser Impressive! Though it seems the drag feature could be improved. But overall it looks incredible. You've nailed the design and the responsiveness at various breakpoints works really well.</textarea>
        <button id="submitButton" class="sendButton">UPDATE</button>
      </form>
    </div>
  </div>`;
      postDiv.insertAdjacentElement("afterend", replyDiv);
    });
  });
}

// DELETE FUNCTION CREER UN MODAL AVEC VALIDER OU ANNULER //
function deleteReply() {
  const deleteButtons = document.querySelectorAll(".delete-btn");
  deleteButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const dialog = document.createElement("dialog");
      dialog.innerHTML = `
        <div class="modal-content">
          <div class="modal-header">
          <h2>Supprimer le commentaire</h2>
          </div>
          <div class="modal-body">
          <p>Êtes-vous sûr de vouloir supprimer ce commentaire ? Impossible de revenir en arrière après la suppression</p>
          </div>
          <div class="modal-buttons">
          <button class="cancel-remove-btn">ANNULER</button>
            <form action="/api/deleteReply" method="POST">
              <button class="remove-comment-btn">VALIDER</button>
            </form>
          </div>
        </div>
      `;
      document.body.appendChild(dialog);

      // Ouvrir le dialogue
      dialog.showModal();

      // Fermer le dialogue lorsque le bouton "CANCEL" est cliqué
      dialog.querySelector(".cancel-btn").addEventListener("click", () => {
        dialog.close();
      });

      // Supprimer le dialogue lorsque le bouton "DELETE" est cliqué
      dialog.querySelector(".delete-btn").addEventListener("click", () => {
        // Ici, vous pouvez ajouter le code pour supprimer la réponse
        dialog.remove();
      });
    });
  });
}

// LIRE LES DONNEES DU FICHIER JSON ET LES INTEGRER DANS LE DOM avec la méthode fetch
function fetchData() {
  fetch("./data.json")
    .then((reponse) => reponse.json())
    .then((data) => {
      // afficher les données dans la console
      console.log(data);

      // afficher les données dans le DOM
      const container = document.querySelector(".container");

      // pour chaque commentaire dans le fichier JSON
      data.comments.forEach((comment) => {
        //créer une div post
        const postDiv = document.createElement("div");
        postDiv.classList.add("post");

        // Remplir la div "post" avec les données du commentaire
        // ajouter la condition if pour afficher le "YOU" dans le cas où le commentaire est de l'utilisateur actuel
        if (
          data.currentUser.username === "juliusomo" &&
          comment.user.username === "juliusomo"
        ) {
          postDiv.innerHTML = `
        <div class="votes">
          <div class="plus"><i class="fa-solid fa-plus"></i></div>
          <div class="counter">${comment.score}</div>
          <div class="minus"><i class="fa-solid fa-minus"></i></div>
        </div>
        <div class="content">
          <div class="content-headers">
            <div class="content-header-infos">
              <div class="profil-img">
                <img src="${comment.user.image.png}" alt="" />
              </div>
              <div class="profil-name">${comment.user.username}</div>
              <div class="current-user-tag">You</div>
              <div class="post-date">${comment.createdAt}</div>
            </div>
            <div class="content-header-buttons">
              <button class="reply-btn">
                <i class="fa-solid fa-reply"></i>Reply
              </button>
            </div>
          </div>
          <div class="content-body">
            <div class="message">
              <p>${comment.content}</p>
            </div>
          </div>
        </div>
      `;
        } else {
          postDiv.innerHTML = `
          <div class="votes">
            <div class="plus"><i class="fa-solid fa-plus"></i></div>
            <div class="counter">${comment.score}</div>
            <div class="minus"><i class="fa-solid fa-minus"></i></div>
          </div>
          <div class="content">
            <div class="content-headers">
              <div class="content-header-infos">
                <div class="profil-img">
                  <img src="${comment.user.image.png}" alt="" />
                </div>
                <div class="profil-name">${comment.user.username}</div>
                <div class="post-date">${comment.createdAt}</div>
              </div>
              <div class="content-header-buttons">
                <button class="reply-btn">
                  <i class="fa-solid fa-reply"></i>Reply
                </button>
              </div>
            </div>
            <div class="content-body">
              <div class="message">
                <p>${comment.content}</p>
              </div>
            </div>
          </div>
        `;
        }

        // Ajouter la div "post" à la div "container"
        container.appendChild(postDiv);

        // pour chaque réponse dans le commentaire actuel on est dans la boucle de commentaire
        // donc on utilise le (comment) actuel
        // Pour chaque réponse
        if (comment.replies) {
          comment.replies.forEach((reply) => {
            // Créer une div "reply"
            const replyDiv = document.createElement("div");
            replyDiv.classList.add("reply");

            if (
              data.currentUser.username === "juliusomo" &&
              reply.user.username === "juliusomo"
            ) {
              replyDiv.innerHTML = `
          <div class="votes">
            <div class="plus"><i class="fa-solid fa-plus"></i></div>
            <div class="counter">${reply.score}</div>
            <div class="minus"><i class="fa-solid fa-minus"></i></div>
          </div>
          <div class="content">
            <div class="content-headers">
              <div class="content-header-infos">
                <div class="profil-img">
                  <img src="${reply.user.image.png}" alt="" />
                </div>
                <div class="profil-name">${reply.user.username}</div>
                <div class="current-user-tag">You</div>
                <div class="post-date">${reply.createdAt}</div>
              </div>
              <div class="content-header-buttons">
                <button class="delete-btn">
                  <i class="fa-solid fa-trash"></i>Delete
                </button>
                <button class="edit-btn">
                  <i class="fas fa-edit"></i>Edit
                </button>
              </div>
            </div>
            <div class="content-body">
              <div class="message">
                <p><span class="tagged-replied-user">@${reply.replyingTo}</span> ${reply.content}</p>
              </div>
            </div>
          </div>
        `;
            } else {
              // Remplir la div "reply" avec les données de la réponse
              replyDiv.innerHTML = `
          <div class="votes">
            <div class="plus"><i class="fa-solid fa-plus"></i></div>
            <div class="counter">${reply.score}</div>
            <div class="minus"><i class="fa-solid fa-minus"></i></div>
          </div>
          <div class="content">
            <div class="content-headers">
              <div class="content-header-infos">
                <div class="profil-img">
                  <img src="${reply.user.image.png}" alt="" />
                </div>
                <div class="profil-name">${reply.user.username}</div>
                <div class="post-date">${reply.createdAt}</div>
              </div>
              <div class="content-header-buttons">
                <button class="reply-btn">
                  <i class="fa-solid fa-reply"></i>Reply
                </button>
              </div>
            </div>
            <div class="content-body">
              <div class="message">
                <p><span class="tagged-replied-user">@${reply.replyingTo}</span> ${reply.content}</p>
              </div>
            </div>
          </div>
          `;
            }

            // Ajouter la div "reply" à la div "post"
            postDiv.insertAdjacentElement("afterend", replyDiv);
          });
        }

        // Appeler les fonctions dans le fetch pour que les événements soient ajoutés aux éléments créés
      });
      replyToPost();
      replyToReply();
      increaseVotes();
      decreaseVotes();
      editReply();
      deleteReply();
    });
}

fetchData();
