import { Application, Assets } from 'pixi.js';
import { UI } from './UI';
import { BonusScreen } from './BonusScreen';
import './style.css';

(async () => {
    // 1. Initialize Pixi Application
    const app = new Application();
    
    await app.init({
        background: '#000000',
        resizeTo: window,
        width: window.innerWidth,
        height: window.innerHeight,
        // resolution: window.devicePixelRatio || 1, --- IGNORE ---
    });

    document.body.appendChild(app.canvas);

    // 2. Load Assets (Preloader)
    // We load everything here so we can use them immediately in classes
    await Assets.load([
        './images/background.png',
        './images/wheel-slice.png',
        './images/wheel-center.png',
        './images/pointer.png',
        './images/glow.png',
        './images/sunburst.png',
        './images/coin-anim.json' 
    ]);

    // 3. Setup Game Scenes
    const ui = new UI();
    const bonusScreen = new BonusScreen(app, ui);

    // Add to stage
    app.stage.addChild(bonusScreen);
    app.stage.addChild(ui); // UI on top
})();