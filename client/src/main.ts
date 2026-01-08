import { Application, Assets, Container } from 'pixi.js';
import { UI } from './UI';
import { BonusScreen } from './BonusScreen';
import './style.css';
import { TitleScreen } from './TitleScreen';

const DESIGN_WIDTH = 1280;
const DESIGN_HEIGHT = 720;

(async () => {
    const app = new Application();

    await app.init({
        background: '#000000',
        resizeTo: window,
        width: window.innerWidth,
        height: window.innerHeight,
        autoDensity: true,
    });

    document.body.appendChild(app.canvas);

    await Assets.load([
        './images/background.png',
        './images/wheel-slice.png',
        './images/wheel-center.png',
        './images/pointer.png',
        './images/glow.png',
        './images/sunburst.png',
        './images/coin-anim.json'
    ]);

    const gameContainer = new Container();
    app.stage.addChild(gameContainer);

    const ui = new UI();
    gameContainer.addChild(ui);

    let titleScreen: TitleScreen | undefined;
    let bonusScreen: BonusScreen | undefined;

    const showBonus = () => {
        if (titleScreen) {
            gameContainer.removeChild(titleScreen);
            titleScreen.destroy({ children: true });
            titleScreen = undefined;
        }

        bonusScreen = new BonusScreen(ui, () => {
            showTitle();
        });

        gameContainer.addChild(bonusScreen);
        gameContainer.setChildIndex(ui, gameContainer.children.length - 1);
    };

    const showTitle = () => {
        if (bonusScreen) {
            gameContainer.removeChild(bonusScreen);
            bonusScreen.destroy({ children: true });
            bonusScreen = undefined;
        }

        titleScreen = new TitleScreen(() => {
            showBonus();
        });

        gameContainer.addChild(titleScreen);
        gameContainer.setChildIndex(ui, gameContainer.children.length - 1);
    };

    const resize = () => {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        const scale = Math.min(
            screenWidth / DESIGN_WIDTH,
            screenHeight / DESIGN_HEIGHT
        );

        gameContainer.scale.set(scale);

        gameContainer.x = (screenWidth - DESIGN_WIDTH * scale) / 2;
        gameContainer.y = (screenHeight - DESIGN_HEIGHT * scale) / 2;
    };

    window.addEventListener('resize', resize);

    resize();
    showTitle();
})();