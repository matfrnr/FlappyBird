// Récupère la référence du canvas et du contexte 2D
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Crée une nouvelle image et définit sa source
const img = new Image();
img.src = "./media/flappy-bird-set.png";

// Variables du jeu
let gamePlaying = false;
const gravity = 0.5;
const speed = 6.2;
const size = [51, 36];
const jump = -11.5;
const cTenth = canvas.width / 10;

let index = 0,
  bestScore = 0,
  flight,
  flyHeight,
  currentScore,
  pipes;

const pipeWidth = 78;
const pipeGap = 270;

// Fonction pour générer la position verticale des tuyaux
const pipeLoc = () =>
  Math.random() * (canvas.height - (pipeGap + pipeWidth)) + pipeWidth;

// Fonction d'initialisation du jeu
const setup = () => {
  currentScore = 0;
  flight = jump;

  flyHeight = canvas.height / 2 - size[1] / 2;

  // Génère un tableau de tuyaux au départ
  pipes = Array(3)
    .fill()
    .map((a, i) => [canvas.width + i * (pipeGap + pipeWidth), pipeLoc()]);
};

// Fonction de rendu du jeu
const render = () => {
  index++;

  // Dessine le fond du jeu en se déplaçant
  ctx.drawImage(
    img,
    0,
    0,
    canvas.width,
    canvas.height,
    -((index * (speed / 2)) % canvas.width) + canvas.width,
    0,
    canvas.width,
    canvas.height
  );
  ctx.drawImage(
    img,
    0,
    0,
    canvas.width,
    canvas.height,
    -(index * (speed / 2)) % canvas.width,
    0,
    canvas.width,
    canvas.height
  );

  if (gamePlaying) {
    pipes.map((pipe) => {
      pipe[0] -= speed;

      // Dessine les tuyaux
      ctx.drawImage(
        img,
        432,
        588 - pipe[1],
        pipeWidth,
        pipe[1],
        pipe[0],
        0,
        pipeWidth,
        pipe[1]
      );
      ctx.drawImage(
        img,
        432 + pipeWidth,
        108,
        pipeWidth,
        canvas.height - pipe[1] + pipeGap,
        pipe[0],
        pipe[1] + pipeGap,
        pipeWidth,
        canvas.height - pipe[1] + pipeGap
      );

      if (pipe[0] <= -pipeWidth) {
        currentScore++;
        bestScore = Math.max(bestScore, currentScore);

        pipes = [
          ...pipes.slice(1),
          [pipes[pipes.length - 1][0] + pipeGap + pipeWidth, pipeLoc()],
        ];
        console.log(pipes);
      }

      if (
        [
          pipe[0] <= cTenth + size[0],
          pipe[0] + pipeWidth >= cTenth,
          pipe[1] > flyHeight || pipe[1] + pipeGap < flyHeight + size[1],
        ].every((elem) => elem)
      ) {
        gamePlaying = false;
        setup();
      }
    });
  }

  if (gamePlaying) {
    // Dessine l'oiseau en mouvement
    ctx.drawImage(
      img,
      432,
      Math.floor((index % 9) / 3) * size[1],
      ...size,
      cTenth,
      flyHeight,
      ...size
    );
    flight += gravity;
    flyHeight = Math.min(flyHeight + flight, canvas.height - size[1]);
  } else {
    // Dessine l'oiseau en position initiale lorsque le jeu n'est pas en cours
    ctx.drawImage(
      img,
      432,
      Math.floor((index % 9) / 3) * size[1],
      ...size,
      canvas.width / 2 - size[0] / 2,
      flyHeight,
      ...size
    );
    flyHeight = canvas.height / 2 - size[1] / 2;
    ctx.fillText(`Meilleur score : ${bestScore}`, 55, 245);
    ctx.fillText("Cliquez pour jouer", 48, 535);
    ctx.font = "bold 30px courier";
  }

  // Met à jour les scores dans le document HTML
  document.getElementById("bestScore").innerHTML = `Meilleur : ${bestScore}`;
  document.getElementById(
    "currentScore"
  ).innerHTML = `Actuel : ${currentScore}`;

  // Continue le rendu du jeu
  window.requestAnimationFrame(render);
};

// Appelle la fonction de configuration initiale
setup();

// Écoute l'événement "load" de l'image, puis appelle la fonction de rendu
img.onload = render;

// Écoute l'événement "click" sur le document pour commencer le jeu
document.addEventListener("click", () => (gamePlaying = true));

// Écoute l'événement "click" sur la fenêtre pour déclencher le saut de l'oiseau
window.onclick = () => (flight = jump);
