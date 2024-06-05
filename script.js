const CELL_SIZE = 50;
const WORLD_SIZE = 100;
const SPOTS = WORLD_SIZE / CELL_SIZE;

class Rules {
  constructor(lifespan, foodSpan, foodTypes) {
    this.lifespan = lifespan;
    this.foodSpan = foodSpan;
    this.foodTypes = foodTypes;
  }
}

class DeadCell {
  constructor(x, y) {
    this.type = "";
    this.color = `rgba(0,0,0,1)`;
    this.rules = new Rules(
            Infinity,
            Infinity,
            [],
          );
    this.x = x;
    this.y = y;
  }

  foodAround(_cellsAround) {
    return [];
  }

  check() {
    return false;
  }
}


class LiveCell extends DeadCell {
  constructor(type, color, rules, x, y) {
    super(x, y);
    this.type = type;
    this.color = color;
    this.rules = rules;

    this.lifetime = 0;
    this.foodTime = 0;
  }

  foodAround(cellsAround) {
    for (let i = 0; i < cellsAround.length; i++) {
      if (this.rules.foodTypes.contains(typeof (c))) {
        return [cellsAround.x, cellsAround.y];
      }
    }

    return [];
  }

  check() {
    if (this.lifetime >= this.rules.lifespan) {
      return false;
    } else if (this.foodTime >= this.rules.foodSpan) {
      return false;
    }

    return true;
  }
}

class World {
  constructor(el, shape, size) {
    this.el = document.getElementById(el);
    this.ctx = this.el.getContext("2d");
    this.shape = shape;
    this.size = size;
    this.cells = [];

    this.el.setAttribute("width", size);
    this.el.setAttribute("height", size);
  }

  draw() {
    for (const c of this.cells) {
      this.ctx.fillStyle = c.color;
      this.ctx.fillRect(c.x, c.y, CELL_SIZE, CELL_SIZE)
    }
  }

  create() {
    for (let i = 0; i < this.size; i += CELL_SIZE) {
      for (let j = 0; j < this.size; j += CELL_SIZE) {
        const red = getRandomIntBetween(0, 255);
        const green = getRandomIntBetween(0, 255);
        const blue = getRandomIntBetween(0, 255);
        const alpha = 1;
        const cell = new LiveCell(
          getRandomElement(["a", "b", "c", "d"]),
          `rgba(${red},${green},${blue},${alpha})`,
          new Rules(
            getRandomIntBetween(0, 10),
            getRandomIntBetween(0, 10),
            [],
          ), i, j);
        this.cells.push(cell);
      }
    }
  }

  iterate() {
    for (let i = 0; i < this.cells.length; i++) {
      if (!this.cells[i].check()) {
        this.cells[i] = new DeadCell(this.cells[i].x, this.cells[i].y);
      } else {
        const c = this.cells[i].foodAround([]);
        if (c.length === 0) {
          this.cells[i].foodTime++;
        } else {
          this.naturalSelection(this.cells[i], c);
          this.cells[i].foodTime = 0;
        }
        // this.cells[i].lifetime++;
      }
    }
  }

  naturalSelection(_predator, prey) {
    this.cells[prey.x + Math.ceil(prey.y / SPOTS)] = new DeadCell(prey.x, prey.y);
  }
}

function getRandomElement(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function getRandomIntBetween(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function main() {
  const world = new World("world", "square", WORLD_SIZE);
  world.create()

  function start() {
    world.draw();
    world.iterate();
    setTimeout(start, 1000);
  }

  start();
}

main()
