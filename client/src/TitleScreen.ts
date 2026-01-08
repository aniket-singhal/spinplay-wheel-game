import { Container, Text, Graphics } from 'pixi.js';
const DESIGN_WIDTH = 1280;

export class TitleScreen extends Container {
    public onStart: () => void;

    constructor(onStart: () => void) {
        super();
        this.onStart = onStart;
        this.setupScreen();
    }

    private setupScreen() {
        // 1. Title Text
        const title = new Text({
            text: 'SPIN & WIN',
            style: {
                fill: '#ffffff',
                fontSize: 80,
                fontWeight: 'bold',
                dropShadow: { alpha: 0.5, blur: 5, distance: 5 },
                stroke: { width: 6 }
            }
        });
        title.anchor.set(0.5);
        title.x = DESIGN_WIDTH / 2; 
        title.y = 200;
        this.addChild(title);

        // 2. Play Button
        const button = new Container();
        button.x = DESIGN_WIDTH / 2;
        button.y = 500;
        
        // Button Shape
        const bg = new Graphics();
        bg.roundRect(-100, -40, 200, 80, 20);
        bg.fill(0xFFCC00);
        bg.stroke({ color: 0xFFFFFF, width: 4 });
        
        const btnText = new Text({
            text: 'PLAY',
            style: { fontSize: 36, fontWeight: 'bold' }
        });
        btnText.anchor.set(0.5);

        button.addChild(bg, btnText);
        
        button.eventMode = 'static';
        button.cursor = 'pointer';
        
        button.on('pointerover', () => bg.tint = 0xAAAAAA);
        button.on('pointerout', () => bg.tint = 0xFFFFFF);
        
        button.on('pointerdown', () => {
            this.onStart(); 
        });

        this.addChild(button);
    }
}