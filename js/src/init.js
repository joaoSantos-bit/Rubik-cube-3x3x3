import SceneManager from './managers/SceneManager.js';
import RubikManager from './managers/RubikManager.js';
import ControlsManager from './managers/ControlsManager.js';

const init = (dimensions = 3) => {
    const sceneManager = new SceneManager('#canvas');
    const rubikManager = new RubikManager(dimensions);

    rubikManager.addToScene(sceneManager.scene);

    new ControlsManager(rubikManager, sceneManager.scene);

    sceneManager.render(() => {
        rubikManager.update(sceneManager.scene);
    });
};

init();