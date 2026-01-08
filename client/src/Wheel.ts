import { Container, Sprite, Text, TextStyle, Texture } from 'pixi.js';
export class Wheel extends Container {
    private sliceAngle = (Math.PI * 2) / 8;
    private values = [5000, 200, 1000, 400, 2000, 200, 1000, 400];

    constructor() {
        super();
        this.buildWheel();
    }

    private buildWheel() {
        const sliceTexture = Texture.from('./images/wheel-slice.png');

        const textStyle = new TextStyle({
            fontFamily: 'Arial',
            fontSize: 36,
            fontWeight: 'bold',
            fill: '#ffffff',
            stroke: { color: '#000000', width: 4 },
            dropShadow: {
                alpha: 0.5,
                angle: Math.PI / 6,
                blur: 2,
                color: "#000000",
                distance: 2,
            },
        });

        // 1. Create 8 Slices
        for (let i = 0; i < 8; i++) {
            const sliceContainer = new Container();

            const sliceSprite = new Sprite(sliceTexture);
            sliceSprite.anchor.set(0.5, 1);
            sliceSprite.tint = i % 2 === 0 ? 0xFFCC00 : 0xFF6600;

            sliceSprite.scale.set(0.8);

            sliceContainer.addChild(sliceSprite);

            sliceContainer.rotation = i * this.sliceAngle + Math.PI / 2;

            // 2. Add Text to the Slice
            const text = new Text({ text: this.values[i].toString(), style: textStyle });
            text.anchor.set(0.5);

            text.y = -220;
            sliceContainer.addChild(text);
            this.addChild(sliceContainer);
        }

        // 3. Add Center Cap
        const centerSprite = Sprite.from('./images/wheel-center.png');
        centerSprite.anchor.set(0.5);
        centerSprite.eventMode = 'static';
        centerSprite.cursor = 'pointer';

        centerSprite.on('pointerdown', () => {
            this.emit('spin');
        });
        this.addChild(centerSprite);
    }
}