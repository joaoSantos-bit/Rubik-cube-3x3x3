class ControlsManager {
    constructor(rubikManager, scene) {
        this.rubikManager = rubikManager;
        this.scene = scene;
        this._setupMoveButtons();
        this._setupMainButtons();
    }

    _setupMoveButtons() {
        const buttons = document.querySelectorAll(".command-button");
        buttons.forEach((btn, index) => {
            const moveName = this._getMoveNameByIndex(index);
            btn.addEventListener('click', () => {
                const move = this.rubikManager.getMovementByName(moveName);
                if (move && this.rubikManager.newMoveAvailable) {
                    this.rubikManager.enqueueMove(move);
                }
            });
        });
    }

    _setupMainButtons() {
        const controls = document.querySelectorAll(".command-main-button");
        controls[0].addEventListener('click', () => this.rubikManager.shuffle());
        controls[1].addEventListener('click', () => this.rubikManager.solve());
        controls[2].addEventListener('click', () => this.rubikManager.undo(this.scene));
        controls[3].addEventListener('click', () => this.rubikManager.reset(this.scene));
    }

    _getMoveNameByIndex(index) {
        const names = ['R', "R'", 'L', "L'", 'B', "B'", 'D', "D'", 'F', "F'", 'U', "U'"];
        return names[index];
    }
}

export default ControlsManager;