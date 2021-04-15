class Rubik {
    constructor() {
        this._cubes = [];
    }
    
    setCube(_cube) {
        this._cubes.push(_cube);
    }

    getRubik() {
        return this._cubes;
    }  

    deleteRubik() {
        this._cubes = [];
    }

    _checkError(rotationAxis, offSetPosition) {
        let error = 0.001;
        return Math.abs(rotationAxis - offSetPosition) <= error;
    }

    _buildLayer(rotationAxis, offSetPosition) {
        let layer = [];
        if (rotationAxis == 'x') {
            this._cubes.forEach(cube => {
                if (this._checkError(cube.position.x, offSetPosition)) {
                    layer.push(cube);
                }
            });
        } else if (rotationAxis == 'y') {
            this._cubes.forEach(cube => {
                if (this._checkError(cube.position.y, offSetPosition)) {
                    layer.push(cube);
                }
            });
        } else {
            this._cubes.forEach(cube => {
                if (this._checkError(cube.position.z, offSetPosition)) {
                    layer.push(cube);
                }
            });
        }

        return layer;
    }
    
    getLayer(rotationAxis, offSetPosition) {
        return this._buildLayer(rotationAxis, offSetPosition);
    }
};