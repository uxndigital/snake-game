interface Point {
  x: number;
  y: number;
}

interface Direction {
  x: number;
  y: number;
}

class SnakeGame {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private gridSize: number = 20;
  private tileCount: number = 20;
  private snake: Point[] = [];
  private food: Point = { x: 0, y: 0 };
  private direction: Direction = { x: 0, y: 0 };
  private nextDirection: Direction = { x: 0, y: 0 };
  private score: number = 0;
  private highScore: number = 0;
  private gameLoop: number | null = null;
  private isGameOver: boolean = false;
  private speed: number = 150;

  constructor() {
    this.canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d')!;
    this.highScore = parseInt(localStorage.getItem('snakeHighScore') || '0');
    this.updateHighScoreDisplay();
    
    this.initGame();
    this.bindEvents();
  }

  private initGame(): void {
    this.snake = [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 }
    ];
    this.direction = { x: 1, y: 0 };
    this.nextDirection = { x: 1, y: 0 };
    this.score = 0;
    this.isGameOver = false;
    this.speed = 150;
    this.placeFood();
    this.updateScoreDisplay();
    this.hideGameOver();
  }

  private bindEvents(): void {
    document.addEventListener('keydown', (e) => this.handleKeyPress(e));
  }

  private handleKeyPress(e: KeyboardEvent): void {
    const keyMap: { [key: string]: Direction } = {
      'ArrowUp': { x: 0, y: -1 },
      'ArrowDown': { x: 0, y: 1 },
      'ArrowLeft': { x: -1, y: 0 },
      'ArrowRight': { x: 1, y: 0 },
      'w': { x: 0, y: -1 },
      'W': { x: 0, y: -1 },
      's': { x: 0, y: 1 },
      'S': { x: 0, y: 1 },
      'a': { x: -1, y: 0 },
      'A': { x: -1, y: 0 },
      'd': { x: 1, y: 0 },
      'D': { x: 1, y: 0 }
    };

    const newDir = keyMap[e.key];
    if (newDir) {
      // Prevent reversing direction
      if ((newDir.x !== 0 && this.direction.x === 0) || 
          (newDir.y !== 0 && this.direction.y === 0)) {
        this.nextDirection = newDir;
      }
      e.preventDefault();
    }
  }

  private placeFood(): void {
    let validPosition = false;
    while (!validPosition) {
      this.food = {
        x: Math.floor(Math.random() * this.tileCount),
        y: Math.floor(Math.random() * this.tileCount)
      };
      validPosition = !this.snake.some(segment => 
        segment.x === this.food.x && segment.y === this.food.y
      );
    }
  }

  private update(): void {
    this.direction = { ...this.nextDirection };
    
    const head = { 
      x: this.snake[0].x + this.direction.x, 
      y: this.snake[0].y + this.direction.y 
    };

    // Check wall collision
    if (head.x < 0 || head.x >= this.tileCount || 
        head.y < 0 || head.y >= this.tileCount) {
      this.gameOver();
      return;
    }

    // Check self collision
    if (this.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
      this.gameOver();
      return;
    }

    this.snake.unshift(head);

    // Check food collision
    if (head.x === this.food.x && head.y === this.food.y) {
      this.score += 10;
      this.updateScoreDisplay();
      this.placeFood();
      
      // Increase speed slightly
      if (this.speed > 50) {
        this.speed -= 2;
      }
    } else {
      this.snake.pop();
    }
  }

  private draw(): void {
    // Clear canvas
    this.ctx.fillStyle = '#0a0a15';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw grid
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    for (let i = 0; i <= this.tileCount; i++) {
      this.ctx.beginPath();
      this.ctx.moveTo(i * this.gridSize, 0);
      this.ctx.lineTo(i * this.gridSize, this.canvas.height);
      this.ctx.stroke();
      this.ctx.beginPath();
      this.ctx.moveTo(0, i * this.gridSize);
      this.ctx.lineTo(this.canvas.width, i * this.gridSize);
      this.ctx.stroke();
    }

    // Draw food
    const foodGradient = this.ctx.createRadialGradient(
      this.food.x * this.gridSize + this.gridSize / 2,
      this.food.y * this.gridSize + this.gridSize / 2,
      0,
      this.food.x * this.gridSize + this.gridSize / 2,
      this.food.y * this.gridSize + this.gridSize / 2,
      this.gridSize / 2
    );
    foodGradient.addColorStop(0, '#ff6b6b');
    foodGradient.addColorStop(1, '#ee5a5a');
    this.ctx.fillStyle = foodGradient;
    this.ctx.beginPath();
    this.ctx.arc(
      this.food.x * this.gridSize + this.gridSize / 2,
      this.food.y * this.gridSize + this.gridSize / 2,
      this.gridSize / 2 - 2,
      0,
      Math.PI * 2
    );
    this.ctx.fill();

    // Draw snake
    this.snake.forEach((segment, index) => {
      const isHead = index === 0;
      const gradient = this.ctx.createLinearGradient(
        segment.x * this.gridSize,
        segment.y * this.gridSize,
        (segment.x + 1) * this.gridSize,
        (segment.y + 1) * this.gridSize
      );
      
      if (isHead) {
        gradient.addColorStop(0, '#00ff88');
        gradient.addColorStop(1, '#00d4ff');
      } else {
        gradient.addColorStop(0, '#00cc6a');
        gradient.addColorStop(1, '#00a8cc');
      }
      
      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.ctx.roundRect(
        segment.x * this.gridSize + 1,
        segment.y * this.gridSize + 1,
        this.gridSize - 2,
        this.gridSize - 2,
        4
      );
      this.ctx.fill();
    });
  }

  private updateScoreDisplay(): void {
    document.getElementById('score')!.textContent = this.score.toString();
  }

  private updateHighScoreDisplay(): void {
    document.getElementById('highScore')!.textContent = this.highScore.toString();
  }

  private gameOver(): void {
    this.isGameOver = true;
    if (this.gameLoop) {
      clearInterval(this.gameLoop);
      this.gameLoop = null;
    }
    
    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem('snakeHighScore', this.highScore.toString());
      this.updateHighScoreDisplay();
    }
    
    document.getElementById('finalScore')!.textContent = this.score.toString();
    document.getElementById('gameOver')!.classList.add('show');
  }

  private hideGameOver(): void {
    document.getElementById('gameOver')!.classList.remove('show');
  }

  public start(): void {
    if (this.gameLoop) {
      clearInterval(this.gameLoop);
    }
    this.gameLoop = window.setInterval(() => {
      if (!this.isGameOver) {
        this.update();
        this.draw();
      }
    }, this.speed);
  }

  public reset(): void {
    if (this.gameLoop) {
      clearInterval(this.gameLoop);
      this.gameLoop = null;
    }
    this.initGame();
    this.start();
  }
}

// Global function for button
declare global {
  interface Window {
    resetGame: () => void;
  }
}

// Initialize game
const game = new SnakeGame();
game.start();

// Expose reset function
window.resetGame = () => game.reset();

export {};
