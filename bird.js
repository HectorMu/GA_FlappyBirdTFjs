class Bird {
    constructor(brain) {
      this.y = height / 2;
      this.x = 80; 
      this.gravity = 0.8;
      this.lift = -12;
      this.velocity = 0;
      this.score = 0;
      this.fitness = 0;
      if (brain) {
        this.brain = brain.copy();
      } else {
        this.brain = new NeuralNetwork(5, 8, 2);
      }
    }
  
    dispose() {
      this.brain.dispose();
    }

    show() {
      stroke(255);
      fill(255, 100);
      ellipse(this.x, this.y, 32, 32);
    }
    up() {
      this.velocity += this.lift;
    }
  
    mutate() {
      this.brain.mutate(0.1);
    }
  
    think(pipes) {
      // Find the closest pipe
      let closest = null;
      let closestD = Infinity;
      for (let i = 0; i < pipes.length; i++) {
        let d = pipes[i].x + pipes[i].w - this.x;    
        if (d < closestD && d > 0) {
          closest = pipes[i];
          closestD = d;
        }
      }
      let inputs = [];
      inputs[0] = this.y / height;
      inputs[1] = closest.top / height; 
      inputs[2] = closest.bottom / height;
      inputs[3] = closest.x / width;
      inputs[4] = this.velocity / 10;
      let output = this.brain.predict(inputs);
      document.getElementById('output').value = output
      if (output[0] > output[1]) {
        this.up();
      }
    }
  
    offScreen() {
      return this.y > height || this.y < 0;
    }
  
    update() {
      this.score++;
      document.getElementById('score').innerHTML = `Score: ${this.score}`
      scores.push(this.score);
      document.getElementById('maxscore').innerHTML = `Max score: ${Math.max(...scores)}`
      this.velocity += this.gravity;
      //this.velocity *= 0.9;
      this.y += this.velocity;
    }
  }