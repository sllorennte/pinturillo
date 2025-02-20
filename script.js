let turno=1;
let puntosJ1=0;
let puntosJ2=0;
let dibujando=false;
let palabra="";
let tiempoMaximo=30;
let tiempoRestante=tiempoMaximo;
let intervaloTiempo;

const barraTiempo=document.getElementById("barraTiempo");
const tiempoRestanteElem=document.getElementById("tiempoRestante")

// Canvas
const canvas = document.getElementById("pizarra");
const ctx = canvas.getContext("2d");
const colorInput = document.getElementById("color");
const borrarBtn = document.getElementById("borrar");

// Respuesta
const inputRespuesta = document.getElementById("respuesta");
const enviarBtn = document.getElementById("enviar");
const mensaje = document.getElementById("mensaje");

// Puntuaciones
const puntosJ1Elem = document.getElementById("puntosJ1");
const puntosJ2Elem = document.getElementById("puntosJ2");
const turnoElem = document.getElementById("turno");
const palabraElem = document.getElementById("palabraSecreta");

// Inicializar la palabra desde PHP
fetch("servidor.php")
    .then(res => res.json())
    .then(data => {
        palabra = data.palabra;
        palabraElem.textContent = turno === 1 ? palabra : "?????";
    });

// Dibujo
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

// Comprobación de respuesta
enviarBtn.addEventListener("click", ()=>{
    let respuesta = inputRespuesta.value.toLowerCase().trim();
    
    if (respuesta === palabra.toLowerCase()){
        mensaje.textContent = "¡Correcto!";
        mensaje.className = "mensaje correcto"; // Aplica estilo verde

        if (turno === 1) puntosJ2++;
        else puntosJ1++;

        setTimeout(reiniciarTurno, 1500); // Espera 1.5 segundos antes de cambiar de turno
    } else{
        mensaje.textContent= "Incorrecto, intenta de nuevo.";
        mensaje.className= "mensaje incorrecto"; // Aplica estilo rojo
    }

    inputRespuesta.value= ""; // Limpiar el campo de respuesta
});

// Cambio de turno y modo trampa
function reiniciarTurno(){
    if (!dibujado){
        mensaje.textContent = `Modo trampa activado. ${turno=== 1 ? "Jugador 1" : "Jugador 2"} pierde.`;
        return;
    }

    turno=turno === 1 ? 2 : 1;
    turnoElem.textContent=`Jugador ${turno}`;
    palabraElem.textContent=turno===1 ? palabra : "?????";
    puntosJ1Elem.textContent=puntosJ1;
    puntosJ2Elem.textContent=puntosJ2;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    dibujado=false;
}

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
            mensaje.textContent=`Tiempo agotado. Turno de ${turno === 1 ? "Jugador 2" : "Jugador 1"}`;
            mensaje.className="Mensaje incorrecto";
            setTimeout(reiniciarTurno, 1500);
        }
    }, 1000);

}

function reiniciarTurno(){
    clearInterval(intervaloTiempo);

    if(!dibujado){
        mensaje.textContent=`Modo trampa activado. ${turno === 1 ? "Jugador 1" : "Jugador 2"} pierde.`;
        return;
    }
    turno=turno===1 ? 2 : 1;
    turnoElem.textContent=`Jugador ${turno}`;
    palabraElem.textContent=turno=== 1 ? palabra : "????";
    puntosJ1Elem.textContent= puntosJ1;
    puntosJ2Elem.textContent= puntosJ2;
    ctx.clearRect(0,0, canvas.width, canvas.height);
    dibujado=false;

    iniciarTemporizador();
}

let palabrasIA=["casa","perro","gato","avión","elefante","ordenador","pizza","árbol"];
let intervaloIA;

function turnoIA(){
    let intentosIA=0;
    intervaloIA=setInterval(()=>{
        if(tiempoRestante <=0){
            clearInterval(intervaloIA);
            mensaje.textContent="Tiempo agotado, turno para el jugador 1";
            mensaje.className="Mensaje incorrecto";
            setTimeout(reiniciarTurno, 1500);
            return;
        }
        let palabraIA=listaPalabrasIA[Math.floor(Math.random() * listaPalabrasIA.length)];
        mensaje.textContent=`IA: "${palabraIA}"`;

        if(palabraIA.toLowerCase()=== palabra.toLowerCase()){
            mensaje.textContent="IA ha acertado";
            mensaje.className="mensaje correcto";
            puntosJ2++;
            clearInterval(intervaloIA);
            setTimeout(reiniciarTurno,1500);
        }
        intentosIA++;
    },3000)
}

function reiniciarTurno(){
    clearInterval(intervaloTiempo);
    clearInterval(intervaloIA);

    if(!dibujado){
        mensaje.textContent=`Modo trampa activado. ${turno === 1 ? "Jugador 1" : "IA"} pierde.`;
        return;  
    }
    turno=turno=== 1 ? 2 : 1;
    turnoElem.textContent=turno===1 ? "Jugador" : "IA"
    palabraElem.textContent=turno===1 ? palabra : "?????"
    puntosJ1Elem.textContent=puntosJ1;
    puntosJ2Elem.textContent=puntosJ2;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    dibujado=false;

    iniciarTemporizador();
    if(turno===2){
        setTimeout(turnoIA, 2000);
    }
}


document.addEventListener("DOMContentLoaded", iniciarTemporizador);