import { Container, Text, TextStyle } from 'pixi.js';

export class UI extends Container {
    private balanceText: Text;
    private balance: number = 1000; // Starting balance

    constructor() {
        super();
        
        const style = new TextStyle({
            fontFamily: 'Arial',
            fontSize: 32,
            fontWeight: 'bold',
            fill: '#ffffff', // White text
            stroke: { color: '#000000', width: 4 }, // Black outline for visibility
        });

        this.balanceText = new Text({ text: `Credits: ${this.balance}`, style });
        this.balanceText.position.set(20, 20); // Top-left corner
        this.addChild(this.balanceText);
    }

    public updateBalance(amount: number) {
        // Roll-up logic could be added here, keeping it simple for now [cite: 32]
        this.balance += amount;
        this.balanceText.text = `Credits: ${this.balance}`;
    }
}