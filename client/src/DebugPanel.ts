import { Container, Graphics, Text } from 'pixi.js';

export class DebugPanel extends Container {
    private selectedIndex: number = 0;
    private isEnabled: boolean = false;
    
    private checkbox!: Graphics;
    private numberButtons: Container[] = [];

    constructor() {
        super();
        this.setupPanel();
    }

    private setupPanel() {
        // 1. Background Panel
        const bg = new Graphics();
        bg.roundRect(0, 0, 220, 160, 10);
        bg.fill({ color: 0x000000, alpha: 0.8 });
        bg.stroke({ color: 0xFFFFFF, width: 2 });
        
        bg.eventMode = 'static'; 
        
        this.addChild(bg);

        // 2. Title
        const title = new Text({ 
            text: 'DEBUG: Force Result', 
            style: { fill: '#ffffff', fontSize: 16, fontWeight: 'bold' } 
        });
        title.position.set(15, 15);
        this.addChild(title);

        this.createCheckbox();

        this.createNumberGrid();
        
        this.updateVisuals();
    }

    private createCheckbox() {
        const container = new Container();
        container.position.set(15, 45);

        this.checkbox = new Graphics();
        container.addChild(this.checkbox);

        const label = new Text({ 
            text: 'Enable Force', 
            style: { fill: '#ffffff', fontSize: 14 } 
        });
        label.position.set(30, 0);
        container.addChild(label);

        container.eventMode = 'static';
        container.cursor = 'pointer';
        container.on('pointerdown', () => {
            this.isEnabled = !this.isEnabled;
            this.updateVisuals();
        });

        this.addChild(container);
    }

    private createNumberGrid() {
        const startX = 15;
        const startY = 80;
        const gap = 5;
        const size = 30;

        for (let i = 0; i < 8; i++) {
            const btn = new Container();
            const col = i % 4;
            const row = Math.floor(i / 4);
            
            btn.x = startX + (col * (size + gap));
            btn.y = startY + (row * (size + gap));

            const bg = new Graphics();
            btn.addChild(bg);

            const num = new Text({ 
                text: i.toString(), 
                style: { fill: '#ffffff', fontSize: 14, fontWeight: 'bold' } 
            });
            num.anchor.set(0.5);
            num.position.set(size / 2, size / 2);
            btn.addChild(num);

            btn.eventMode = 'static';
            btn.cursor = 'pointer';
            
            btn.on('pointerdown', () => {
                this.selectedIndex = i;
                this.isEnabled = true;
                this.updateVisuals();
            });

            (btn as any).bgGraphics = bg; 
            this.numberButtons.push(btn);
            this.addChild(btn);
        }
    }

    private updateVisuals() {
        // Draw Checkbox
        this.checkbox.clear();
        this.checkbox.rect(0, 0, 20, 20);
        if (this.isEnabled) {
            this.checkbox.fill(0x00FF00);
        } else {
            this.checkbox.fill(0x333333);
            this.checkbox.stroke({ width: 1, color: 0xAAAAAA });
        }

        // Draw Numbers
        this.numberButtons.forEach((btn, index) => {
            const bg = (btn as any).bgGraphics as Graphics;
            bg.clear();
            
            btn.alpha = this.isEnabled ? 1.0 : 0.4;

            if (this.isEnabled && index === this.selectedIndex) {
                bg.roundRect(0, 0, 30, 30, 5);
                bg.fill(0xFFCC00);
                bg.stroke({ color: 0xFFFFFF, width: 2 });
            } else {
                bg.roundRect(0, 0, 30, 30, 5);
                bg.fill(0x444444);
            }
        });
    }

    public getForceIndex(): number | undefined {
        return this.isEnabled ? this.selectedIndex : undefined;
    }
}