import { Application, Container, Sprite, Text, AnimatedSprite, Assets } from 'pixi.js';
import gsap from 'gsap';
import { Wheel } from './Wheel';
import { UI } from './UI';

export class BonusScreen extends Container {
    private wheel: Wheel;
    private ui: UI;
    private app: Application;
    private isSpinning = false;
    private statusText: Text = new Text();
    private winContainer: Container; // Holds effects like coins/sunburst

    constructor(app: Application, ui: UI) {
        super();
        this.app = app;
        this.ui = ui;
        
        // 1. Background Layer
        this.setupBackground();

        // 2. Wheel Layer
        this.wheel = new Wheel();
        this.wheel.x = this.app.screen.width / 2;
        this.wheel.y = this.app.screen.height / 2 + 50; 
        this.addChild(this.wheel);

        // 3. Pointer Layer [cite: 17]
        this.setupPointer();

        // 4. Effects Layer
        this.winContainer = new Container();
        this.winContainer.x = this.app.screen.width / 2;
        this.winContainer.y = this.app.screen.height / 2;
        this.addChild(this.winContainer);

        // 5. Text & Input Layer
        this.setupUI();
    }

    private setupBackground() {
        const bg = Sprite.from('./images/background.png');
        bg.anchor.set(0.5);
        bg.x = this.app.screen.width / 2;
        bg.y = this.app.screen.height / 2;
        
        // Scale background to cover screen
        const scale = Math.max(this.app.screen.width / bg.width, this.app.screen.height / bg.height);
        bg.scale.set(scale);
        
        this.addChild(bg);
    }

    private setupPointer() {
        const pointer = Sprite.from('./images/pointer.png');
        pointer.anchor.set(0.5, 0); // Top center anchor
        pointer.x = this.app.screen.width / 2;
        // Position just above the wheel
        pointer.y = (this.app.screen.height / 2 + 50) - 280; 
        this.addChild(pointer);
    }

    private setupUI() {
        // "PRESS TO SPIN" Text [cite: 24]
        this.statusText = new Text({ 
            text: 'PRESS TO SPIN', 
            style: { 
                fill: 0xFFFFFF, 
                fontSize: 48, 
                fontWeight: 'bold',
                stroke: { width: 4 },
                dropShadow: { alpha: 0.5, blur: 4, distance: 4 }
            } 
        });
        this.statusText.anchor.set(0.5);
        this.statusText.x = this.app.screen.width / 2;
        this.statusText.y = this.app.screen.height - 80;
        this.addChild(this.statusText);

        // Enable Interaction
        this.eventMode = 'static';
        this.cursor = 'pointer';
        this.on('pointerdown', this.handleSpin, this);
    }

    private async handleSpin() {
        if (this.isSpinning) return;
        this.isSpinning = true;
        this.statusText.text = "Spinning...";
        this.winContainer.removeChildren(); // Clean old wins

        try {
            // CALL BACKEND [cite: 28, 38]
            const response = await fetch('http://localhost:3000/spin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({}) // Add { debugForceIndex: 0 } here to test specific wins
            });

            if (!response.ok) throw new Error("Server Error");

            const data = await response.json();
            this.spinTo(data.stopIndex, data.creditsWon);

        } catch (e) {
            console.error(e);
            this.statusText.text = "Error - Try Again";
            this.isSpinning = false;
        }
    }

    private spinTo(stopIndex: number, creditsWon: number) {
        const sliceAngle = (Math.PI * 2) / 8;
        const totalRotations = Math.PI * 2 * 5; // Spin 5 times
        
        // Math to calculate stop angle so the correct index hits the TOP pointer
        // If index 0 is at 0 rotation, we need to subtract its angle from the total
        const targetRotation = this.wheel.rotation + totalRotations + (Math.PI * 2 - (stopIndex * sliceAngle));

        gsap.to(this.wheel, {
            rotation: targetRotation,
            duration: 4,
            ease: "back.out(0.3)", // [cite: 37] Added ease for polish
            onComplete: () => {
                this.celebrateWin(creditsWon); // 
            }
        });
    }

    private celebrateWin(amount: number) {
        this.statusText.text = `YOU WON ${amount} CREDITS!`; // [cite: 31]
        this.ui.updateBalance(amount); // [cite: 32]

        // 1. Sunburst Effect
        const sunburst = Sprite.from('./images/sunburst.png');
        sunburst.anchor.set(0.5);
        sunburst.scale.set(0);
        this.winContainer.addChild(sunburst);

        gsap.to(sunburst.scale, { x: 4, y: 4, duration: 1, ease: 'elastic.out' });
        gsap.to(sunburst, { rotation: Math.PI * 2, duration: 6, repeat: -1, ease: 'linear' });

        // 2. Coin Particle Explosion [cite: 37]
        const sheet = Assets.get('coin-anim.json');
        
        for(let i=0; i<30; i++) {
            const coin = new AnimatedSprite(sheet.animations['coin-anim']);
            coin.anchor.set(0.5);
            coin.animationSpeed = 0.3 + Math.random() * 0.2;
            coin.play();
            this.winContainer.addChild(coin);

            // Explode outwards
            const angle = Math.random() * Math.PI * 2;
            const dist = 100 + Math.random() * 400;
            
            gsap.to(coin, {
                x: Math.cos(angle) * dist,
                y: Math.sin(angle) * dist,
                duration: 2,
                ease: 'power2.out',
                alpha: 0, // Fade out
            });
        }

        // Reset game state after delay
        setTimeout(() => {
            this.isSpinning = false;
            this.statusText.text = "PRESS TO SPIN";
            this.winContainer.removeChildren(); // Clear effects
        }, 4000);
    }
}