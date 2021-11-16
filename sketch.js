const TOTAL = 150;

let birds = [];
let savedBirds = [];
let pipes = [];
let counter = 0;
let slider;

function setup() {
  let canvas = createCanvas(640, 480);
  canvas.parent('sketch')
  tf.setBackend('cpu');
  slider = createSlider(1, 10, 1);
  slider.parent('slider')
  for (let i = 0; i < TOTAL; i++) {
    birds[i] = new Bird();
  }
}

function draw() {
  for (let n = 0; n < slider.value(); n++) {
    if (counter % 75 == 0) {
      pipes.push(new Pipe());
    }
    counter++;
    for (let i = pipes.length - 1; i >= 0; i--) {
      pipes[i].update();
      for (let j = birds.length - 1; j >= 0; j--) {
        if (pipes[i].hits(birds[j])) {
          savedBirds.push(birds.splice(j, 1)[0]);
        }
      }
      document.getElementById('birds').innerHTML = `Alive birds: ${birds.length}`
      if (pipes[i].offscreen()) {
        pipes.splice(i, 1);
      }
    }
    for (let i = birds.length - 1; i >= 0; i--) {
      if (birds[i].offScreen()) {
        savedBirds.push(birds.splice(i, 1)[0]);
      }
    }
    for (let bird of birds) {
      bird.think(pipes);
      bird.update();
    }
    if (birds.length === 0) {
      counter = 0;
      grafica.clear();
      nextGeneration();
      pipes = [];
    }
  }
  background(0);
  for (let bird of birds) {
    bird.show();
  }
  for (let pipe of pipes) {
    pipe.show();
  }
}