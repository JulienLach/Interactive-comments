let counters = document.querySelectorAll(".counter");
const plusButtons = document.querySelectorAll(".plus");
const minusButtons = document.querySelectorAll(".minus");
const replyButtons = document.querySelectorAll(".reply-btn");
const editButtons = document.querySelectorAll(".edit-btn");
const deleteButtons = document.querySelectorAll(".delete-btn");

// VOTES //
function increaseVotes() {
  plusButtons.forEach((button, index) => {
    plusButtons[index].addEventListener("click", () => {
      counters[index].innerText = parseInt(counters[index].innerText) + 1;
    });
  });
}

function decreaseVotes() {
  minusButtons.forEach((button, index) => {
    minusButtons[index].addEventListener("click", () => {
      counters[index].innerText = parseInt(counters[index].innerText) - 1;
    });
  });
}

increaseVotes();
decreaseVotes();

// REPLY FUNCTIONS //
// au clic du boutton reply append une div en dessous de la div parente du boutton
function replyToPost() {
  replyButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // empêcher de cliquer à nouveau sur le bouton reply
      if (button.classList.contains("clicked")) {
        button.disabled = true;
        return; // arrête l'exécution de la fonction
      }

      const postDiv = button.closest(".post");
      const replyDiv = document.createElement("div");

      replyDiv.innerHTML = `<div class="post">
      <form action="index.html">
        <img src="./images/avatars/image-juliusomo.png" alt="" />
        <input
          class="comment-text"
          type="text"
          placeholder="Add a comment..." value="@taggedUser "
        />
        <button id="submitButton" class="submitButton">REPLY</button>
      </form>
    </div>
  </div>`;
      postDiv.insertAdjacentElement("afterend", replyDiv);
    });
  });
}

function replyToReply() {
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
        <input
          class="comment-text"
          type="text"
          placeholder="Add a comment..." value="@taggedUser "
        />
        <button id="submitButton" class="submitButton">REPLY</button>
      </form>
    </div>
  </div>`;
      postDiv.insertAdjacentElement("afterend", replyDiv);
    });
  });
}

replyToPost();
replyToReply();

// EDIT FUNCTION //
function editReply() {
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
        <input
          class="comment-text"
          type="text"
          placeholder="Add a comment..." value="@taggedUser Impressive! Though it seems the drag feature could be improved. But overall it looks incredible. You've nailed the design and the responsiveness at various breakpoints works really well. "
        />
        <button id="submitButton" class="submitButton">UPDATE</button>
      </form>
    </div>
  </div>`;
      postDiv.insertAdjacentElement("afterend", replyDiv);
    });
  });
}

editReply();

// DELETE FUNCTION CREER UN MODAL AVEC VALIDER OU ANNULER //
function deleteReply() {}

// LIRE LES DONNEES DU FICHIER JSON ET LES INTEGRER DANS LE DOM avec la méthode fetch
fetch("./data.json")
  .then((reponse) => reponse.json())
  .then((data) => {
    // afficher les données
    const comments = data.comments;
    const replies = data.replies;
    console.log(comments);
    console.log(replies);
  });
