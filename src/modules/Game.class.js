// 'use strict';

class Game {
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
      this.handleMove(resultState);
    }
  }

  moveRight() {
    if (this.status === 'playing') {
      const resultState = this.state.map((arr) => this.merge(arr, 1));
      this.handleMove(resultState);
    }
  }

  moveUp() {
    if (this.status === 'playing') {
      const rotatedState = this.rotateMatrix(this.state, 1);
      const resultState = rotatedState.map((row) => this.merge(row, 1));
      const finalState = this.rotateMatrix(resultState, 0);
      this.handleMove(finalState);
    }
  }

  moveDown() {
    if (this.status === 'playing') {
      const rotatedState = this.rotateMatrix(this.state, 1);
      const resultState = rotatedState.map((row) => this.merge(row, 0));
      const finalState = this.rotateMatrix(resultState, 0);
      this.handleMove(finalState);
    }
  }

  handleMove(newState) {
    if (this.isStateDifferent(newState)) {
      this.state = newState;
      this.firstMoveMade = true;
      this.putNewNumber();

      if (this.isGameOver()) {
        this.status = 'lose';
      } else if (this.isGameWon()) {
        this.status = 'win';
      }
    }
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.state;
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.restart();
    this.status = 'playing';
    this.putNewNumber();
    this.putNewNumber();
  }

  restart() {
    this.state = this.cloneState(this.initialState);
    this.score = 0;
    this.status = 'idle';
    this.firstMoveMade = false;
  }

  cloneState(state) {
    return state.map(row => [...row]);
  }

  isStateDifferent(newState) {
    return JSON.stringify(this.state) !== JSON.stringify(newState);
  }

  getFirstMoveMade() {
    return this.firstMoveMade;
  }

  getAvailableCell() {
    const cells = [];
    this.state.forEach((row, y) => {
      row.forEach((value, x) => {
        if (!value) {
          cells.push({ x, y });
        }
      });
    });
    return cells;
  }

  generateNumber() {
    return Math.random() < 0.9 ? 2 : 4;
  }

  putNewNumber() {
    const availableCells = this.getAvailableCell();
    if (availableCells.length > 0) {
      const { x, y } = availableCells[Math.floor(Math.random() * availableCells.length)];
      this.state[y][x] = this.generateNumber();
    }
  }

  isGameOver() {
    if (this.getAvailableCell().length === 0) {
      const directions = [
        () => this.testMove(this.moveLeft.bind(this)),
        () => this.testMove(this.moveRight.bind(this)),
        () => this.testMove(this.moveUp.bind(this)),
        () => this.testMove(this.moveDown.bind(this))
      ];
      return directions.every(test => !test());
    }
    return false;
  }

  testMove(moveFunction) {
    const originalState = this.cloneState(this.state);
    moveFunction();
    const moved = this.isStateDifferent(originalState);
    this.state = originalState;
    return moved;
  }

  isGameWon() {
    return this.state.some(row => row.some(cell => cell === 2048));
  }

  rotateMatrix(matrix, clockwise) {
    const N = matrix.length;
    const result = Array.from({ length: N }, () => Array(N).fill(0));

    if (clockwise) {
      for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
          result[j][N - 1 - i] = matrix[i][j];
        }
      }
    } else {
      for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
          result[N - 1 - j][i] = matrix[i][j];
        }
      }
    }
    return result;
  }

  merge(arr, direction) {
    const input = direction ? [...arr].reverse() : [...arr];
    const merged = [];
    let score = 0;

    const filtered = input.filter(x => x !== 0);

    for (let i = 0; i < filtered.length; i++) {
      if (filtered[i] === filtered[i + 1]) {
        merged.push(filtered[i] * 2);
        score += filtered[i] * 2;
        i++;
      } else {
        merged.push(filtered[i]);
      }
    }

    while (merged.length < arr.length) {
      merged.push(0);
    }

    this.score += score;
    return direction ? merged.reverse() : merged;
  }
}

module.exports = Game;
