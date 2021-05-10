// definindo os settings da camera
const cameraSettings = { fov: 75,
                         aspect: window.innerWidth / window.innerHeight,
                         near: 0.1,
                         far: 1000,
                         position: {x: 0, y: 0, z: 5} };

// colocando o plano de fundo como branco, default é preto                         
const webGLRendererSettings = { alpha: true, antialias: true };

//criando lightBoard
const settings = {cameraSettings: cameraSettings, webGLRendererSettings: webGLRendererSettings};
const lightBoard = new LightBoard(settings);
lightBoard.createLightBoard();

//função de animação para realização de mudanças no conteúdo da cena 
const animate = () => {
    requestAnimationFrame(animate);
    lightBoard.renderer.render(lightBoard.scene, lightBoard.camera);
};

//evento para adicionar imagens do pc ao lightBoard com o mouse
$('canvas').on('drop', function(e) {
    //previnir abrir a imagem no browser
    e.preventDefault();
    //se tiver elementos em transferencia para o browser
    if (e.originalEvent.dataTransfer.items) {
        //para cada um destes elementos
        for (let i = 0; i < e.originalEvent.dataTransfer.items.length; i++) {
            //se for do tipo arquivo
            if (e.originalEvent.dataTransfer.items[i].kind === 'file') {
                //cria imagem a partir do envio do arquivo para o browser
                let blob = e.originalEvent.dataTransfer.items[i].getAsFile();
                let url = URL.createObjectURL(blob);
                let img = new Image();
                img.src = url;
                //adiciona imagem ao lightBoard quando a imagem termina de carregar
                img.onload = function () {
                    lightBoard.addImage(img);
                    animate();
                }
              }
        }
    }
});

//tambem para prevencao da abertura da imagem no browser
$('canvas').on('dragover', function(e){
  e.preventDefault();
});

//se mudar o tamanho da janela, ele muda o tamanho da área iteravel
window.addEventListener('resize', function(e){
  lightBoard.resize()
});

//identifica a imagem clicada e puxa para frente
window.addEventListener("pointerdown", function(e){
  lightBoard.pushPlaneToFront(e);
});

