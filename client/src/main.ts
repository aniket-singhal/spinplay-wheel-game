import { Application, Assets } from 'pixi.js';
import { UI } from './UI';
import { BonusScreen } from './BonusScreen';
import './style.css';
import { TitleScreen } from './TitleScreen';

(async () => {
    // 1. Initialize Pixi Application
    const app = new Application();
    
    await app.init({
        background: '#000000',
        resizeTo: window,
        width: window.innerWidth,
        height: window.innerHeight,
        // resolution: window.devicePixelRatio || 1,
    });

    document.body.appendChild(app.canvas);

    // 2. Load Assets (Preloader)
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
    let titleScreen: TitleScreen;
    let bonusScreen: BonusScreen;
    const showTitle = () => {
        if (bonusScreen) {
            app.stage.removeChild(bonusScreen);
        }

        titleScreen = new TitleScreen(() => {
            console.log("Start Clicked -> Going to Bonus");
            showBonus();
        });
        
        app.stage.addChild(titleScreen);
        
        app.stage.setChildIndex(ui, app.stage.children.length - 1);
    };

    // Function to show Bonus
    const showBonus = () => {
        if (titleScreen) {
            app.stage.removeChild(titleScreen);
        }

        bonusScreen = new BonusScreen(app, ui, () => {
             console.log("Bonus Finished -> Back to Title");
             showTitle();
        });

        app.stage.addChild(bonusScreen);
        
        app.stage.setChildIndex(ui, app.stage.children.length - 1);
    };

    app.stage.addChild(ui);
    showTitle();
})();