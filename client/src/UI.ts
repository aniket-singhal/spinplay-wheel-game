import { Container, Text, TextStyle } from 'pixi.js';
import gsap from 'gsap';
import { Howl } from 'howler';

export class UI extends Container {
    private balanceText: Text;
    private rollupSound: Howl;
    private actualBalance: number = 1000;

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
            fill: '#ffffff',
            stroke: { color: '#000000', width: 4 },
        });

        this.balanceText = new Text({ text: `Credits: ${this.actualBalance}`, style });
        this.balanceText.position.set(20, 20);
        this.addChild(this.balanceText);
    }

    public updateBalance(amount: number) {
        this.actualBalance += amount;
        gsap.to(this, {
            displayedBalance: this.actualBalance,
            duration: 2.0,
            ease: "power1.out",
            onUpdate: () => {
                this.rollupSound.play();
                this.balanceText.text = `Credits: ${Math.floor(this.displayedBalance)}`;
            }
        });
        this.balanceText.text = `Credits: ${this.actualBalance}`;
    }
}