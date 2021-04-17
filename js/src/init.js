const init = (dimensions = 3) => {
    // configure scene
    const scene = new THREE.Scene();
    const backgroundColor = "#e5e5e5";

    const headerSize = 100;
    const canvasHeight = window.innerHeight - headerSize;
    const canvasWidth = window.innerWidth / 2;

    // configure camera
    const camera = new THREE.PerspectiveCamera(75, canvasWidth / canvasHeight, 0.1, 1000);
    camera.position.set(2, 3, 5);

    // configure render
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(canvasWidth, canvasHeight);
    renderer.setClearColor(backgroundColor);
    document.querySelector("#canvas").appendChild(renderer.domElement);

    // configure camera controls
    const cameraControls = new THREE.TrackballControls(camera, renderer.domElement);
    cameraControls.minDistance = 5;
    cameraControls.maxDistance = 10;
    
    // create rubik's cube
    let rubik = new Rubik();
    rubik = createRubik(rubik, dimensions);
    // add cubes to the scene
    rubik.getRubik().forEach(cube => scene.add(cube));

    // make the canvas responsive on resize
    const onResize = () => {
        camera.aspect = canvasWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvasWidth, canvasHeight);
    }
    window.addEventListener('resize', onResize, false);


    // create rubik's cube
    let cubes = rubik.getRubik();
    // create group
    let layerGroup = new THREE.Group();

    let offsetPosition = 1.05;

    //--------------------------- animate rotation -----------------------------
    const rotationSpeed = 0.1;
    let isAnimating = false;
    let currentMovingLayer; 
    let newMoveAvaible = true;

    // movements queue
    let movementsQueue = [];
    let movementsStack = [];

    const completedMove = () =>  {
        isAnimating = false;
        cubes.forEach(cube => scene.attach(cube));
        newMoveAvaible = true;
    }

    // animate layer movements
    const animateFace = () => {
        if (isAnimating) {
            if (currentMovingLayer == 'clockWisez') {
                if (layerGroup.rotation.z >= Math.PI / 2) {
                    layerGroup.rotation.z = Math.PI / 2;
                    completedMove();
                } else {
                    layerGroup.rotation.z += rotationSpeed;
                }
            } else if (currentMovingLayer == 'counterClockWisez') {
                if (layerGroup.rotation.z <= Math.PI / -2) {
                    layerGroup.rotation.z = Math.PI / -2;
                    completedMove();
                } else {
                    layerGroup.rotation.z -= rotationSpeed;
                }
            } else if (currentMovingLayer == 'clockWisex') {
                if (layerGroup.rotation.x >= Math.PI / 2) {
                    layerGroup.rotation.x = Math.PI / 2;
                    completedMove();
                } else {
                    layerGroup.rotation.x += rotationSpeed;
                }
            } else if (currentMovingLayer == 'counterClockWisex') {
                if (layerGroup.rotation.x <= Math.PI / -2) {
                    layerGroup.rotation.x = Math.PI / -2;
                    completedMove();
                } else {
                    layerGroup.rotation.x -= rotationSpeed;
                }
            } else if (currentMovingLayer == 'clockWisey') {
                if (layerGroup.rotation.y >= Math.PI / 2) {
                    layerGroup.rotation.y = Math.PI / 2;
                    completedMove();
                } else {
                    layerGroup.rotation.y += rotationSpeed;
                }
            } else if (currentMovingLayer == 'counterClockWisey') {
                if (layerGroup.rotation.y <= Math.PI / -2) {
                    layerGroup.rotation.y = Math.PI / -2;
                    completedMove();
                } else {
                    layerGroup.rotation.y -= rotationSpeed;
                } 
            }
        }
    }  

    // configure movements
    let movements = [
        {name: 'R', inverse: "R'", axis: 'x', clockWise: true, offsetPosition: offsetPosition},
        {name: "R'", inverse: 'R', axis: 'x', clockWise: false, offsetPosition: offsetPosition},
        {name: 'L', inverse: "L'", axis: 'x', clockWise: true, offsetPosition: -offsetPosition},
        {name: "L'", inverse: 'L', axis: 'x', clockWise: false, offsetPosition: -offsetPosition},
        {name: 'U', inverse: "U'", axis: 'y', clockWise: true, offsetPosition: offsetPosition},
        {name: "U'", inverse: 'U', axis: 'y', clockWise: false, offsetPosition: offsetPosition},
        {name: 'D', inverse: "D'", axis: 'y', clockWise: true, offsetPosition: -offsetPosition},
        {name: "D'", inverse: 'D', axis: 'y', clockWise: false, offsetPosition: -offsetPosition},
        {name: 'F', inverse: "F'", axis: 'z', clockWise: true, offsetPosition: offsetPosition},
        {name: "F'", inverse: 'F', axis: 'z', clockWise: false, offsetPosition: offsetPosition},
        {name: 'B', inverse: "B'", axis: 'z', clockWise: true, offsetPosition: -offsetPosition},
        {name: "B'", inverse: 'B', axis: 'z', clockWise: false, offsetPosition: -offsetPosition}
    ];

    // set a layer's movement
    const setMove = (movement) => {
        let layer = rubik.getLayer(movement.axis, movement.offsetPosition);
        isAnimating = true;
        layerGroup.add(...layer);
        currentMovingLayer = (movement.clockWise == true) ? 'clockWise' + movement.axis : 'counterClockWise' + movement.axis;
        scene.add(layerGroup);
        layerGroup.rotation.set(0, 0, 0);
        undo = true;
        newMoveAvaible = false;
    }

    // controls
    const controls = document.querySelectorAll(".command-main-button");
    const moveControls = document.querySelectorAll(".command-button");
    // configure what each move command should do
    moveControls.forEach((moveControl, index) => {
        let movement;
        moveControl.addEventListener('click', () => {
            if (newMoveAvaible) {
                if (index == 0) { // R
                    movement = movements.filter(movement => movement.name == 'R');
                    movementsQueue.push(movement[0]);
                    movementsStack.push(movement[0]);
                } else if (index == 1) { // R'
                    movement = movements.filter(movement => movement.name == "R'");
                    movementsQueue.push(movement[0]);
                    movementsStack.push(movement[0]);
                } else if (index == 2) { // L
                    movement = movements.filter(movement => movement.name == 'L');
                    movementsQueue.push(movement[0]);
                    movementsStack.push(movement[0]);
                } else if (index == 3) { // L'
                    movement = movements.filter(movement => movement.name == "L'");
                    movementsQueue.push(movement[0]);
                    movementsStack.push(movement[0]);
                } else if (index == 4) { // B
                    movement = movements.filter(movement => movement.name == 'B');
                    movementsQueue.push(movement[0]);
                    movementsStack.push(movement[0]);
                } else if (index == 5) { // B'
                    movement = movements.filter(movement => movement.name == "B'");
                    movementsQueue.push(movement[0]);
                    movementsStack.push(movement[0]);
                } else if (index == 6) { // D
                    movement = movements.filter(movement => movement.name == 'D');
                    movementsQueue.push(movement[0]);
                    movementsStack.push(movement[0]);
                } else if (index == 7) { // D'
                    movement = movements.filter(movement => movement.name == "D'");
                    movementsQueue.push(movement[0]);
                    movementsStack.push(movement[0]);
                } else if (index == 8) { // F
                    movement = movements.filter(movement => movement.name == 'F');
                    movementsQueue.push(movement[0]);
                    movementsStack.push(movement[0]);
                } else if (index == 9) { // F'
                    movement = movements.filter(movement => movement.name == "F'");
                    movementsQueue.push(movement[0]);
                    movementsStack.push(movement[0]);
                } else if (index == 10) { // U
                    movement = movements.filter(movement => movement.name == 'U');
                    movementsQueue.push(movement[0]);
                    movementsStack.push(movement[0]);
                } else if (index == 11) { // U'
                    movement = movements.filter(movement => movement.name == "U'");
                    movementsQueue.push(movement[0]);
                    movementsStack.push(movement[0]);
                }
            }
        }, false);
    });

    const shuffleNumber = 10;
    controls.forEach((control, index) => {
        control.addEventListener('click', () => {
            if (index == 0) { // Shuffle
                let movement;
                for (let i = 0; i < shuffleNumber; i++) {
                    movement = movements[generateRandom(movements.length - 1)];
                    movementsQueue.push(movement);
                    movementsStack.push(movement);
                }
            } else if (index == 1) { // Solve
                let lastMove, nextMove;
                while (movementsStack.length > 0) {
                    lastMove = movementsStack.pop();
                    nextMove = movements.filter(movement => movement.inverse == lastMove.name);
                    movementsQueue.push(nextMove[0]);
                }
            } else if (index == 2) { // Undo
                if (undo && newMoveAvaible) {
                    let lastMove = movementsStack.pop();
                    let nextMove = movements.filter(movement => movement.inverse == lastMove.name);
                    setMove(nextMove[0]);
                    undo  = false;
                }
            } else if (index == 3) { // Reset
                if (movementsStack.length > 0 && newMoveAvaible) {
                    rubik.getRubik().forEach(cube => scene.remove(cube));
                    rubik.deleteRubik();
                    rubik = createRubik(rubik, dimensions);
                    cubes = rubik.getRubik();
                    rubik.getRubik().forEach(cube => scene.add(cube));
                    // reset the movements stack
                    movementsStack = [];
                }
            }
        }, false);
    });


    //--------------------------- render the canvas ---------------------------
    const render = () => {
        // chek if the animation is still going on
        if (isAnimating) {
            animateFace();
        }
        // set a new movement
        if (newMoveAvaible && movementsQueue.length > 0) {
            setMove(movementsQueue.shift());
        }

        requestAnimationFrame(render);
        cameraControls.update();
        renderer.render(scene, camera);
    }
    render();
}

// generate a radom integer
const generateRandom = (range) => {
    return Math.floor(Math.random() * (range + 1));
}

// create rubik's cube
const createRubik = (rubik, dimensions) => {
    let spacing = 0.05;
    let offSetPosition = (dimensions - 1) / 2;
    let count = 0;
    for(let i = 0; i < dimensions; i++) {
        for(let j = 0; j < dimensions; j++) {
            for(let k = 0; k < dimensions; k++) {
                rubik.setCube(new Cube({
                    x: (i - offSetPosition) * (1 + spacing),
                    y: (j - offSetPosition) * (1 + spacing),
                    z: (k - offSetPosition) * (1 + spacing)
                }, dimensions, spacing, count).getCube());
                count++;
            }
        }
    }
    return rubik;
}
