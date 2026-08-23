/**
 * Wedding Invitation - Falling Petals Canvas Effect
 * Hiệu ứng cánh hoa hồng / hoa đào và hạt ánh kim rơi 60FPS tối ưu cho di động
 */

const PetalsEffect = (() => {
  let canvas = null;
  let ctx = null;
  let width = 0;
  let height = 0;
  let particles = [];
  const maxParticles = 24; // Số lượng cánh hoa vừa phải để mượt mà nhất trên mobile
  let animationFrameId = null;

  class Petal {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : -20;
      this.size = Math.random() * 12 + 10;
      this.speedY = Math.random() * 1.2 + 0.8;
      this.speedX = Math.random() * 1 - 0.5;
      this.rotation = Math.random() * 360;
      this.rotationSpeed = (Math.random() * 1.5 - 0.75) * 1.2;
      this.flip = Math.random();
      this.flipSpeed = Math.random() * 0.03 + 0.01;
      this.opacity = Math.random() * 0.4 + 0.45;
      
      // Phân bổ loại hạt: 80% cánh hoa hồng/đào pastel, 20% hạt bụi vàng lấp lánh
      this.isSparkle = Math.random() < 0.2;
      this.color = this.isSparkle 
        ? `rgba(201, 162, 39, ${this.opacity})` 
        : `rgba(242, 185, 196, ${this.opacity})`;
    }

    update() {
      this.y += this.speedY;
      this.x += this.speedX + Math.sin(this.y * 0.01) * 0.6;
      this.rotation += this.rotationSpeed;
      this.flip += this.flipSpeed;

      if (this.y > height + 20 || this.x < -30 || this.x > width + 30) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.scale(1, Math.sin(this.flip));

      ctx.fillStyle = this.color;
      ctx.beginPath();

      if (this.isSparkle) {
        // Vẽ hạt bụi vàng kim cương nhỏ
        ctx.arc(0, 0, this.size * 0.25, 0, Math.PI * 2);
      } else {
        // Vẽ cánh hoa trái tim cong tự nhiên
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-this.size / 2, -this.size / 2, -this.size, this.size / 3, 0, this.size);
        ctx.bezierCurveTo(this.size, this.size / 3, this.size / 2, -this.size / 2, 0, 0);
      }

      ctx.fill();
      ctx.restore();
    }
  }

  const resize = () => {
    width = window.innerWidth;
    height = window.innerHeight;
    if (canvas) {
      canvas.width = width;
      canvas.height = height;
    }
  };

  const loop = () => {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }

    animationFrameId = requestAnimationFrame(loop);
  };

  const init = () => {
    canvas = document.getElementById('petals-canvas');
    if (!canvas) return;

    ctx = canvas.getContext('2d');
    resize();

    window.addEventListener('resize', resize);

    particles = [];
    for (let i = 0; i < maxParticles; i++) {
      particles.push(new Petal());
    }

    loop();
  };

  return {
    init
  };
})();

window.PetalsEffect = PetalsEffect;
