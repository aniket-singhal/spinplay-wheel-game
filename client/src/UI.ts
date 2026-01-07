import { Container, Text, TextStyle } from 'pixi.js';
import gsap from 'gsap';
import { Howl } from 'howler';

export class UI extends Container {
    private balanceText: Text;
    private rollupSound: Howl;
    // "actualBalance" is the real money logic
    private actualBalance: number = 1000;

    // "displayedBalance" is the number currently shown on screen (for animation)
    private displayedBalance: number = 1000;

    constructor() {
        super();
        this.rollupSound = new Howl({
            src: ['./sounds/credits-rollup.wav'],
            volume: 0.5
        });

        const style = new TextStyle({
            fontFamily: 'Arial',
            fontSize: 32,
            fontWeight: 'bold',
            fill: '#ffffff', // White text
            stroke: { color: '#000000', width: 4 }, // Black outline for visibility
        });

        this.balanceText = new Text({ text: `Credits: ${this.actualBalance}`, style });
        this.balanceText.position.set(20, 20); // Top-left corner
        this.addChild(this.balanceText);
    }

    public updateBalance(amount: number) {
        // Roll-up logic could be added here, keeping it simple for now [cite: 32]
        this.actualBalance += amount;
        gsap.to(this, {
            displayedBalance: this.actualBalance,
            duration: 2.0, // Length of the "rollup" sound effect typically
            ease: "power1.out", // Slows down slightly at the end
            onUpdate: () => {
                this.rollupSound.play();
                // Update text every frame. Math.floor removes decimals.
                this.balanceText.text = `Credits: ${Math.floor(this.displayedBalance)}`;
            }
        });
        this.balanceText.text = `Credits: ${this.actualBalance}`;
    }
}