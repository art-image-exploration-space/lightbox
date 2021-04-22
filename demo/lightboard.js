class LightBoard {
    constructor(config) {
        this.config = config;
        this.cameraSettings = this.config.cameraSettings;
        this.webGLRendererSettings = this.config.webGLRendererSettings;
        this.sprites = [];
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.controls = null;
        this.spriteOrderCounter = 0;
    }

    createLightBoard() {
       this.scene = new THREE.Scene();
       this.camera = new THREE.PerspectiveCamera(this.cameraSettings.fov, this.cameraSettings.aspect, this.cameraSettings.near, this.cameraSettings.far);
       this.renderer = new THREE.WebGLRenderer(this.webGLRendererSettings);
       this.constrols = new THREE.DragControls(this.sprites, this.camera, this.renderer.domElement);
       this.renderer.setSize(window.innerWidth, window.innerHeight);
       document.body.appendChild(this.renderer.domElement);
       this.camera.position.z = this.cameraSettings.position.z;
    }

    addImage(img) {
        let texture = new THREE.CanvasTexture(img);
        let material = new THREE.SpriteMaterial({map:texture});
        let sprite = new THREE.Sprite(material);
        let textureHeight = texture.image.height;
        let textureWidth = texture.image.width;
        this.sprites.push(sprite);
        sprite.scale.set(4.0, (textureHeight / textureWidth)*4, 1.0);
        this.scene.add(sprite);
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

    pushSpriteToFront(e) {
        this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = - (e.clientY / window.innerHeight) * 2 + 1;
        this.raycaster.setFromCamera( this.mouse, this.camera );
        const intersects = this.raycaster.intersectObjects(this.scene.children);
        if(intersects.length) {
            this.spriteOrderCounter += 1;
            intersects[0].object.renderOrder = this.spriteOrderCounter;
        }
    }
}


