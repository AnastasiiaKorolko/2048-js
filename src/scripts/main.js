'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

function updateTable(state, hasStateChanged = false) {
  const fieldRows = document.querySelectorAll('.field-row');

  fieldRows.forEach((rowElement, rowIndex) => {
    const rowState = state[rowIndex];

    rowState.forEach((cellState, columnIndex) => {
      const cellElement = rowElement.children[columnIndex];
      const previousClass = cellElement.className;
      const newClass = `field-cell field-cell--${cellState}`;

      cellElement.className = newClass;
      cellElement.innerText = cellState > 0 ? cellState : '';

      if (hasStateChanged && previousClass !== newClass && cellState > 0) {
        cellElement.classList.add('merge');
        setTimeout(() => cellElement.classList.remove('merge'), 600);
      }
    });
  });
}

function updateScore(score) {
  document.querySelector('.game-score').innerText = score;
}

function updateButton(firstMoveMade) {
  const button = document.querySelector('.button');

  if (firstMoveMade) {
    button.className = 'button restart';
    button.innerText = 'Restart';
  } else {
    button.className = 'button start';
    button.innerText = 'Start';
  }
}

function updateMessage(gameStatus) {
  const messageClasses = {
    idle: 'message-start',
    win: 'message-win',
    lose: 'message-lose',
  };

  document.querySelectorAll('.message').forEach((message) => {
    message.classList.add('hidden');
  });

  const messageClass = messageClasses[gameStatus];

  if (messageClass) {
    document.querySelector(`.${messageClass}`).classList.remove('hidden');
  }
}

function update(hasStateChanged = false) {
  updateTable(game.getState(), hasStateChanged);
  updateScore(game.getScore());
  updateButton(game.getFirstMoveMade());
  updateMessage(game.getStatus());
}

const button = document.querySelector('.button');

button.addEventListener('click', () => {
  const wasStarted = game.getStatus() !== 'idle';

  if (wasStarted) {
    game.restart();
  } else {
    game.start();
  }

  update(true);
});

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  const previousState = JSON.stringify(game.getState());

  const actions = {
    ArrowUp: () => game.moveUp(),
    ArrowRight: () => game.moveRight(),
    ArrowDown: () => game.moveDown(),
    ArrowLeft: () => game.moveLeft(),
  };

  const action = actions[e.key];

  if (action) {
    e.preventDefault();
    action();

    const hasStateChanged = previousState !== JSON.stringify(game.getState());
    update(hasStateChanged);
  }
});
