import Rubik from "../Rubik.js";
import Cube from "../Cube.js";

class RubikManager {
    constructor(dimensions) {
        this.dimensions = dimensions;
        this.rubik = this._createRubik();
        this.layerGroup = new THREE.Group();
        this.rotationSpeed = 0.1;

        this.isAnimating = false;
        this.newMoveAvailable = true;
        this.currentMove = null;

        this.movementsQueue = [];
        this.movementsStack = [];

        this.offset = 1.05;
        this.movements = this._defineMovements();
    }

    _defineMovements() {
        const o = this.offset;
        return [
            { name: 'R', inverse: "R'", axis: 'x', clockWise: true, offsetPosition: o },
            { name: "R'", inverse: 'R', axis: 'x', clockWise: false, offsetPosition: o },
            { name: 'L', inverse: "L'", axis: 'x', clockWise: true, offsetPosition: -o },
            { name: "L'", inverse: 'L', axis: 'x', clockWise: false, offsetPosition: -o },
            { name: 'U', inverse: "U'", axis: 'y', clockWise: true, offsetPosition: o },
            { name: "U'", inverse: 'U', axis: 'y', clockWise: false, offsetPosition: o },
            { name: 'D', inverse: "D'", axis: 'y', clockWise: true, offsetPosition: -o },
            { name: "D'", inverse: 'D', axis: 'y', clockWise: false, offsetPosition: -o },
            { name: 'F', inverse: "F'", axis: 'z', clockWise: true, offsetPosition: o },
            { name: "F'", inverse: 'F', axis: 'z', clockWise: false, offsetPosition: o },
            { name: 'B', inverse: "B'", axis: 'z', clockWise: true, offsetPosition: -o },
            { name: "B'", inverse: 'B', axis: 'z', clockWise: false, offsetPosition: -o }
        ];
    }

    _createRubik() {
        let rubik = new Rubik();
        const spacing = 0.05;
        const offset = (this.dimensions - 1) / 2;
        let count = 0;

        for (let i = 0; i < this.dimensions; i++) {
            for (let j = 0; j < this.dimensions; j++) {
                for (let k = 0; k < this.dimensions; k++) {
                    rubik.setCube(new Cube({
                        x: (i - offset) * (1 + spacing),
                        y: (j - offset) * (1 + spacing),
                        z: (k - offset) * (1 + spacing)
                    }, this.dimensions, spacing, count).getCube());
                    count++;
                }
            }
        }

        return rubik;
    }

    addToScene(scene) {
        this.rubik.getRubik().forEach(cube => scene.add(cube));
    }

    reset(scene) {
        this.rubik.getRubik().forEach(cube => scene.remove(cube));
        this.rubik.deleteRubik();
        this.rubik = this._createRubik();
        this.addToScene(scene);
        this.movementsStack = [];
    }

    enqueueMove(move) {
        this.movementsQueue.push(move);
        this.movementsStack.push(move);
    }

    undo(scene) {
        if (this.newMoveAvailable && this.movementsStack.length > 0) {
            const lastMove = this.movementsStack.pop();
            const reverseMove = this.movements.find(m => m.name === lastMove.inverse);
            this.setMove(reverseMove, scene);
            this.newMoveAvailable = false;
        }
    }

    shuffle(count = 10) {
        for (let i = 0; i < count; i++) {
            const move = this.movements[Math.floor(Math.random() * this.movements.length)];
            this.enqueueMove(move);
        }
    }

    solve() {
        while (this.movementsStack.length > 0) {
            const lastMove = this.movementsStack.pop();
            const inverse = this.movements.find(m => m.name === lastMove.inverse);
            this.movementsQueue.push(inverse);
        }
    }

    setMove(move, scene) {
        const layer = this.rubik.getLayer(move.axis, move.offsetPosition);
        this.isAnimating = true;
        this.layerGroup.add(...layer);
        this.currentMove = (move.clockWise ? 'clockWise' : 'counterClockWise') + move.axis;
        scene.add(this.layerGroup);
        this.layerGroup.rotation.set(0, 0, 0);
        this.newMoveAvailable = false;
    }

    animate(scene) {
        if (!this.isAnimating) return;

        const rotation = this.layerGroup.rotation;
        const axis = this.currentMove.slice(-1);
        const isClockwise = this.currentMove.startsWith('clockWise');

        const limit = isClockwise ? Math.PI / 2 : -Math.PI / 2;
        const step = isClockwise ? this.rotationSpeed : -this.rotationSpeed;

        rotation[axis] += step;

        if ((isClockwise && rotation[axis] >= limit) || (!isClockwise && rotation[axis] <= limit)) {
            rotation[axis] = limit;
            this.isAnimating = false;
            this.rubik.getRubik().forEach(cube => scene.attach(cube));
            this.newMoveAvailable = true;
        }
    }

    update(scene) {
        this.animate(scene);
        if (this.newMoveAvailable && this.movementsQueue.length > 0) {
            this.setMove(this.movementsQueue.shift(), scene);
        }
    }

    getMovementByName(name) {
        return this.movements.find(m => m.name === name);
    }
}

export default RubikManager;