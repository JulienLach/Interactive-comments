let counters = document.querySelectorAll(".counter");
const plusButtons = document.querySelectorAll(".plus");
const minusButtons = document.querySelectorAll(".minus");
const replyButtons = document.querySelectorAll(".reply-btn");

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
function reply() {
  replyButtons.forEach((button) => {
    button.addEventListener("click", () => {
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

reply();
