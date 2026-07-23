const SURPRISES = [
  {
    image: "./images/foto-1.jpeg",
    quote:
      "Yo siento que lo nuestro es destino, por la conexion que tenemos",
  },
  {
    image: "./images/foto-2.jpeg",
    quote:
      "Gracias por ser la persona que paso un mundial junto a mi, y por muchos mas juntos",
  },
  {
    image: "./images/foto-3.jpeg",
    quote:
      "Por que me gusta verte sonreir y que no tengas pena de hacer cosas distindas a mi lado",
  },
  {
    image: "./images/foto-4.jpeg",
    quote:
      "Siempre voy a querer tomarte de la mano y jamas soltarte pase lo que pase",
  },
  {
    quote:
      "Quiero ir escribiendo nuestra historia y capturando cada momento a tu lado, Me gustas mucho Lis ❤️",
    final: true,
  },
];

const modal = document.getElementById("surpriseModal");
const modalPhoto = document.getElementById("modalPhoto");
const modalQuote = document.getElementById("modalQuote");
const surpriseBtn = document.getElementById("surpriseBtn");
const modalClose = document.getElementById("modalClose");
const modalBackdrop = document.getElementById("modalBackdrop");
const modalAgain = document.getElementById("modalAgain");
const modalPanel = document.querySelector(".modal-panel");

let currentIndex = -1;
let scrollLockY = 0;

function lockPageScroll() {
  scrollLockY = window.scrollY || window.pageYOffset || 0;
  document.body.style.position = "fixed";
  document.body.style.top = `-${scrollLockY}px`;
  document.body.style.left = "0";
  document.body.style.right = "0";
  document.body.style.width = "100%";
  document.body.classList.add("modal-open");
}

function unlockPageScroll() {
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.left = "";
  document.body.style.right = "";
  document.body.style.width = "";
  document.body.classList.remove("modal-open");
  window.scrollTo(0, scrollLockY);
}

function openModal() {
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  lockPageScroll();
}

function showSurpriseAt(index) {
  const surprise = SURPRISES[index];
  const isFinal = Boolean(surprise.final);

  if (isFinal) {
    modalPhoto.hidden = true;
    modalPhoto.removeAttribute("src");
    modalPanel.classList.add("modal-panel--final");
  } else {
    modalPhoto.hidden = false;
    modalPhoto.src = surprise.image;
    modalPhoto.alt = "Recuerdo especial";
    modalPanel.classList.remove("modal-panel--final");
  }

  modalQuote.textContent = surprise.quote;
  modalAgain.textContent = isFinal ? "Salir" : "Otra sorpresa ♥";
  openModal();
  modalClose.focus({ preventScroll: true });
}

function showNextSurprise() {
  if (currentIndex >= SURPRISES.length - 1) {
    return;
  }

  currentIndex += 1;
  showSurpriseAt(currentIndex);
}

function handleModalAgain() {
  if (SURPRISES[currentIndex]?.final) {
    closeModal();
    return;
  }

  showNextSurprise();
}

function closeModal() {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  unlockPageScroll();
  currentIndex = -1;
  modalAgain.textContent = "Otra sorpresa ♥";
  modalPhoto.hidden = false;
  modalPanel.classList.remove("modal-panel--final");
  surpriseBtn.focus({ preventScroll: true });
}

function isModalOpen() {
  return modal.classList.contains("is-open");
}

surpriseBtn.addEventListener("click", showNextSurprise);
modalAgain.addEventListener("click", handleModalAgain);
modalClose.addEventListener("click", closeModal);
modalBackdrop.addEventListener("click", closeModal);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && isModalOpen()) {
    closeModal();
  }
});
