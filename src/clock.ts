export class Clock {
  #startTime = 0;
  #isStarted = false;
  #isPaused = false;
  #pauseTime = 0;

  #now() {
    return performance.now() / 1000;
  }

  isStarted(): boolean {
    return this.#isStarted;
  }

  start() {
    if (this.isRunning()) return;
    const now = this.#now();
    this.#startTime = this.#isPaused
      ? this.#startTime + now - this.#pauseTime
      : now;
    this.#pauseTime = this.#startTime;
    this.#isStarted = true;
    this.#isPaused = false;
  }

  pause() {
    if (!this.isRunning()) return;
    this.#isPaused = true;
    this.#pauseTime = this.#now();
  }

  stop() {
    this.#startTime = 0;
    this.#isStarted = false;
    this.#isPaused = false;
    this.#pauseTime = 0;
  }

  getElapsedTime() {
    if (!this.isStarted()) return 0;
    if (this.#isPaused) return this.#pauseTime - this.#startTime;
    return this.#now() - this.#startTime;
  }

  isRunning() {
    return this.isStarted() && !this.#isPaused;
  }
}
