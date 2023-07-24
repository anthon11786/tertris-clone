const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');

const tetrominoStoreCanvas = document.getElementById('storedPiece');
const storeContext = tetrominoStoreCanvas.getContext('2d');

context.scale(20, 20); // Scales everything in the context 20x 
storeContext.scale(20, 20);
storeContext.fillStyle = '#000'
storeContext.fillRect(0, 0, tetrominoStoreCanvas.width/20, tetrominoStoreCanvas.height/20);
storeContext.strokeStyle = '#888'; // Grid line color
storeContext.lineWidth = 0.05; // Grid line width

// Start storedCanvas with grid lines 
for(let i=0; i<tetrominoStoreCanvas.width/20; i++) {
  for(let j=0; j<tetrominoStoreCanvas.height/20; j++) {
    storeContext.strokeRect(i, j, 1, 1); // Draw the grid line
  }
}


// Check if rows are completed 
function arenaSweep() {
  let rowCount = 1; 
  outer: for (let y = arena.length -1; y > 0; y--) {
    for (let x = 0; x < arena[y].length; ++x) {
      // Check if any of rows have a zero, if it does not fully complete then
      if (arena[y][x] === 0) {
        continue outer; 
      }

    }
    const row = arena.splice(y, 1)[0].fill(0); // takes rows out of arena, and fills it with 0 
    arena.unshift(row); // append empty row to the top
    y++; 
    
    player.score += rowCount; 
    // rowCount *= 2; 
  }
}


// Data structures for tetrinemos 
const matrix = [
  [0, 0, 0],
  [1, 1, 1],
  [0, 1, 0],

]

function collide(arena, player) {
  const [matrix, offset] = [player.matrix, player.pos]; 

  // iterating over the player 
  for (let y = 0; y < matrix.length; ++y) {
    for (let x = 0; x < matrix[y].length; ++x) {
      if (matrix[y][x] !== 0 &&
         (offset.y + y < arena.length &&
          offset.x + x < arena[offset.y + y].length &&
          arena[offset.y + y][offset.x + x]) !== 0)  {
        // collision detected 
        // conditions -> cell has to be a '1' not '0' 
        // the row has to exist in the 'arena' and
        return true;
      }

    }
  }
  return false; 
}

function createMatrix(width, height){
  const matrix = [];

  while (height--) {
    matrix.push(new Array(width).fill(0));
  }
  return matrix;
}

// 
function createPiece(type) {
  if (type === 'T') {
    return [
        [0, 0, 0],
        [1, 1, 1],
        [0, 1, 0], 
      ];
  } else if (type === 'O'){
      return [
          [2, 2],
          [2, 2],
      ];
  } else if (type === 'L') {
      return [
        [0, 3, 0],
        [0, 3, 0],
        [0, 3, 3], 
      ]
  } else if (type === 'J') {
      return [
        [0, 4, 0],
        [0, 4, 0],
        [4, 4, 0], 
      ]
  } else if (type === 'I'){
      return [
        [0, 5, 0, 0],
        [0, 5, 0, 0],
        [0, 5, 0, 0], 
        [0, 5, 0, 0], 
      ]
  } else if (type === 'S') {
      return [
        [0, 6, 6],
        [6, 6, 0],
        [0, 0, 0], 
      ]
  } else if (type === 'Z'){
    return [ 
      [7, 7, 0],
      [0, 7, 7],
      [0, 0, 0], 
    ]
  }
}

 

function clearCanvas(context, width, height) {
  context.fillStyle = '#000'
  context.fillRect(0, 0, width, height)
  context.strokeStyle = '#888'; // Grid line color
  context.lineWidth = 0.05; // Grid line width

  for(let i=0; i<width; i++) {
    for(let j=0; j<height; j++) {
      context.strokeRect(i, j, 1, 1); // Draw the grid line
    }
  }
}

function draw() { 
  
  // Clear canvas before you draw anything new 
  clearCanvas(context, canvas.width/20, canvas.height/20);

  const shadowPos = { 
    x: player.pos.x, 
    y: player.pos.y
  };

  shadowPos.y = calculateShadow(shadowPos, arena)
  // Draw the shadow tetromino with a diff color 
  drawMatrix(player.matrix, shadowPos, "#888");

  // Draw active tetromino
  drawMatrix(player.matrix, player.pos)

  if (player.storedPiece) {
    clearCanvas(storeContext, tetrominoStoreCanvas.width/20, tetrominoStoreCanvas.height/20);
    // Do some collision detection 
    drawMatrixStoredPiece(player.storedPiece)
  }

  drawMatrix(arena, {x: 0, y: 0}); //Draw the saved pieces on board 
}

function calculateShadow(shadowPos, arena) {
    // Move showd downward until it collides 
    while (!collide(arena, {matrix: player.matrix, pos: shadowPos })) {
      shadowPos.y++; 
    }
    shadowPos.y--;
    return shadowPos.y; 
}

function drawMatrix(matrix, offset, color = null) {
  matrix.forEach((row, y ) => {
    row.forEach((value, x) => {
      if (value !== 0){
          context.fillStyle = color ? color: colors[value];
          context.fillRect(x + offset.x, y + offset.y, 1, 1);
          context.strokeStyle = 'black'; // Grid line color
          context.lineWidth = 0.05; // Grid line width
          context.strokeRect(x + offset.x, y + offset.y, 1, 1); // Draw the grid line
      }
    });
  });
}

function drawMatrixStoredPiece(matrix, color = null) {
  matrix.forEach((row, y ) => {
    row.forEach((value, x) => {
      if (value !== 0){
        storeContext.fillStyle = color ? color: colors[value];
        storeContext.fillRect(x+1, y+1, 1, 1);
        storeContext.strokeStyle = 'black'; // Grid line color
        storeContext.lineWidth = 0.05; // Grid line width
        storeContext.strokeRect(x+1, y+1, 1, 1); // Draw the grid line
      }
    });
  });
}




// Saves the current spot of the tetrimino into the gameboard 
function merge(arena, player) {
  player.matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        arena[y + player.pos.y][x + player.pos.x] = value;
      }
    })
  })
}




// Rotation mechanics 
function rotate(matrix, dir) {

  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < y; x++) {
      [ matrix[x][y], matrix[y][x]] = [ matrix[y][x], matrix[x][y]];
      

    }
  }
  // Reverse the order of columns for clockwise rotation
  if (dir > 0) {
    matrix.forEach(row => row.reverse());
  }
  // Reverse the order of rows for counter-clockwise rotation
  else {
    matrix.reverse();
  }
}


function playerReset() {
  const pieces = 'TJLOSZI'; 
  player.matrix = createPiece(pieces[pieces.length * Math.random() | 0]);
  player.pos.y = 0; 
  player.pos.x = (arena[0].length / 2 | 0) - (player.matrix[0].length / 2 | 0); 
  if (collide(arena, player)) { 
    arena.forEach(row => row.fill(0))
    player.score = 0; 
    player.storedPiece = null; 
    clearCanvas(storeContext, tetrominoStoreCanvas.width/20, tetrominoStoreCanvas.height/20);
    updateScore(); 
  }
}

function playerHardDrop() {
  const shadowPos = { 
    x: player.pos.x, 
    y: player.pos.y
  };
  player.pos.y = calculateShadow(shadowPos, arena);
  // Below is same as player.drop() without the reset of drop counter so no delay 
  // after hitting 'spacebar'
  player.pos.y++;

  if (collide(arena, player)) {
    player.pos.y--; // it will collide so we move it right back where it touches and not overlaps. 
    merge(arena, player); // save the tetrimino where it collided  
    playerReset();
    arenaSweep();
    updateScore(); 
  }

  dropCounter = 0; // we dont want another drop we want that delay  

}

// #####################################################
// Main Update function

let dropCounter = 0; 
let dropInterval = 1000; //every second we want to drop piece 

let lastTime = 0; 
function update(time = 0) {
  // requestAnimationFrame gives us a parameter 'time' - total time since page is loaded 
  const deltaTime = time - lastTime;
  lastTime = time;
  
  // For delay in holding button down
  if (player.direction !== 0) {
    player.holdingTime += deltaTime;
    if (player.holdingTime >= player.fastMoveInterval) {
      player.move(player.direction);
      player.holdingTime -= player.fastMoveInterval;
    }
  }

  dropCounter += deltaTime; 
  if (dropCounter > dropInterval) {
    player.drop(); 
  }

  draw(); 
  requestAnimationFrame(update); // requestAnimationFrame has to have a callback of the same funciton its called in! which is 'update'
}


// ######################### Handle Score ##################

function updateScore() {
  document.getElementById('score').innerHTML = player.score
}

// #########################################################
const arena = createMatrix(12, 20);

const player = new Player; 

const colors = [ null,
  '#FF0D72',
  '#0DC2FF',
  '#0DFF72',
  '#F538FF',
  '#FF8E0D',
  '#FFE138',
  '#3877FF',
];



// ################### KeyBoard Controls ###################
document.addEventListener('keydown', event => {
  
  switch (event.key) {
    case 'ArrowLeft':
      player.move(-1);
      player.direction = -1;
      player.holdingTime = 0;
      break;
    case 'ArrowRight':
      player.move(1);
      player.direction = 1;
      player.holdingTime = 0;
      break;
    case 'ArrowDown':
      player.drop();
      break;
    case 'ArrowUp':
      player.rotate(1);
      break;
    case ' ':
      playerHardDrop();
      break;
    case 'c':
      if (player.storedPiece) {
        temp = player.matrix;
        player.matrix = player.storedPiece;
        player.storedPiece = temp;
        // Check if the newly swapped piece is in a valid position
        if (collide(arena, player)) {
          // If not, swap back
          temp = player.matrix;
          player.matrix = player.storedPiece;
          player.storedPiece = temp;
        }
        clearCanvas(storeContext , tetrominoStoreCanvas.width/20, tetrominoStoreCanvas.height/20);
      } else {
        player.storedPiece = player.matrix;
        const pieces = 'TJLOSZI';
        player.matrix = createPiece(pieces[pieces.length * Math.random() | 0]);
      }
      break;
  }
    
})

document.addEventListener('keyup', event => {
  switch (event.key) {
    case 'ArrowLeft':
    case 'ArrowRight':
      player.direction = 0;
      break;
  }
})


// Start game 
playerReset(); 
updateScore(); 
update();


// TODO 
// #2 Fix the spin thing when a piece is blocked 
// #3 add the number of lines tracked 
// #4 add the preview of the next pieces 