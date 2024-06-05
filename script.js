const CELL_SIZE = 4
const WORLD_SIZE = 400;

class World {
  constructor(el, cells, shape, size) {
    this.el = document.getElementById(el);
    this.ctx = this.el.getContext("2d");
    this.shape = shape;
    this.size = size;
    this.cells = cells;

    this.el.setAttribute("width", size);
    this.el.setAttribute("height", size);
  }

  draw() {
    for (const c of this.cells) {
      this.ctx.fillStyle = c.color;
      this.ctx.fillRect(c.x, c.y, CELL_SIZE, CELL_SIZE)
    }
  }

  iterate() {
    for (let i = 0; i < this.cells.length; i++) {
      const red = getRandomIntBetween(0, 255);
      const green = getRandomIntBetween(0, 255);
      const blue = getRandomIntBetween(0, 255);
      const alpha = 1;
      const cell = new Cell(`rgba(${red},${green},${blue},${alpha})`, {}, this.cells[i].x, this.cells[i].y);
      this.cells[i] = cell;
    }
  }
}

class Rule {
  constructor(lifespan, food, range) {
    this.lifespan = lifespan;
    this.food = food;
    this.range = range;
  }
}

class Cell {
  constructor(color, rules, x, y) {
    this.color = color;
    this.rules = rules;
    this.x = x;
    this.y = y;
  }
}

function getRandomIntBetween(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function main() {
  const cells = [];
  for (let i = 0; i < WORLD_SIZE; i += CELL_SIZE) {
    for (let j = 0; j < WORLD_SIZE; j += CELL_SIZE) {
      cells.push(new Cell("", {}, i, j));
    }
  }

  const world = new World("world", cells, "square", WORLD_SIZE);

  function start() {
    world.iterate();
    world.draw();

    setTimeout(start, 50);
  }

  start();
}

main()
