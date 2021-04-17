class Cube {
	constructor(_axis, _dimensions, _spacing, _name) {
		// create a box of size 1
		let box = new THREE.BoxGeometry(1, 1, 1);
		this._materials = [];
		this._axis = _axis;
		this._colors = [0xb90000, 0xffd500, 0x009b48, 0x0045ad, 0xffffff, 0xff8c00, 0x1c1c1c];
		let offSetPosition = 1 + _spacing;
		this._buildFacesMaterial(offSetPosition);

		this._cube = new THREE.Mesh(box, this._materials);
		this._cube.name = _name;
		this._cube.position.set(this._axis.x, this._axis.y, this._axis.z);

		// https://stackoverflow.com/questions/41031214/javascript-threejs-3d-draw-solid-cubic-with-border
		const geometry = new THREE.EdgesGeometry(this._cube.geometry);
		const material = new THREE.LineBasicMaterial({color: 0x1c1c1c, linewidth: 4});
		const wireframe = new THREE.LineSegments(geometry, material);
		wireframe.renderOrder = 1; // make sure wireframes are rendered 2nd
		this._cube.add(wireframe);
	}

	_buildFaceMaterial(_colors) {
		_colors.forEach(color => this._materials.push(new THREE.MeshBasicMaterial({color: color})));
	}	

	_buildFacesMaterial(offSetPosition) {
		// right left top bottom front back
		let colors = [0x1c1c1c, 0x1c1c1c, 0x1c1c1c, 0x1c1c1c, 0x1c1c1c, 0x1c1c1c]; // default cube materials

		// build cube materials
		if (this._axis.x == -offSetPosition) {// left layer
			// build corners
			if (this._axis.y == offSetPosition) {
				if (this._axis.z == offSetPosition) {
					colors = [this._colors[6], this._colors[2], this._colors[1], this._colors[6], this._colors[0], this._colors[6]];
				} else if (this._axis.z == -offSetPosition) {
					colors = [this._colors[6], this._colors[2], this._colors[1], this._colors[6], this._colors[6], this._colors[5]];
				} else { // build vertices
					colors = [this._colors[6], this._colors[2], this._colors[1], this._colors[6], this._colors[6], this._colors[6]];
				}
			} else if (this._axis.y == -offSetPosition) {
				if (this._axis.z == offSetPosition) {
					colors = [this._colors[6], this._colors[2], this._colors[6], this._colors[4], this._colors[0], this._colors[6]];
				} else if (this._axis.z == -offSetPosition) {
					colors = [this._colors[6], this._colors[2], this._colors[6], this._colors[4], this._colors[6], this._colors[5]];
				} else { //  build vertices
					colors = [this._colors[6], this._colors[2], this._colors[6], this._colors[4], this._colors[6], this._colors[6]];
				}	
			} else if (this._axis.z == -offSetPosition) { // build vertices
				colors = [this._colors[6], this._colors[2], this._colors[6], this._colors[6], this._colors[6], this._colors[5]];
			} else if (this._axis.z == offSetPosition) {
				colors = [this._colors[6], this._colors[2], this._colors[6], this._colors[6], this._colors[0], this._colors[6]];
			} else { // build central layer cubes
				colors = [this._colors[6], this._colors[2], this._colors[6], this._colors[6], this._colors[6], this._colors[6]];
			}
		} else if (this._axis.x == offSetPosition) { // right layer
			// build corners
			if (this._axis.y == offSetPosition) {
				if (this._axis.z == offSetPosition) {
					colors = [this._colors[3], this._colors[6], this._colors[1], this._colors[6], this._colors[0], this._colors[6]];
				} else if (this._axis.z == -offSetPosition) {
					colors = [this._colors[3], this._colors[6], this._colors[1], this._colors[6], this._colors[6], this._colors[5]];
				} else { //  build vertices
					colors = [this._colors[3], this._colors[6], this._colors[1], this._colors[6], this._colors[6], this._colors[6]];
				}
			} else if (this._axis.y == -offSetPosition) {
				if (this._axis.z == offSetPosition) {
					colors = [this._colors[3], this._colors[6], this._colors[6], this._colors[4], this._colors[0], this._colors[6]];
				} else if (this._axis.z == -offSetPosition) {
					colors = [this._colors[3], this._colors[6], this._colors[6], this._colors[4], this._colors[6], this._colors[5]];
				} else { // build vertices
					colors = [this._colors[3], this._colors[6], this._colors[6], this._colors[4], this._colors[6], this._colors[6]];
				}
			} else if (this._axis.z == -offSetPosition) { // build vertices
				colors = [this._colors[3], this._colors[6], this._colors[6], this._colors[6], this._colors[6], this._colors[5]];
			} else if (this._axis.z == offSetPosition) {
				colors = [this._colors[3], this._colors[6], this._colors[6], this._colors[6], this._colors[0], this._colors[6]];
			} else { // build central layer cubes
				colors = [this._colors[3], this._colors[6], this._colors[6], this._colors[6], this._colors[6], this._colors[6]];
			}
		} else if (this._axis.z == offSetPosition) { // middle layers
			if (this._axis.y == offSetPosition) {
				colors = [this._colors[6], this._colors[6], this._colors[1], this._colors[6], this._colors[0], this._colors[6]];
			} else if (this._axis.y == -offSetPosition) {
				colors = [this._colors[6], this._colors[6], this._colors[6], this._colors[4], this._colors[0], this._colors[6]];
			} else { // build vertices
				colors = [this._colors[6], this._colors[6], this._colors[6], this._colors[6], this._colors[0], this._colors[6]];
			}
		} else if (this._axis.z == -offSetPosition) {
			if (this._axis.y == offSetPosition) {
				colors = [this._colors[6], this._colors[6], this._colors[1], this._colors[6], this._colors[6], this._colors[5]];
			} else if (this._axis.y == -offSetPosition) {
				colors = [this._colors[6], this._colors[6], this._colors[6], this._colors[4], this._colors[6], this._colors[5]];
			} else { // build vertices
				colors = [this._colors[6], this._colors[6], this._colors[6], this._colors[6], this._colors[6], this._colors[5]];
			}
		} else if (this._axis.y == offSetPosition) {
			colors = [this._colors[6], this._colors[6], this._colors[1], this._colors[6], this._colors[6], this._colors[6]];
		} else if (this._axis.y == -offSetPosition) {
			colors = [this._colors[6], this._colors[6], this._colors[6], this._colors[4], this._colors[6], this._colors[6]];

		}

		this._buildFaceMaterial(colors);
	}

	getCube() {
		return this._cube; 
	}

	setUpdateCubePosition(_axis) {
		this._axis = _axis;
		this._cube.position.set(_axis.x, _axis.y, _axis.z);
	}
};
