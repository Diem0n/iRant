const rantsSection = document.getElementById("rants");
const form = document.getElementById("form");
var rants = [];

const generateId = () => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let id = "";
  for (let i = 0; i < 8; i++) {
    id += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return id;
};

const generateRant = (id, isFav, title, rant, createdAt) => {
  return `
  <div class="rant-card" data-rant-id=${id}>
  <div class="rant-header">
  <div class="rant-title">
  <h3>${title}</h3>
  </div>
  <div class="functions">
  <span id="favIcon" class="favIcon">
  <i id="heart" class="fi ${
    isFav ? "fi-sr-heart" : "fi-rr-heart"
  } heart" data-action="toggleFav"></i>
  </span>
        <span>
          <i class="fi fi-rr-file-edit" data-action="editRant"></i>
        </span>
      </div>
    </div>
    <p class="rant">${rant}</p>
    <div class="rant-date">
      <p>${createdAt}</p>
      </div>
  </div>
  `;
};

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let title = document.getElementById("title");
  let rant = document.getElementById("rant");
  let createdAt = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  let id = generateId();
  rants.push({
    id: id,
    title: title.value,
    rant: rant.value,
    isFav: false,
    createdAt: createdAt,
  });
  updateRantsList();
  title.value = "";
  rant.value = "";
});

rantsSection.addEventListener("click", (e) => {
  if (e.target && e.target.dataset.action === "toggleFav") {
    let rantId = e.target.closest(".rant-card").getAttribute("data-rant-id");
    let rant = rants.find((r) => r.id === rantId);
    if (rant) {
      rant.isFav = rant.isFav ? false : true;
      console.log(rant);
      updateRantsList();
    }
  }
  if (e.target && e.target.dataset.action === "editRant") {
    let rantId = e.target.closest(".rant-card").getAttribute("data-rant-id");
    let rant = rants.find((r) => r.id === rantId);
    console.log("inside");
    if (rant) {
      openEditDialog(rant);
    }
  }
});

const openEditDialog = (rant) => {
  let editDialog = document.getElementById("editDialog");
  let titleInput = editDialog.querySelector("#editTitle");
  let rantInput = editDialog.querySelector("#editRant");
  let rantId = editDialog.querySelector("#rantId");
  let createdAt = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  let deleteBtn = document.getElementById("delete");
  let id = rant.id;
  titleInput.value = rant.title;
  rantInput.value = rant.rant;
  rantId.innerHTML = "ID#" + id;
  editDialog.addEventListener("submit", (e) => {
    e.preventDefault();
    rant.title = titleInput.value;
    rant.rant = rantInput.value;
    rant.createdAt = createdAt;
    updateRantsList();
    editDialog.close();
  });

  deleteBtn.addEventListener("click", (e) => {
    e.preventDefault();
    let idx = rants.findIndex((rant) => rant.id === id);
    rants.splice(idx, 1);
    updateRantsList();
    editDialog.close();
  });
  editDialog.showModal();
};

const updateRantsList = () => {
  rants.sort((a, b) => (a.isFav === b.isFav ? 0 : a.isFav ? -1 : 1));
  rantsSection.innerHTML = "";
  rants.forEach((rant) => {
    const card = document.createElement("div");
    card.innerHTML = generateRant(
      rant.id,
      rant.isFav,
      rant.title,
      rant.rant,
      rant.createdAt
    );
    rantsSection.appendChild(card);
  });
};
