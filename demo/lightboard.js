class LightBoard {
    constructor(config) {
        this.config = config;
        this.cameraSettings = this.config.cameraSettings;
        this.webGLRendererSettings = this.config.webGLRendererSettings;
        this.planes = [];
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.dragControls = null;
        this.transformControls = null;
        this.planeOrderCounter = 0;
    }

    createLightBoard() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(this.cameraSettings.fov, this.cameraSettings.aspect, this.cameraSettings.near, this.cameraSettings.far);
        this.renderer = new THREE.WebGLRenderer(this.webGLRendererSettings);
        this.renderer.physicallyCorrectLights = true;
        this.renderer.setPixelRatio(2)
        this.dragConstrols = new THREE.DragControls(this.planes, this.camera, this.renderer.domElement);
        this.transformControls = new THREE.TransformControls(this.camera, this.renderer.domElement);
        this.transformControls.setMode("rotate");
        let dragControl = this.dragConstrols;
        this.transformControls.addEventListener('dragging-changed', function (event) {
            dragControl.enabled = !event.value
        })
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
        this.camera.position.z = this.cameraSettings.position.z;
    }

    addImage(img) {     
        let texture = new THREE.CanvasTexture(img);
        let textureHeight = texture.image.height;
        let textureWidth = texture.image.width;
        let geometry = new THREE.PlaneGeometry(4.0, (textureHeight / textureWidth)*4)
        let material = new THREE.MeshBasicMaterial({map:texture});
        let plane = new THREE.Mesh(geometry, material);
        this.transformControls.attach(plane);
        this.planes.push(plane);
        this.scene.add(plane);
        this.scene.add(this.transformControls);
    }

    resize() {
        let tanFOV = Math.tan(((Math.PI / 180) * this.camera.fov / 2));
        let windowHeight = window.innerHeight;
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.fov = (360 / Math.PI) * Math.atan(tanFOV * (window.innerHeight / windowHeight));
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.render(this.scene, this.camera);
    }

    pushPlaneToFront(e) {
        this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = - (e.clientY / window.innerHeight) * 2 + 1;
        this.raycaster.setFromCamera( this.mouse, this.camera );
        const intersects = this.raycaster.intersectObjects(this.scene.children);
        if(intersects.length) {
            this.planeOrderCounter += 1;
            intersects[0].object.renderOrder = this.planeOrderCounter;
            this.transformControls.attach(intersects[0].object);
        }
    }
}


