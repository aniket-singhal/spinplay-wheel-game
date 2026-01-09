import { Container, Sprite, Text, AnimatedSprite, Assets } from 'pixi.js';
import gsap from 'gsap';
import { Wheel } from './Wheel';
import { UI } from './UI';
import { Howl } from 'howler';
import { DebugPanel } from './DebugPanel';

const DESIGN_WIDTH = 1280;
const DESIGN_HEIGHT = 720;

export class BonusScreen extends Container {
    private wheel: Wheel;
    private ui: UI;
    private isSpinning = false;
    private messageText!: Text; 
    private winContainer: Container;
    private debugPanel!: DebugPanel;
    private clickSound: Howl;
    private winSound: Howl;
    public onFinish: () => void;

    constructor(ui: UI, onFinish: () => void) {
        super();
        this.ui = ui;
        this.onFinish = onFinish;
        this.clickSound = new Howl({
            src: ['./sounds/wheel-click.wav'],
            volume: 0.5
        });

        this.winSound = new Howl({
            src: ['./sounds/wheel-landing.wav'],
            volume: 0.8
        });

        this.setupBackground();

        this.wheel = new Wheel();
        this.wheel.x = DESIGN_WIDTH / 2;
        this.wheel.y = DESIGN_HEIGHT / 2; 
        this.wheel.scale.set(0.7); 
        this.addChild(this.wheel);

        this.setupPointer();

        this.winContainer = new Container();
        this.winContainer.x = DESIGN_WIDTH / 2;
        this.winContainer.y = DESIGN_HEIGHT / 2;
        this.addChild(this.winContainer);

        this.setupDebugPanel();
        this.setupUI();
    }

    private setupDebugPanel() {
        this.debugPanel = new DebugPanel();
        this.debugPanel.x = DESIGN_WIDTH - 240;
        this.debugPanel.y = 80;
        this.addChild(this.debugPanel);
    }

    private setupBackground() {
        const bg = Sprite.from('./images/background.png');
        bg.anchor.set(0.5);
        bg.x = DESIGN_WIDTH / 2;
        bg.y = DESIGN_HEIGHT / 2;

        const scale = Math.max(DESIGN_WIDTH / bg.width, DESIGN_HEIGHT / bg.height);
        bg.scale.set(scale);
        this.addChild(bg);
    }

    private setupPointer() {
        const pointer = Sprite.from('./images/pointer.png');
        pointer.anchor.set(0.5, 0);
        pointer.x = DESIGN_WIDTH / 2;
        pointer.y = (DESIGN_HEIGHT / 2) - 200; 
        this.addChild(pointer);
    }

    private setupUI() {
        // Status Message at bottom
        this.messageText = new Text({
            text: 'PRESS TO SPIN',
            style: {
                fill: 0xFFFFFF,
                fontSize: 40,
                fontWeight: 'bold',
                stroke: { width: 4 },
                dropShadow: { alpha: 0.5, blur: 4, distance: 4 }
            }
        });
        this.messageText.anchor.set(0.5);
        this.messageText.x = DESIGN_WIDTH / 2;
        this.messageText.y = DESIGN_HEIGHT - 60; 
        this.addChild(this.messageText);
        this.wheel.on('spin', () => {
            this.handleSpin();
        });
    }

    private async handleSpin() {
        if (this.isSpinning) return;
        this.isSpinning = true;
        this.messageText.text = "Spinning...";
        this.wheel.centerText.visible = false;
        this.winContainer.removeChildren();
        const forceIndex = this.debugPanel.getForceIndex();

        const payload: any = {};
        if (forceIndex !== undefined) {
            console.log(`[Debug] Forcing Index: ${forceIndex}`);
            payload.debugForceIndex = forceIndex;
        }
        try {
            const apiUrl = process.env.API_URL || 'http://localhost:3000';
            const response = await fetch(`${apiUrl}/spin`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error("Server Error");

            const data = await response.json();
            console.log(`Target: Index ${data.stopIndex} | Credits: ${data.creditsWon}`);
            this.spinTo(data.stopIndex, data.creditsWon);

        } catch (e) {
            console.error(e);
            this.messageText.text = "Error - Try Again";
            this.wheel.centerText.visible = true;
            this.isSpinning = false;
        }
    }

    private spinTo(stopIndex: number, creditsWon: number) {
        const sliceAngle = (Math.PI * 2) / 8;

        let currentRotation = this.wheel.rotation % (Math.PI * 2);
        if (currentRotation < 0) currentRotation += Math.PI * 2; 

        const pointerAngle = 3 * Math.PI / 2;
        const targetSliceAngle = stopIndex * sliceAngle;
        let targetRotation = pointerAngle - targetSliceAngle;

        if (targetRotation < 0) targetRotation += Math.PI * 2;

        let distanceToRotate = targetRotation - currentRotation;

        if (distanceToRotate < 0) {
            distanceToRotate += Math.PI * 2;
        }

        const extraSpins = Math.PI * 2 * 5;

        const finalRotation = this.wheel.rotation + distanceToRotate + extraSpins;
        let lastStep = Math.floor(this.wheel.rotation / sliceAngle);

        gsap.to(this.wheel, {
            rotation: finalRotation,
            duration: 4,
            ease: "back.out(0.2)",
            onUpdate: () => {
                const currentStep = Math.floor(this.wheel.rotation / sliceAngle);

                if (currentStep !== lastStep) {
                    this.clickSound.play();
                    lastStep = currentStep;
                }
            },
            onComplete: () => {
                this.winSound.play();
                this.celebrateWin(creditsWon);
            }
        });
    }

    private celebrateWin(amount: number) {
        this.messageText.text = `YOU WON ${amount} CREDITS!`;
        this.ui.updateBalance(amount);

        const sunburst = Sprite.from('./images/sunburst.png');
        sunburst.anchor.set(0.5);
        sunburst.scale.set(0);
        this.winContainer.addChild(sunburst);

        gsap.to(sunburst.scale, { x: 6, y: 6, duration: 1, ease: 'elastic.out' });
        gsap.to(sunburst, { rotation: Math.PI * 2, duration: 6, repeat: -1, ease: 'linear' });

        const sheet = Assets.get('./images/coin-anim.json');

        for (let i = 0; i < 30; i++) {
            const coin = new AnimatedSprite(sheet.animations['coin-anim']);
            coin.anchor.set(0.5);
            coin.animationSpeed = 0.3 + Math.random() * 0.1;
            coin.play();
            this.winContainer.addChild(coin);

            const angle = Math.random() * Math.PI * 2;
            const dist = 100 + Math.random() * 400;

            gsap.to(coin, {
                x: Math.cos(angle) * dist,
                y: Math.sin(angle) * dist,
                duration: 6,
                ease: 'power2.out',
                alpha: 0,
            });
        }

        setTimeout(() => {
            this.isSpinning = false;
            this.wheel.centerText.visible = true;
            this.messageText.text = "PRESS TO SPIN";
            this.winContainer.removeChildren();
            this.onFinish();
        }, 4000);
    }
}