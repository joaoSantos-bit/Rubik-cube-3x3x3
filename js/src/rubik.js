class Rubik {
	constructor() {
		this._cubes = [];
	}

	setCube(cube) {
		this._cubes.push(cube);
	}

	getRubik() {
		return this._cubes;
	}

	deleteRubik() {
		this._cubes = [];
	}

	_checkError(a, b, tolerance = 0.001) {
		return Math.abs(a - b) <= tolerance;
	}

	getLayer(axis, offset) {
		return this._cubes.filter(cube => this._checkError(cube.position[axis], offset));
	}
}

export default Rubik;