window.onload=function () {
    let videoElement=document.querySelector("#camara");
    let takeFotoButton=document.querySelector("#take-photo");
    let clearFtoButton=document.querySelector("#clear-photo");
    let fotoGaleria=document.querySelector("#photo-galery");

    //Solicitar acceso a la cámara
    navigator.mediaDevices.getUserMedia({video:true})
        .then(stream=>{
       videoElement.srcObject=stream;
    })
        .catch(error=>{
            console.log("Error al acceder a la camata" + error);
        })
    //declaramos un contador de fotos para generar un id y poder borrar o descargar
    let fotoIdCounter=getNextFotoId(); //Una funcion

    //¿Qué pasa si le das al boton tomar foto? =>Ç
    takeFotoButton.addEventListener("click", () =>{
        //crear un canvas para tomar la captura
        //se necesita identificar el ancho y el alto de lo que va ha capturar

        const canvas=document.createElement("canvas");
        canvas.width=videoElement.videoWidth; //tomamos el ancho de que se transmite en la camara
        canvas.height=videoElement.videoHeight; //tomamos el alto de que se transmite en la camara
        const contex=canvas.getContext("2d")
        //dibujar con todos estos
        contex.drawImage(videoElement,0,0,canvas.width,canvas.height);

        //convertir en una imagen a base 64 y guardarla en el navegador
        const dataUrl=canvas.toDataURL("image/jpeg",0.90);//convierte la imagen a un 90% de nitidez
        const fotoId= fotoIdCounter++;
        guardarFoto({id:fotoId,dataUrl});//llama a la funcion guardar foto y le pasa como parametros la foto
        //enviamos al local storage a guardar la foto
        setNextFotoId(fotoIdCounter);

    });







function guardarFoto(foto, isFromLoad = false) {
    //crear un contenedor donde guardar la foto
    const fotoContainer=document.createElement("div");
    fotoContainer.className="photo-container";
    fotoContainer.dataset.id=foto.id;

    //crear la imagen
    const img=new Image();//La imagen como objeto
    img.src=foto.dataUrl;
    img.cclassName="photo";
    //como cada foto tiene sus botones de descargar o eliminar se crean junto con la foto
    const buttonContainer=document.createElement("div");
    buttonContainer.className=("photo-buttons")

    //creamos el boton de eliminar
    const deleteButton=document.createElement("button");
    deleteButton.className="delete-photo";
    deleteButton.textContent="Eliminar";
    deleteButton.addEventListener("click", ()=>{
        eliminarFoto(foto.id);//nos indetifica con la id la photo a eliminar
    });

    //crear el boton de descargar la foto
    const downloadFoto=document.createElement("button");
    downloadFoto.className="download-photo";
    downloadFoto.textContent="Descargar";
    downloadFoto.addEventListener("click",()=>{
        descargarFoto(foto.dataUrl,`foto-${foto.id}.jpg`);
    })

    buttonContainer.appendChild(downloadFoto);
    buttonContainer.appendChild(deleteButton);
    fotoContainer.appendChild(img);
    fotoContainer.appendChild(buttonContainer);
    fotoGaleria.appendChild(fotoContainer);

    //guardar la foto en el almacenamiento local
    if (!isFromLoad){
        const fotos=JSON.parse(localStorage.getItem("fotos")) || [];
        fotos.push(foto);
        localStorage.setItem("fotos",JSON.stringify(fotos));
    }

}

function eliminarFoto(id) {
    //elimiar la foto del DOM
    //dejarlo de mostrar
    const fotoContainer=document.querySelector(`.photo-container[data-id="${id}"]`);
    if (fotoContainer){
        fotoGaleria.removeChild(fotoContainer);
    }
    //eliminarlo del localStorage
    let fotos=JSON.parse(localStorage.getItem("fotos")) || [];
    fotos=fotos.filter(photo =>photo.id !== id)
    localStorage.setItem("fotos",JSON.stringify(fotos));


}

/*
* Funcion para crear un tipo link en el body y ejecutarlo para descargar la foto solicitada.
 */

function descargarFoto(dataUrl,nombreArchivo) {
    const a=document.createElement("a");
    a.href=dataUrl; //crea un link
    a.download=nombreArchivo; //tipo download
    document.body.appendChild(a); //lo termina de crear
    a.click(); //como si el usuario pulsara click
    document.body.removeChild(a); //lo elimina
}

/*
* Activar el evento para que cuando se pulse click sobre borrar todas las fotos, se elimine todas
 */

    clearFtoButton.addEventListener("click",()=>{
        localStorage.removeItem("fotos");
        while (fotoGaleria.firstChild){
            fotoGaleria.removeChild(fotoGaleria.firstChild);
        }
        fotoIdCounter=0;
        setNextFotoId(fotoIdCounter);
    })

//cargar las fotos guardadas al iniciar la aplicacion
const fotosGuardadas=JSON.parse(localStorage.getItem("fotos")) || [];
    fotosGuardadas.forEach(foto =>{
       guardarFoto(foto, true);
});

//obtiene el valor en el localStorage con el nuevo valor convertido
function getNextFotoId() {
    return parseInt(localStorage.getItem("fotoIdCounter")) || 0;
}

//asigna el valor en el localStorage
function setNextFotoId(id) {
    localStorage.setItem("fotoIdCounter", id.toString());
}

}
