function HTMLActuator() {
  this.gridContainer    = document.querySelector(".grid-container");
  // this.tileContainer    = document.querySelector(".tile-container");
  this.scoreContainer   = document.querySelector(".score-container");
  this.bestContainer    = document.querySelector(".best-container");
  this.messageContainer = document.querySelector(".game-message");
  this.birdobj          = document.querySelector(".tile-bird");
  this.birdinn          = document.querySelector(".tile-bird .tile-inner");
  this.blockobja        = document.querySelector(".tile-block-a");
  this.blockobjb        = document.querySelector(".tile-block-b");
  this.blockobjc        = document.querySelector(".tile-block-c");
  this.blockobjd        = document.querySelector(".tile-block-d");
  this.blockinna        = document.querySelector(".tile-block-a .tile-inner");
  this.blockinnb        = document.querySelector(".tile-block-b .tile-inner");
  this.blockinnc        = document.querySelector(".tile-block-c .tile-inner");
  this.blockinnd        = document.querySelector(".tile-block-d .tile-inner");
}

HTMLActuator.prototype.actuate = function (grid, metadata) {
  var self = this;

  var classes = ["tile", "tile-bird"];

       if (Math.pow(2, metadata.score) > 1073741824) classes.push("tile-2147483648")
  else if (Math.pow(2, metadata.score) > 536870912) classes.push("tile-1073741824")
  else if (Math.pow(2, metadata.score) > 268435456) classes.push("tile-536870912")
  else if (Math.pow(2, metadata.score) > 134217728) classes.push("tile-268435456")
  else if (Math.pow(2, metadata.score) > 67108864) classes.push("tile-134217728")
  else if (Math.pow(2, metadata.score) > 33554432) classes.push("tile-67108864")
  else if (Math.pow(2, metadata.score) > 16777216) classes.push("tile-33554432")
  else if (Math.pow(2, metadata.score) > 8388608) classes.push("tile-16777216")
  else if (Math.pow(2, metadata.score) > 4194304) classes.push("tile-8388608")
  else if (Math.pow(2, metadata.score) > 2097152) classes.push("tile-4194304")
  else if (Math.pow(2, metadata.score) > 1048576) classes.push("tile-2097152")
  else if (Math.pow(2, metadata.score) > 524288) classes.push("tile-1048576")
  else if (Math.pow(2, metadata.score) > 262144) classes.push("tile-524288")
  else if (Math.pow(2, metadata.score) > 131072) classes.push("tile-262144")
  else if (Math.pow(2, metadata.score) > 65536) classes.push("tile-131072")
  else if (Math.pow(2, metadata.score) > 32768) classes.push("tile-65536")
  else if (Math.pow(2, metadata.score) > 16384) classes.push("tile-32768")
  else if (Math.pow(2, metadata.score) > 8192) classes.push("tile-16384")
  else if (Math.pow(2, metadata.score) > 4096) classes.push("tile-8192")
  else if (Math.pow(2, metadata.score) > 2048) classes.push("tile-4096")
  else if (Math.pow(2, metadata.score) > 1024) classes.push("tile-2048")
  else if (Math.pow(2, metadata.score) >  512) classes.push("tile-1024")
  else if (Math.pow(2, metadata.score) >  256) classes.push("tile-512")
  else if (Math.pow(2, metadata.score) >  128) classes.push("tile-256")
  else if (Math.pow(2, metadata.score) >   64) classes.push("tile-128")
  else if (Math.pow(2, metadata.score) >   32) classes.push("tile-64")
  else if (Math.pow(2, metadata.score) >   16) classes.push("tile-32")
  else if (Math.pow(2, metadata.score) >    8) classes.push("tile-16")
  else if (Math.pow(2, metadata.score) >    4) classes.push("tile-8")
  else if (Math.pow(2, metadata.score) >    2) classes.push("tile-4")
  else                            classes.push("tile-2");

  this.applyClasses(this.birdobj, classes);

  var zonesize = this.gridContainer.clientHeight;
  var morepos = 0.75 * (metadata.score - Math.floor(metadata.score));

  this.birdobj.style.top = metadata.birdpos * zonesize + "px";

  this.blockobja.style.top = [0.5 , 0   , 0   ][metadata.ab] * zonesize + "px";
  this.blockobjb.style.top = [0.75, 0.75, 0.25][metadata.ab] * zonesize + "px";
  this.blockobjc.style.top = [0.5 , 0   , 0   ][metadata.cd] * zonesize + "px";
  this.blockobjd.style.top = [0.75, 0.75, 0.25][metadata.cd] * zonesize + "px";

  this.blockobja.style.left = (0.5  - morepos) * zonesize + "px";
  this.blockobjb.style.left = (0.5  - morepos) * zonesize + "px";
  this.blockobjc.style.left = (1.25 - morepos) * zonesize + "px";
  this.blockobjd.style.left = (1.25 - morepos) * zonesize + "px";

  this.birdinn.textContent = Math.pow(2, Math.floor(metadata.score));

  window.requestAnimationFrame(function () {
    self.updateScore(Math.floor(metadata.score));
    self.updateBestScore(Math.floor(metadata.bestScore));
  });
};

// Continues the game (both restart and keep playing)
HTMLActuator.prototype.continue = function () {
  this.clearMessage();
};

HTMLActuator.prototype.clearContainer = function (container) {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
};

HTMLActuator.prototype.addTile = function (tile) {
  var self = this;

  var wrapper   = document.createElement("div");
  var inner     = document.createElement("div");
  var position  = tile.previousPosition || { x: tile.x, y: tile.y };
  var positionClass = this.positionClass(position);

  // We can't use classlist because it somehow glitches when replacing classes
  var classes = ["tile", "tile-" + tile.value, positionClass];

  if (Math.pow(2, tile.value) > 2048) classes.push("tile-super");

  this.applyClasses(wrapper, classes);

  inner.classList.add("tile-inner");
  inner.textContent = Math.pow(tile.value, 2);

  if (tile.previousPosition) {
    // Make sure that the tile gets rendered in the previous position first
    window.requestAnimationFrame(function () {
      classes[2] = self.positionClass({ x: tile.x, y: tile.y });
      self.applyClasses(wrapper, classes); // Update the position
    });
  } else if (tile.mergedFrom) {
    classes.push("tile-merged");
    this.applyClasses(wrapper, classes);

    // Render the tiles that merged
    tile.mergedFrom.forEach(function (merged) {
      self.addTile(merged);
    });
  } else {
    classes.push("tile-new");
    this.applyClasses(wrapper, classes);
  }

  // Add the inner part of the tile to the wrapper
  wrapper.appendChild(inner);

  // Put the tile on the board
  // this.tileContainer.appendChild(wrapper);
};

HTMLActuator.prototype.applyClasses = function (element, classes) {
  element.setAttribute("class", classes.join(" "));
};

HTMLActuator.prototype.normalizePosition = function (position) {
  return { x: position.x + 1, y: position.y + 1 };
};

HTMLActuator.prototype.positionClass = function (position) {
  position = this.normalizePosition(position);
  return "tile-position-" + position.x + "-" + position.y;
};

HTMLActuator.prototype.updateScore = function (score) {
  this.clearContainer(this.scoreContainer);

  var difference = score - this.score;
  this.score = score;

  this.scoreContainer.textContent = Math.pow(2, this.score);

  if (difference > 0) {
    var addition = document.createElement("div");
    addition.classList.add("score-addition");
    addition.textContent = "*" + Math.pow(2, difference);

    this.scoreContainer.appendChild(addition);
  }
};

HTMLActuator.prototype.updateBestScore = function (bestScore) {
  this.bestContainer.textContent = Math.pow(2, bestScore);
};

HTMLActuator.prototype.message = function (won) {
  var type    = won ? "game-won" : "game-over";
  var message = won ? "You win!" : "Game over!";

  this.messageContainer.classList.add(type);
  this.messageContainer.getElementsByTagName("p")[0].textContent = message;
};

HTMLActuator.prototype.clearMessage = function () {
  // IE only takes one value to remove at a time.
  this.messageContainer.classList.remove("game-won");
  this.messageContainer.classList.remove("game-over");
};
