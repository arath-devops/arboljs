const SURPRISES = [
  {
    image: "./images/foto-1.jpg",
    quote:
      "Yo siento que lo nuestro es destino, por la conexion que tenemos",
  },
  {
    image: "./images/foto-2.jpg",
    quote:
      "Gracias por ser la persona que paso un mundial junto a mi, y por muchos mas juntos",
  },
  {
    image: "./images/foto-3.jpg",
    quote:
      "Por que me gusta verte sonreir y que no tengas pena de hacer cosas distindas a mi lado",
  },
  {
    image: "./images/foto-4.jpg",
    quote:
      "Siempre voy a querer tomarte de la mano y jamas soltarte pase lo que pase",
  },
];

const modal = document.getElementById("surpriseModal");
const modalPhoto = document.getElementById("modalPhoto");
const modalQuote = document.getElementById("modalQuote");
const surpriseBtn = document.getElementById("surpriseBtn");
const modalClose = document.getElementById("modalClose");
const modalBackdrop = document.getElementById("modalBackdrop");
const modalAgain = document.getElementById("modalAgain");

let lastIndex = -1;

function pickRandomSurprise() {
  let index = Math.floor(Math.random() * SURPRISES.length);

  if (SURPRISES.length > 1) {
    while (index === lastIndex) {
      index = Math.floor(Math.random() * SURPRISES.length);
    }
  }

  lastIndex = index;
  return SURPRISES[index];
}

function showRandomSurprise() {
  const surprise = pickRandomSurprise();
  modalPhoto.src = surprise.image;
  modalPhoto.alt = "Recuerdo especial";
  modalQuote.textContent = surprise.quote;
  modal.hidden = false;
  document.body.classList.add("modal-open");
  modalClose.focus();
}

function closeModal() {
  modal.hidden = true;
  document.body.classList.remove("modal-open");
  surpriseBtn.focus();
}

surpriseBtn.addEventListener("click", showRandomSurprise);
modalAgain.addEventListener("click", showRandomSurprise);
modalClose.addEventListener("click", closeModal);
modalBackdrop.addEventListener("click", closeModal);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !modal.hidden) {
    closeModal();
  }
});
