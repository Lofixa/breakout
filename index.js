        // Elements HTML
        const container = document.querySelector('#container');
        const paddle = document.querySelector('#paddle');
        const ball = document.querySelector('#ball');
        const bricks = [];

        let animationFrame;

        // Paddle config
        let moveLeft = false;
        let moveRight = false;
        const step = 20;

        // Ball config
        let ballRadius = 10;
        let ballDx = 7;
        let ballDy = -7;

        // Brick config
        let brickWidth = 100;
        let brickHeight = 22;
        let brickMargin = 10;

        let numberBrickPerLine = 6;
        let numberBrickPerColumn = 6;

        let brickOffsetLeft = 140;
        let brickOffsetTop = 100;
        let isPaused = false;

        /**
         * Keyboard event
         */
        function initKeyboardListener() {
            document.addEventListener('keydown', onKeyDown, false);
            document.addEventListener('keyup', onKeyUp, false);
        }
        initKeyboardListener();
        /**
         * On key down keyboard
         */
        function onKeyDown(event) {
            if (event.key === 'ArrowRight') {
                moveRight = true;
            }
            else if (event.key === 'ArrowLeft') {
                moveLeft = true;
            }
        }

        document.addEventListener('keydown', event => {
            const backgroundImg = new Image();
backgroundImg.src = 'index.png';

             if (event.key === 'p') {
                if (!isPaused) {
                  cancelAnimationFrame(animationFrame);
                  isPaused = true;
                  console.log('Game paused');
                  container.style.backgroundImage = `url(${backgroundImg.src})`;
                container.style.backgroundSize = 'cover';
                container.style.backgroundRepeat = 'no-repeat';

                } else {
                  animationFrame = requestAnimationFrame(gameLoop);
                  isPaused = false;
                  console.log('Game resumed');
                  container.style.backgroundImage = "none";
              }
            }
          });

          function gameLoop() {
            if (!isPaused) {
              movePaddle();
              moveBall();
              checkCollisionPaddle();
              checkCollisionBricks();
              animationFrame = requestAnimationFrame(gameLoop);
            }
          }          

        /**
         * On key up keyboard
         */
        function onKeyUp(event) {
            if (event.key === 'ArrowRight') {
                moveRight = false;
            }
            else if (event.key === 'ArrowLeft') {
                moveLeft = false;
            }
        }

        /**
         * Move Paddle
         */
        function movePaddle() {


            let currentPositionLeft = paddle.offsetLeft;

            if (moveRight) {
                currentPositionLeft += step;
            }
            else if(moveLeft) {
                currentPositionLeft -= step;
            }

            // Limit Left
            if(currentPositionLeft < 0) {
                currentPositionLeft = 0;
            }

            // Limit Right
            if(currentPositionLeft + paddle.offsetWidth > container.offsetWidth) {
                currentPositionLeft = container.offsetWidth - paddle.offsetWidth;
            }

            paddle.style.left = currentPositionLeft + 'px';
        }

        /**
         * Ball move
         */
        function moveBall() {
            let currentPositionLeft = ball.offsetLeft;
            let currentPositionTop = ball.offsetTop;

            // Limit left
            if (currentPositionLeft < 0) {
                ballDx = -ballDx;
            }

            // Limit Right
            if (currentPositionLeft + ballRadius * 2 > container.offsetWidth) {
                ballDx = -ballDx;
            }

            // Limit Top
            if (currentPositionTop < 0) {
                ballDy = -ballDy;
            }

            // Limit Bottom
            if (currentPositionTop + ballRadius * 2 > container.offsetHeight) {
                // ballDy = -ballDy;
                alert('GameOver');
                cancelAnimationFrame(animationFrame);
                location.reload();

            }

            currentPositionLeft += ballDx;
            currentPositionTop += ballDy;


            ball.style.left = currentPositionLeft + 'px';
            ball.style.top = currentPositionTop + 'px';
        }

        /**
         * Check collision between paddle and ball
         */
        function checkCollisionPaddle() {
            let ballX = ball.offsetLeft + ballRadius;
            let ballBottomY = ball.offsetTop + ballRadius * 2;

            let paddleLeft = paddle.offsetLeft;
            let paddleTop = paddle.offsetTop;
            let paddleRight = paddleLeft + paddle.offsetWidth;
            let paddleBottom = paddleTop + paddle.offsetHeight;

            // Collision
            if (ballX > paddleLeft && ballX < paddleRight &&
                ballBottomY > paddleTop && ballBottomY < paddleBottom
            ) {
                ballDy = -ballDy;

                if (ballX < paddleLeft + paddle.offsetWidth / 2) {
                    ballDx = -Math.abs(ballDx);
                }

                if (ballX > paddleLeft + paddle.offsetWidth / 2) {
                    ballDx = Math.abs(ballDx);
                }

            }
        }

        /**
         * Check collision between bricks and ball
         */
        function checkCollisionBricks() {
            let ballX = ball.offsetLeft + ballRadius;
            let ballY = ball.offsetTop + ballRadius;

            
            for(let i = bricks.length - 1; i >= 0; i--) {
                let b = bricks[i];

                let brickLeft = b.offsetLeft;
                let brickTop = b.offsetTop;
                let brickRight = brickLeft + b.offsetWidth;
                let brickBottom = brickTop + b.offsetHeight;

                // Collision
                if (ballX > brickLeft &&
                    ballX < brickRight &&
                    ballY + ballRadius > brickTop &&
                    ballY - ballRadius < brickBottom
                ) {
                    ballDy = -ballDy;

                    container.removeChild(b);

                    bricks.splice(i, 1);
                }
            }
        }

        /**
         * Create all bricks
         */
        function createBrick() {
            let positionX = brickOffsetLeft;
            let positionY = brickOffsetTop;

            for (let i = 0; i < numberBrickPerColumn; i++) {
                for(let j = 0; j < numberBrickPerLine; j++) {
                    let brick = document.createElement('div');
                    brick.className = 'brick';

                    brick.style.width = brickWidth + 'px';
                    brick.style.height = brickHeight + 'px';
                    brick.style.left = positionX + 'px';
                    brick.style.top = positionY + 'px';

                    container.appendChild(brick);

                    positionX += brickWidth + brickMargin;

                    bricks.push(brick);
                }

                positionX = brickOffsetLeft;
                positionY += brickHeight + brickMargin;
            }
        }

        /**
         * 60 FPS rendering
         */
        function loop(){
            animationFrame = window.requestAnimationFrame(function() {
                movePaddle();
                moveBall();
                checkCollisionPaddle();
                checkCollisionBricks();

                loop();
            })
        }

        /**
         * Init game
         */
        function init() {
            //Init
            initKeyboardListener();
            createBrick();

            loop();
        }

        init();