'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
class Game {
  /**
   * Creates a new game instance.
   *
   * @param {number[][]} initialState
   * The initial state of the board.
   * @default
   * [[0, 0, 0, 0],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0]]
   *
   * If passed, the board will be initialized with the provided
   * initial state.
   */
  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    if (
      initialState.length === 4 &&
      initialState.every((row) => row.length === 4)
    ) {
      this.initialState = initialState;
      this.restart();
    } else {
      throw new Error('Initial state is not valid!');
    }
  }

  moveLeft() {
    if (this.status === 'playing') {
      const resultState = this.state.map((arr) => this.merge(arr, 0));

      if (this.isStateDifferent(resultState)) {
        this.updateGame({
          state: resultState,
          score: this.score,
          mergedCells: [],
        });
      }
    }
  }

  moveRight() {
    if (this.status === 'playing') {
      const resultState = this.state.map((arr) => this.merge(arr, 1));

      if (this.isStateDifferent(resultState)) {
        this.updateGame({
          state: resultState,
          score: this.score,
          mergedCells: [],
        });
      }
    }
  }

  moveUp() {
    if (this.status === 'playing') {
      const rotatedState = this.rotateMatrix(this.state, 1);
      const resultState = rotatedState.map((row) => this.merge(row, 1));
      const finalState = this.rotateMatrix(resultState, 0);

      if (this.isStateDifferent(finalState)) {
        this.updateGame({
          state: finalState,
          score: this.score,
          mergedCells: [],
        });
      }
    }
  }

  moveDown() {
    if (this.status === 'playing') {
      const rotatedState = this.rotateMatrix(this.state, 1);
      const resultState = rotatedState.map((row) => this.merge(row, 0));
      const finalState = this.rotateMatrix(resultState, 0);

      if (this.isStateDifferent(finalState)) {
        this.updateGame({
          state: finalState,
          score: this.score,
          mergedCells: [],
        });
      }
    }
  }

  /**
   * @returns {number}
   */
  getScore() {
    return this.score;
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    return this.state;
  }

  /**
   * Returns the current game status.
   *
   * @returns {string} One of: 'idle', 'playing', 'win', 'lose'
   *
   * `idle` - the game has not started yet (the initial state);
   * `playing` - the game is in progress;
   * `win` - the game is won;
   * `lose` - the game is lost
   */
  getStatus() {
    return this.status;
  }

  /**
   * Starts the game.
   */
  start() {
    this.restart();
    this.status = 'playing';

    this.putNewNumber();
    this.putNewNumber();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.state = this.cloneState(this.initialState);
    this.score = 0;
    this.status = 'idle';
    this.firstMoveMade = false;
  }

  // Add your own methods here
  cloneState(state) {
    const newState = [];

    for (let row = 0; row < state.length; row++) {
      newState.push([...state[row]]);
    }

    return newState;
  }

  isStateDifferent(newState) {
    for (let row = 0; row < this.state.length; row++) {
      for (let column = 0; column < this.state[row].length; column++) {
        if (this.state[row][column] !== newState[row][column]) {
          return true;
        }
      }
    }

    return false;
  }

  updateGame(result) {
    this.state = result.state;
    this.firstMoveMade = true;
    this.putNewNumber();

    result.mergedCells.forEach(({ row, column }) => {
      const cellElement = document.querySelector(
        `.field-cell--${this.state[row][column]}[data-row='${row}'][data-column='${column}']`,
      );

      if (cellElement) {
        cellElement.classList.add('merge');

        setTimeout(() => {
          cellElement.classList.remove('merge');
        }, 600);
      }
    });

    if (this.isGameOver()) {
      this.status = 'lose';
    } else if (this.isGameWon()) {
      this.status = 'win';
    }


  }

  getFirstMoveMade() {
    return this.firstMoveMade;
  }

  getAvailableCell() {
    const cell = [];

    this.state.forEach((row, y) => {
      row.forEach((number, x) => {
        if (!number) {
          cell.push({ x, y });
        }
      });
    });

    return cell;
  }

  getRandomElement(arr) {
    const randomIndex = Math.floor(Math.random() * arr.length);

    return arr[randomIndex];
  }

  generateNumber() {
    return Math.floor(Math.random() * 10) === 0 ? 4 : 2;
  }

  putNewNumber() {
    const availableCell = this.getAvailableCell();
    const randomCell = this.getRandomElement(availableCell);

    this.state[randomCell.y][randomCell.x] = this.generateNumber();
  }

  isGameOver() {
    if (this.getAvailableCell().length === 0) {
      const directions = [
        { horizontal: false, forward: false },
        { horizontal: true, forward: true },
        { horizontal: false, forward: true },
        { horizontal: true, forward: false },
      ];

      return directions.every(({ horizontal, forward }) => {
        const newState = this.moveTiles(horizontal, forward).state;

        return !this.isStateDifferent(newState);
      });
    }

    return false;
  }

  isGameWon() {
    return this.state.flat().includes(2048);
  }

  rotateMatrix(arr, clockwise) {
    if (clockwise) {
      return arr.map((_, colIndex) => {
        return arr.map((row) => row[colIndex]).reverse();
      });
    } else {
      return arr.map((_, colIndex) => {
        return arr.map((row) => row[row.length - 1 - colIndex]);
      });
    }
  }

  merge(arr, direction) {
    const input = direction ? arr.reverse() : arr;
    const result = input
      .filter((item) => item)
      .reduce((acc, item, idx) => {
        if (acc[idx - 1] === item) {
          acc[acc.length - 1] += item;
          this.score += acc[acc.length - 1];
        } else {
          acc.push(item);
        }

        return acc;
      }, []);

    const resLength = result.length;

    result.length = arr.length;
    result.fill(0, resLength, result.length);

    return direction ? result.reverse() : result;
  }
}

module.exports = Game;
