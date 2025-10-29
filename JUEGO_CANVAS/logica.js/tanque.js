///variables del juego
juego = {
    canvas: null,
    ctx: null, //contexto
    caratula: true,
    x: 0,
    y: 0,
    imagen: null,
    radianes: null, // variable para la rotacion del tanque
    teclaspulsadas: null, // tecla
    teclas_array: new Array(), // ambas variables de tipo array acumular teclas
    balas_array: new Array(),   // acumulacion de balas
    enemigos_array: new Array(), // array de enemigos
    colorEnemgios: ["blue", "red", "yellow", "black", "pink", "purple", "orange"], //lista o array de colores de enemigos
    colorBalas: "orange", //el color de la bala
    centroX: 0,  // centro en x para coordenadas
    centroY: 0,  //centro en y para coordenadas
    w: 0, // ancho y alto
    h: 0,
    puntos: 0, //variable para puntaje
    vidas: 3, //numero de vidas
    balas: 200,
    finDeJuego: false // boleano para el fin del juego
}

sonidos = {  ///objeto de sonidos
    boing: null,
    intro: null,
    fin: null,
    boom: null,
    disparo: null
}

//Constante
const BARRA = 32; //valor de un espacio en ascii o de tecla espacio, es decir que cada que disparemos vamos a recibir un valor 32 que es una bala "red"

// OBJETOS DEL JUEGO
function Bala(x, y, radianes) {
    //se ocupó this para que las propiedades las mantenga el objeto durante toda la ejecución debido a que esta refresca cada momento en vez de let
    this.x = x;
    this.y = y;
    this.w = 5;  //ANCHO DE LA BALA: contemplado 5 px
    this.radianes = radianes;
    this.velocidad = 8;   //la velocidad de la bala

    this.dibujar = function () { //metodo dentro de otro metodo para que se vaya dibujando la bala
        juego.ctx.save();
        juego.ctx.fillStyle = juego.colorBalas;
        this.x += Math.cos(this.radianes) * this.velocidad; //se guardan las coordenadas exactas por donde se anda moviendo la bala
        this.y += Math.sin(this.radianes) * this.velocidad;
        juego.ctx.fillRect(this.x, this.y, this.w, this.w); //ayuda a dibujar la bala donde se le pasa la coordenada de las x y coordenada en y 
        juego.ctx.restore(); // restablece estados de dibujo y save guarda el estado
    }
}

function Tanque(x, y, radio) {
    this.x = x;
    this.y = y;
    this.radio = radio; //posicion del tanque 
    this.escala = 1; //escala
    this.rotacion = 0; //la rotacion del tanque
    this.w = 0; //ancho
    this.h = 0; //alto

    this.dibujar = function () {
        juego.imagen.src = "imagenes/tanque.png";
        let self = this;
        juego.imagen.onload = function () {
            self.w = juego.imagen.width;
            self.h = juego.imagen.height;
            let ww = self.w / 2;
            let hh = self.h / 2;
            juego.ctx.drawImage(juego.imagen, juego.centroX - ww, juego.centroY - hh);
        }
    } //metodo dentro de otro metodo dibujar
}

function enemigos(x, y) {
    this.n = 0;
    this.x = x;
    this.y = y;
    this.inicioX = x;
    this.inicioY = y;
    this.estado = 1; //revisa el estado del enemigo 
    this.r = 20;
    this.w = this.r * 2 //ancho del enemigo
    this.vive = true; //variable booleana para ver si vive o muere el enemigo
    this.velocidad = .5 + Math.random(); //para generar velocidades aleatorias
    this.color = juego.colorEnemgios[Math.floor(Math.random() * juego.colorEnemgios.length)]; //sacar un color distinto a los enemigos

    this.dibujar = function () { //metodo dentro de otro metodo dibujar
        if (this.n < 100 && this.vive) {
            juego.ctx.save(); //guardamos el contexto
            juego.ctx.beginPath(); //iniciamos el trazado
            juego.ctx.fillStyle = this.color; //darle color al enemigo
            juego.ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI); //pos o orientacion x, y, radio, y como va a ser el enemigo que seria un circulo o esfera por el 2*pi
            juego.ctx.fill();
            this.n += this.velocidad; //cada enemigo tendra una velocidad aleatoria y disntinto.
            this.x = juego.centroX * this.n / 100 + this.inicioX * (100 - this.n) / 100;
            this.y = juego.centroY * this.n / 100 + this.inicioY * (100 - this.n) / 100;
            juego.ctx.restore();
        }
    }
}

//FUNCIONES PARA INICIO DE JUEGO, ENTRE OTROS
const caratula = () => {
    let imagen = new Image();
    imagen.src = "imagenes/caratula.jpg";
    imagen.onload = () => {
        juego.ctx.drawImage(imagen, 0, 0, 700, 500);
    }
}

const seleccionar = (e) => {
    if (juego.caratula) { //verifica que cuando la caratula este en true nos dara inicio al juego
        inicio();
    }
}

const inicio = () => { //funcion flecha
    juego.ctx.clearRect(0, 0, juego.canvas.width, juego.canvas.height); //Limpia la area del canvas que especificamos
    juego.caratula = false; //cambia a false caratula para quitarla 
    juego.tanque.dibujar();
    setTimeout(lanzaEnemigo, 1000); // se lanza un enemigo cada un segundo
    animar();
}

const lanzaEnemigo = () => { //cada vez que se salen esta funcion genera un enemigo, si se llama muchas veces genera demasiados enemgios
    if (juego.finDeJuego) return; //  Detenemos generación si el juego terminó

    let lado = Math.floor(Math.random() * 4) + 1;  // genera un numero ramdom del 1 al 4
    let x, y;

    if (lado == 1) {
        x = -10;
        y = Math.floor(Math.random() * juego.h); //genera un numero alatorio positivo por la izquierda
    } else if (lado == 2) { // genera un numero aleatorio positivo por la parte de arriba
        y = -10;
        x = Math.floor(Math.random() * juego.w);
    } else if (lado == 3) {  //genera por los lados de la posicion del enemigo en toda la derecha
        x = juego.w + Math.random() * 10;
        y = Math.floor(Math.random() * juego.h);
    } else if (lado == 4) {
        x = Math.floor(Math.random() * juego.w);
        y = juego.h + Math.random() * 10;
    }

    juego.enemigos_array.push(new enemigos(x, y)); //metemos los enemigos al array dependiendo de los if anteriores
    setTimeout(lanzaEnemigo, 2000); //un enemigo se genera cada dos segundos
}

const animar = () => {
    if (juego.finDeJuego) return; // Detiene el bucle si el juego terminó
    requestAnimationFrame(animar); ///refresca al mismo metodo y a su vez llamando a verificar y pintar
    verificar();
    pintar();
    colisiones();
}

// COLISIONES 
const colisiones = () => {
    juego.enemigos_array.map((enemigo, i) => {
        juego.balas_array.map((bala, j) => {
            // detecccion de colisiones 
            if (enemigo != null && bala != null) { //verificamos los dos array tienen balas o enemgios 
                // Calculamos la distancia entre el centro del enemigo y la bala
                let dx = bala.x - enemigo.x;
                let dy = bala.y - enemigo.y;
                let distancia = Math.sqrt(dx * dx + dy * dy);

                // Si la distancia es menor al radio, hay colisión
                if (distancia < enemigo.r) {
                    juego.enemigos_array[i] = null;  //se pone null para eliminar el enemigo
                    juego.balas_array[j] = null;   //se pone null para que la bala desaparezca
                    juego.puntos += 10;
                    sonidos.boing.play();
                }
            }
        });
        if (enemigo != null) {
            if (enemigo.n > 95) {
                juego.enemigos_array[i] = null;
                juego.vidas--;
                sonidos.boom.play();
                if (juego.vidas <= 0) {
                    GameOver();
                }
            }
        }
    });
}

const GameOver = () => {
    juego.finDeJuego = true; //  Marcamos el fin del juego
    sonidos.fin.play(); //si hay sonido final

    // Limpiamos y mostramos mensaje
    juego.ctx.clearRect(0, 0, juego.canvas.width, juego.canvas.height);
    juego.ctx.save();
    juego.ctx.fillStyle = "white";
    juego.ctx.font = "bold 40px Courier";
    juego.ctx.textAlign = "center";
    juego.ctx.fillText("¡GAME OVER!", juego.canvas.width / 2, juego.canvas.height / 2 - 20);
    juego.ctx.font = "bold 20px Courier";
    juego.ctx.fillText("PUNTOS: " + juego.puntos, juego.canvas.width / 2, juego.canvas.height / 2 + 20);
    juego.ctx.restore();

    // Mostrar botón para reiniciar
    const btn = document.createElement("button");
    btn.innerText = "Reiniciar juego";
    btn.style.position = "absolute";
    btn.style.left = "50%";
    btn.style.top = "60%";
    btn.style.transform = "translate(-50%, -50%)";
    btn.style.padding = "10px 20px";
    btn.style.fontSize = "18px";
    btn.style.cursor = "pointer";
    btn.style.borderRadius= "10";
    document.body.appendChild(btn);

    btn.onclick = () => {
        document.body.removeChild(btn);
        location.reload(); // reinicia todo
    };
}

// mensaje de victoria
const JuegoGanado = () => {
    juego.finDeJuego = true; // Detenemos el juego
    sonidos.intro.play(); // Sonido de victoria si se desea

    // Limpiamos el canvas
    juego.ctx.clearRect(0, 0, juego.canvas.width, juego.canvas.height);
    juego.ctx.save();
    juego.ctx.fillStyle = "white";
    juego.ctx.font = "bold 40px Courier";
    juego.ctx.textAlign = "center";
    juego.ctx.fillText("¡FELICIDADES! ", juego.canvas.width / 2, juego.canvas.height / 2 - 40);
    juego.ctx.font = "bold 25px Courier";
    juego.ctx.fillText("¡Has ganado el juego!", juego.canvas.width / 2, juego.canvas.height / 2);
    juego.ctx.fillText("PUNTOS: " + juego.puntos, juego.canvas.width / 2, juego.canvas.height / 2 + 40);
    juego.ctx.restore();

    // Botón para volver a jugar
    const btn = document.createElement("button");
    btn.innerText = "Volver a jugar";
    btn.style.position = "absolute";
    btn.style.left = "50%";
    btn.style.top = "65%";
    btn.style.transform = "translate(-50%, -50%)";
    btn.style.padding = "10px 20px";
    btn.style.fontSize = "18px";
    btn.style.cursor = "pointer";
    btn.style.borderRadius= "10px";
    document.body.appendChild(btn);

    btn.onclick = () => {
        document.body.removeChild(btn);
        location.reload();
    };
}

const verificar = () => {
    if (juego.teclas_array[BARRA]) {  //aqui verificamos si tocamos la barra y si se toca se crea la bala para que sea disparada
       
       if(juego.balas> 0){
        juego.balas_array.push(
            new Bala(
                juego.centroX + Math.cos(juego.radianes) * 35,
                juego.centroY + Math.sin(juego.radianes) * 35,
                juego.radianes
            )
        );
    
        juego.balas--;
        juego.teclas_array[BARRA] = false;
        sonidos.disparo.play();
     };
    }
}

const pintar = () => {
    juego.ctx.clearRect(0, 0, juego.canvas.width, juego.canvas.height);
    marcador();
    juego.ctx.save();
    juego.ctx.translate(juego.centroX, juego.centroY);
    juego.ctx.scale(juego.tanque.escala, juego.tanque.escala);
    juego.ctx.rotate(juego.radianes);
    juego.ctx.drawImage(juego.imagen, -juego.imagen.width / 2, -juego.imagen.height / 2);
    juego.ctx.restore();

    // Dibuja todas las balas activas
    for (let i = 0; i < juego.balas_array.length; i++) {
        if (juego.balas_array[i] != null) {
            juego.balas_array[i].dibujar();
        }
    }

    ///array de enemigos
    juego.enemigos_array.map((enemigo, i) => { //alias del array, equivalente a un bucle for
        if (enemigo != null) { //verifico si dentro del array hay enemgios
            enemigo.dibujar(); //para pintar enemigo
        }
    });
}

const ajustar = (xx, yy) => {
    const pos = juego.canvas.getBoundingClientRect();
    const x = xx - pos.left;
    const y = yy - pos.top;
    return { x, y };
}

const mensaje = (cadena, x, y) => {
    let medio = (juego.canvas.width - x) / 2;
    juego.ctx.save();
    juego.ctx.fillStyle = "black";
    juego.ctx.strokeStyle = "black";
    juego.ctx.textBaseline = "top";
    juego.ctx.font = "bold 20px Courier";
    juego.ctx.textAlign = "center";
    juego.ctx.clearRect(0, 0, juego.canvas.width, juego.canvas.height);
    juego.ctx.fillText(cadena, x + medio, y);
    juego.ctx.restore();
}

const marcador = () => {
    juego.ctx.save();
    juego.ctx.fillStyle = "white";
    juego.ctx.clearRect(0, 0, juego.canvas.width, 40);
    juego.ctx.font = "bold 20px Courier";
    juego.ctx.fillText(
        `SCORE: ${juego.puntos} VIDAS: ${juego.vidas} BALAS: ${juego.balas}`, 10, 20
    );

    // Si el jugador supera los 200 puntos, gana
    if (juego.puntos >= 200) {
        JuegoGanado();
    }

    juego.ctx.restore();
}

//listeners:
document.addEventListener("mousemove", function (e) {  //una funcion de listen para el mouse
    var { x, y } = ajustar(e.clientX, e.clientY); //e.client saca las coordenadas de los x,y
    var dirx = x - juego.centroX;
    var diry = y - juego.centroY;
    juego.radianes = Math.atan2(diry, dirx); //determina el angulo correcto de cada movimiento
});

window.requestAnimationFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function (callback) { window.setTimeout(callback, 17); }
})();

// Evento de teclado  
document.addEventListener("keydown", function (e) {
    juego.teclaspulsadas = e.keyCode;
    juego.teclas_array[juego.teclaspulsadas] = true;
});

window.onload = function () {
    juego.canvas = document.getElementById("canvas");
    if (juego.canvas && juego.canvas.getContext) {
        juego.ctx = juego.canvas.getContext("2d");
        if (juego.ctx) {
            sonidos.boing = document.getElementById("boing");
            sonidos.disparo = document.getElementById("disparo");
            sonidos.intro = document.getElementById("intro");
            sonidos.fin = document.getElementById("fin");
            sonidos.boom = document.getElementById("boom");

            juego.w = juego.canvas.width;
            juego.h = juego.canvas.height;
            juego.centroX = juego.w / 2;
            juego.centroY = juego.h / 2;
            juego.imagen = new Image();
            juego.tanque = new Tanque(juego.centroX, juego.centroY);
            caratula();
            juego.canvas.addEventListener("click", seleccionar, false);
        } else {
            alert("NO cuentas con CANVAS");
        }
    }
}
