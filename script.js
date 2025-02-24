let turno=1;
let puntosJ1=0;
let dibujando=false;
let palabra="";
let tiempoMaximo=30;
let tiempoRestante=tiempoMaximo;
let intervaloTiempo;

const barraTiempo=document.getElementById("barraTiempo");
const tiempoRestanteElem=document.getElementById("tiempoRestante");

//canvas
const canvas = document.getElementById("pizarra");
const ctx = canvas.getContext("2d");
const colorInput = document.getElementById("color");
const borrarBtn = document.getElementById("borrar");

//respuesta 
const mensaje = document.getElementById("mensaje");
const puntosJ1Elem = document.getElementById("puntosJ1");
const palabraElem = document.getElementById("palabraSecreta");
const mensajesDiv = document.getElementById("mensajes"); //contenedor del chat IA

//lista de palabras
let palabrasDisponibles = ["casa", "perro", "gato", "avión", "elefante", "ordenador", "pizza", "árbol"];

//palabra aleatoria al iniciar el juego
function nuevaPalabra(){
    clearInterval(intervaloIA); // Detener IA anterior
    palabra = palabrasDisponibles[Math.floor(Math.random() * palabrasDisponibles.length)];
    palabraElem.textContent = palabra;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    iniciarTemporizador();
    turnoIA();
}

//dibujo
let dibujado = false;
canvas.addEventListener("mousedown", () => dibujando = true);
canvas.addEventListener("mouseup", () => dibujando = false);
canvas.addEventListener("mousemove", dibujar);
colorInput.addEventListener("input", () => ctx.strokeStyle = colorInput.value);
borrarBtn.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    dibujado = false;
});

function dibujar(e){
    if (!dibujando) return;
    dibujado = true;
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
}

//temporizador
function iniciarTemporizador(){
    tiempoRestante=tiempoMaximo;
    barraTiempo.style.width="100%";
    tiempoRestanteElem.textContent=`Tiempo: ${tiempoRestante}s`;

    intervaloTiempo=setInterval(()=>{
        tiempoRestante--;
        let porcentaje=(tiempoRestante/tiempoMaximo)*100;
        barraTiempo.style.width=porcentaje + "%";
        tiempoRestanteElem.textContent=`Tiempo: ${tiempoRestante}s`;

        if(tiempoRestante<=0){
            clearInterval(intervaloTiempo);
            agregarMensajeIA("¡Tiempo agotado!");
            mensaje.textContent="Tiempo agotado, el jugador gana.";
            mensaje.className="mensaje correcto";
            puntosJ1++;
            setTimeout(nuevaPalabra, 1500);
        }
    }, 1000);
}

//mostrar mensajes en el chat IA
function agregarMensajeIA(texto) {
    const mensajeIA = document.createElement("div");
    mensajeIA.textContent = `IA: ${texto}`;
    mensajeIA.classList.add("mensajeIA");
    mensajesDiv.appendChild(mensajeIA);
    mensajesDiv.scrollTop = mensajesDiv.scrollHeight; //Auto-scroll
}

let palabrasIA=["casa","perro","gato","avión","elefante","ordenador","pizza","árbol"];
let intervaloIA;

function turnoIA(){
    clearInterval(intervaloIA); //detener intentos anteriores
    let intentosIA=0;

    intervaloIA=setInterval(()=>{
        if(tiempoRestante <=0){
            clearInterval(intervaloIA);
            agregarMensajeIA("¡Tiempo agotado!");
            mensaje.textContent="Tiempo agotado, el jugador gana.";
            mensaje.className="mensaje correcto";
            puntosJ1++;
            setTimeout(nuevaPalabra, 1500);
            return;
        }
        let palabraIA=palabrasIA[Math.floor(Math.random() * palabrasIA.length)];
        agregarMensajeIA(`"${palabraIA}"`);

        if(palabraIA.toLowerCase()=== palabra.toLowerCase()){
            mensaje.textContent="IA ha acertado";
            mensaje.className="mensaje correcto";
            agregarMensajeIA("¡Adiviné la palabra!");
            clearInterval(intervaloIA);
            setTimeout(nuevaPalabra,1500);
        }
        intentosIA++;
    },3000);
}

document.addEventListener("DOMContentLoaded", () => {
    nuevaPalabra();
});
