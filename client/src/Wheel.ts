import { Container, Sprite, Text, TextStyle, Texture } from 'pixi.js';
export class Wheel extends Container {
    private sliceAngle = (Math.PI * 2) / 8; // 8 equal slices
    // These values match the SERVER config exactly
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
            
            // Create the sprite from your image
            const sliceSprite = new Sprite(sliceTexture);
            
            // IMPORTANT: Anchor Setup
            // Assuming your slice image is a wedge pointing DOWN.
            // We set the anchor to the middle-top (0.5, 0) if it points down from center.
            // If your image points UP, use (0.5, 1). 
            // *Adjustment*: Standard wheel slices are usually wedges. Let's assume (0.5, 1) to pivot at bottom tip.
            sliceSprite.anchor.set(0.5, 1);
            
            // Tint alternating slices [cite: 25]
            sliceSprite.tint = i % 2 === 0 ? 0xFFCC00 : 0xFF6600; 
            
            // Scale down if your image is huge (adjust this 0.8 as needed)
            sliceSprite.scale.set(0.8);

            sliceContainer.addChild(sliceSprite);
            
            // Rotate the slice into position
            sliceContainer.rotation = i * this.sliceAngle + Math.PI/2;
            
            // 2. Add Text to the Slice [cite: 26]
            const text = new Text({ text: this.values[i].toString(), style: textStyle });
            text.anchor.set(0.5);
            
            // Push text outward away from center. 
            // Since the container is rotated, we move along negative Y axis of the slice
            text.y = -220; // Adjust this number to move text closer/further from center
            
            sliceContainer.addChild(text);
            this.addChild(sliceContainer);
        }

        // 3. Add Center Cap
        const centerSprite = Sprite.from('./images/wheel-center.png');
        centerSprite.anchor.set(0.5);
        this.addChild(centerSprite);
    }
}