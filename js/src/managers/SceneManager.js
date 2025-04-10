class SceneManager {
    constructor(canvasSelector, backgroundColor = "#e5e5e5") {
        this.scene = new THREE.Scene();
        this.canvas = document.querySelector(canvasSelector);

        const headerSize = 100;
        this.canvasHeight = window.innerHeight - headerSize;
        this.canvasWidth = window.innerWidth / 2;

        this.camera = new THREE.PerspectiveCamera(75, this.canvasWidth / this.canvasHeight, 0.1, 1000);
        this.camera.position.set(2, 3, 5);

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(this.canvasWidth, this.canvasHeight);
        this.renderer.setClearColor(backgroundColor);
        this.canvas.appendChild(this.renderer.domElement);

        this.controls = new THREE.TrackballControls(this.camera, this.renderer.domElement);
        this.controls.minDistance = 5;
        this.controls.maxDistance = 10;

        window.addEventListener('resize', () => this.onResize());
    }

    onResize() {
        this.camera.aspect = this.canvasWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.canvasWidth, this.canvasHeight);
    }

    render(callback) {
        const animate = () => {
            callback();
            requestAnimationFrame(animate);
            this.controls.update();
            this.renderer.render(this.scene, this.camera);
        };
        animate();
    }
}

export default SceneManager;