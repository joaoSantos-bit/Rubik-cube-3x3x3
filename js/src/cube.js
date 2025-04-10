class Cube {
	constructor(_axis, _dimensions, _spacing, _name) {
		this._axis = _axis;
		this._name = _name;
		this._spacing = _spacing;
		this._dimensions = _dimensions;

		this._colors = {
			red: 0xb90000,
			yellow: 0xffd500,
			green: 0x009b48,
			blue: 0x0045ad,
			white: 0xffffff,
			orange: 0xff8c00,
			black: 0x1c1c1c
		};

		this._materials = [];
		this._buildCube();
	}
	_buildCube() {
		const geometry = new THREE.BoxGeometry(1, 1, 1);
		const faceColors = this._getFaceColors();
		this._materials = faceColors.map(color => new THREE.MeshBasicMaterial({ color }));

		this._cube = new THREE.Mesh(geometry, this._materials);
		this._cube.name = this._name;
		this._cube.position.set(this._axis.x, this._axis.y, this._axis.z);

		const wireframe = new THREE.LineSegments(
			new THREE.EdgesGeometry(geometry),
			new THREE.LineBasicMaterial({ color: this._colors.black, linewidth: 4 })
		);

		wireframe.renderOrder = 1;
		this._cube.add(wireframe);
	}

	_getFaceColors() {
		const D = 1 + this._spacing;
		const { x, y, z } = this._axis;
		const C = this._colors;

		const [RIGHT, LEFT, TOP, BOTTOM, FRONT, BACK] = [0, 1, 2, 3, 4, 5];
		let colors = Array(6).fill(C.black);

		// Lado esquerdo
		if (x === -D) colors[LEFT] = C.green;
		if (x === D)  colors[RIGHT] = C.blue;
		if (y === D)  colors[TOP] = C.yellow;
		if (y === -D) colors[BOTTOM] = C.white;
		if (z === D)  colors[FRONT] = C.red;
		if (z === -D) colors[BACK] = C.orange;

		return colors;
	}

	getCube() {
		return this._cube; 
	}

	setUpdateCubePosition(_axis) {
		this._axis = _axis;
		this._cube.position.set(_axis.x, _axis.y, _axis.z);
	}
};

export default Cube;
