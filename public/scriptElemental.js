const sectionAtaque = document.getElementById("SeleccionarAtaque")
const sectionReiniciar = document.getElementById("ReiniciarJuego")
const botonMascota = document.getElementById("boton-seleccionar")
const botonReiniciar = document.getElementById("boton-reiniciar")

const sectionMascota = document.getElementById("SeleccionarMascota")
const spanMascotaJugador = document.getElementById("mascota-jugador")

const spanMascotaEnemigo = document.getElementById("mascota-enemigo")

const spanVictoriasJugador = document.getElementById("victorias-jugador")
const spanVictoriasEnemigo = document.getElementById("victorias-enemigo")

const sectionMensajes = document.getElementById("resultado")
const ataquesDelJugador = document.getElementById("ataques-del-jugador")
const ataquesDelEnemigo = document.getElementById("ataques-del-enemigo")
const contenedorTarjetas = document.getElementById("contenedor-tarjetas")
const contenedorAtaques = document.getElementById("contenedor-ataques")

const sectionCanvasJuego = document.getElementById("canvas-juego")
const mapaJuego = document.getElementById("mapa-juego")

const flechasDispositivo = document.getElementById("flechas")
const sectionMenuPrincipal = document.getElementById("menu-principal")
const botonJugar = document.getElementById("boton-jugar")
const quitarJuego = document.getElementById("quitar-juego")
const btnArriba = document.getElementById("b-arriba")
const btnAbajo = document.getElementById("b-abajo")
const btnIzquierda = document.getElementById("b-izquierda")
const btnDerecha = document.getElementById("b-derecha")
const btnCreditos = document.getElementById("boton-creditos")
const pantallaCreditos = document.getElementById("pantalla-creditos")
let jugadorId = null
let enemigoId = null
let personajes = []
let personajesEnemigos = []
let ataqueJugador = []
let ataqueEnemigo = []
let opcionDePersonajes
let mascota1
let mascota2
let mascota3
let guardarMascota
let miPersonaje
let ataquesPersonajeEnemigo = []
let ataqueDinamicoJugador = []
let botonFuego
let botonAgua
let botonTierra
let botones = []
let indexAtaqueJugador
let indexAtaqueEnemigo
let victoriasJugador = 0
let victoriasEnemigo = 0
let vidasJugador = 3
let vidasEnemigo = 3
let lienzo = mapaJuego.getContext("2d")
let intervalo
let fondoBatalla = new Image()
fondoBatalla.src = "./assets/fondo-batalla.png" 
let buscarAltura
let anchoDelMapa = window.innerWidth - 20
const anchoMaximoMapa = 500
let opcionDeAtaques

if (anchoDelMapa > anchoMaximoMapa) {
    anchoDelMapa = anchoMaximoMapa - 20
}

buscarAltura = anchoDelMapa * 600 / 800

mapaJuego.width = anchoDelMapa
mapaJuego.height = buscarAltura

class Personaje {
    constructor(nombre, foto, vidas, fotoCara, id = null) {
        this.id = id
        this.nombre = nombre
        this.foto = foto
        this.fotoCara = fotoCara
        this.vidas = vidas
        this.ataques = []
        this.ancho = 50
        this.alto = 50
        this.x = aleatorio(0, mapaJuego.width - this.ancho)
        this.y = aleatorio(0, mapaJuego.height- this.alto)
        this.mascotaFoto = new Image()
        this.mascotaFoto.src = foto
        this.fotoCara = new Image()
        this.fotoCara.src = fotoCara
        this.velocidadX = 0
        this.velocidadY = 0
    }

    pintarMascota() {
        lienzo.drawImage(
            this.fotoCara,
            this.x,
            this.y,
            this.ancho,
            this.alto,
        )
    }
}

let aquanut = new Personaje("Aquanut", "./assets/aquanut-juego.png", 3, "./assets/aquanut-cara.png")

let drakon = new Personaje("Drakon", "./assets/drakon-personaje.png", 3, "./assets/drakon-cara.png")

let selvatron = new Personaje("Selvatron", "./assets/Selvatron-personaje.png", 3, "./assets/selvatron-cara.png")

const aquanut_ataques = [
    {nombre: "💧", id: "boton-agua"},
    {nombre: "💧", id: "boton-agua"},
    {nombre: "💧", id: "boton-agua"},
    {nombre: "🔥", id: "boton-fuego"},
    {nombre: "🌱", id: "boton-tierra"},
]

const drakon_ataques = [
    {nombre: "🔥", id: "boton-fuego"},
    {nombre: "🔥", id: "boton-fuego"},
    {nombre: "🔥", id: "boton-fuego"},
    {nombre: "💧", id: "boton-agua"},
    {nombre: "🌱", id: "boton-tierra"},
]

const selvatron_ataques = [
    {nombre: "🌱", id: "boton-tierra"},
    {nombre: "🌱", id: "boton-tierra"},
    {nombre: "🌱", id: "boton-tierra"},
    {nombre: "🔥", id: "boton-fuego"},
    {nombre: "💧", id: "boton-agua"},
]

aquanut.ataques.push(...aquanut_ataques)

drakon.ataques.push(...drakon_ataques)

selvatron.ataques.push(...selvatron_ataques)

personajes.push(aquanut, drakon, selvatron)

function iniciarJuego() {
    unirseJuego()
    sectionMenuPrincipal.style.display = "flex"
    sectionMascota.style.display = "none"
    sectionAtaque.style.display = "none"
    sectionReiniciar.style.display = "none"
    sectionCanvasJuego.style.display = "none"
    pantallaCreditos.style.display = "none"



    personajes.forEach((personaje) => {
        opcionDePersonajes = `
        <input type="radio" id=${personaje.nombre} name="mascota">
        <label class="tarjeta-de-elemental" for=${personaje.nombre}>
            <p>${personaje.nombre}</p>
            <img src=${personaje.foto} alt="Error al cargar!">
        </label>
        `

        contenedorTarjetas.innerHTML += opcionDePersonajes

        mascota1 = document.getElementById("Aquanut")
        mascota2 = document.getElementById("Drakon")
        mascota3 = document.getElementById("Selvatron")
    })

    botonJugar.addEventListener("click", empezarJuego)
    quitarJuego.addEventListener("click", cerrarJuego)
    btnCreditos.addEventListener("click", mostrarCreditos)

    botonMascota.addEventListener("click", seleccionarMascota)

    botonReiniciar.addEventListener("click", reiniciarJuego)

}

function dispositivoMovil() {
        const pantallaTouch = navigator.maxTouchPoints > 0 || "ontouchstart" in window;
        
        return pantallaTouch
    }
    if (dispositivoMovil()) {
        flechasDispositivo.style.display = "flex"
    } else {
        flechasDispositivo.style.display = "none"
    }



function mostrarCreditos() {
    sectionMenuPrincipal.style.display = "none"
    pantallaCreditos.style.display = "flex"
}

function unirseJuego() {
    fetch("http://192.168.1.17:8080/unirse")
        .then(function (res) {
            if (res.ok) {
                res.text()
                    .then(function (respuesta) {
                        console.log(respuesta)
                        console.log(res)
                        jugadorId = respuesta
                    })
            }
        })
}

function empezarJuego() {
    sectionMenuPrincipal.style.display = "none"
    sectionMascota.style.display = "flex"
    pantallaCreditos.style.display = "none"
}

function cerrarJuego() {
    window.close();
}

function seleccionarMascota() {
    sectionMascota.style.display = "none"

    if(mascota1.checked) {
        sectionCanvasJuego.style.display = "flex"
        spanMascotaJugador.innerHTML = mascota1.id
        guardarMascota = mascota1.id
    } else if (mascota2.checked) {
        sectionCanvasJuego.style.display = "flex"
        spanMascotaJugador.innerHTML = mascota2.id
        guardarMascota = mascota2.id
    } else if (mascota3.checked) {
        sectionCanvasJuego.style.display = "flex"
        spanMascotaJugador.innerHTML = mascota3.id
        guardarMascota = mascota3.id
    } else {
        alert("Selecciona una mascota, porfavor")
        sectionMascota.style.display = "flex"
        sectionAtaque.style.display = "none"
        sectionCanvasJuego.style.display = "none"
    }

    mascotaSeleccionada(guardarMascota)

    extraerAtaques(guardarMascota)
    iniciarMapa()
}

function mostrarCreditos() {
    sectionMenuPrincipal.style.display = "none"

}

function mascotaSeleccionada(guardarMascota) {
    fetch(`http://192.168.1.17:8080/elemental/${jugadorId}`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            elemental: guardarMascota
        })
    
    })
}

function iniciarMapa() {
    miPersonaje = obtenerObjetoMascota(guardarMascota)
    intervalo = setInterval(pintarMascotaYJuego, 100)
    window.addEventListener("keydown", teclas)
    window.addEventListener("keyup", detenerMovimiento)
}

//funcion para extraer los ataques unicos de los personajes renderizados, AtaquesDPP = AtaquesDinamicosPorPersonaje
function extraerAtaques(guardarMascota) {
    let ataquesDPP = []
    for (let i = 0; i < personajes.length; i++) {
        if (guardarMascota === personajes[i].nombre) {
            ataquesDPP = personajes[i].ataques
        }
    }
    mostrarAtaques(ataquesDPP)
}

function mostrarAtaques(ataquesDPP) {
    ataquesDPP.forEach((ataque) => {
        opcionDeAtaques = `
        <button id=${ataque.id} class="boton-ataque BAtaque">${ataque.nombre}</button>
        `
        contenedorAtaques.innerHTML += opcionDeAtaques
    })

    botonFuego = document.getElementById("boton-fuego")
    botonAgua= document.getElementById("boton-agua")
    botonTierra = document.getElementById("boton-tierra")
    botones = document.querySelectorAll(".BAtaque")
}

function secuenciaAtaque() {
    botones.forEach((boton) => {
        boton.addEventListener("click", (e) => {
            if (e.target.textContent === "🔥") {
                ataqueDinamicoJugador.push("FUEGO")
                indexAtaqueJugador = ("FUEGO🔥")
                console.log(ataqueDinamicoJugador)
                boton.style.background = "orange"
                boton.disabled = true
            } else if (e.target.textContent === "💧") {
                ataqueDinamicoJugador.push("AGUA")
                indexAtaqueJugador = ("AGUA💧")
                console.log(ataqueDinamicoJugador)
                boton.style.background = "orange"
                boton.disabled = true
            } else {
                ataqueDinamicoJugador.push("TIERRA")
                indexAtaqueJugador = ("TIERRA🌱")
                console.log(ataqueDinamicoJugador)
                boton.style.background = "orange"
                boton.disabled = true
            }
            if (ataqueDinamicoJugador.length === 5) {
                enviarAtaques()
            }
        })
    })
}

function seleccionarMascotaEnemigo(enemigo) {
    spanMascotaEnemigo.innerHTML = enemigo.nombre
    ataquesPersonajeEnemigo = enemigo.ataques
    secuenciaAtaque()
}

function enviarAtaques() {
    fetch (`http://192.168.1.17:8080/elemental/${jugadorId}/ataques`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            ataques: ataqueDinamicoJugador
        })
    })
    intervalo = setInterval(obtenerAtaques, 50)
}

function obtenerAtaques() {
    fetch(`http://192.168.1.17:8080/elemental/${enemigoId}/ataques`)
        .then(function (res) {
            if(res.ok) {
                res.json()
                    .then(function ({ ataques }) {
                        if (ataques.length === 5) {
                            ataqueEnemigo = ataques
                            combate()
                        }
                    })
            }
        })
}

function ataqueAleatorioEnemigo() {
    let ataqueAleatorio = aleatorio(0, ataquesPersonajeEnemigo.length - 1)

    if (ataqueAleatorio === 0 || ataqueAleatorio === 1) {
        ataqueEnemigo.push("FUEGO")
        indexAtaqueEnemigo = "FUEGO🔥"
        console.log(ataqueEnemigo)
    } else if (ataqueAleatorio === 2 || ataqueAleatorio === 3) {
        ataqueEnemigo.push("AGUA")
        indexAtaqueEnemigo = "AGUA💧"
        console.log(ataqueEnemigo)
    } else {
        ataqueEnemigo.push("TIERRA")
        indexAtaqueEnemigo = "TIERRA🌱"
        console.log(ataqueEnemigo)
    }
    iniciarPelea()
}

function iniciarPelea() {
    if (ataqueDinamicoJugador.length === 5) {
        combate()
    }
}
function indexAmbosJugadores(jugador, enemigo) {
    indexAtaqueJugador = ataqueDinamicoJugador[jugador]
    indexAtaqueEnemigo = ataqueEnemigo[enemigo]
}

function combate() {
    clearInterval(intervalo)

    for (let index = 0; index < ataqueDinamicoJugador.length; index++) {
        if(ataqueDinamicoJugador[index] === ataqueEnemigo[index]) {
            indexAmbosJugadores(index, index)
            crearMensaje("EMPATE")
        } else if (ataqueDinamicoJugador[index] === "FUEGO" && ataqueEnemigo[index] == "TIERRA") {
            indexAmbosJugadores(index, index)
            crearMensaje("GANASTE")
            victoriasJugador++
            spanVictoriasJugador.innerHTML = victoriasJugador
        } else if (ataqueDinamicoJugador[index] === "AGUA" && ataqueEnemigo[index] === "FUEGO") {
            indexAmbosJugadores(index, index)
            crearMensaje("GANASTE")
            victoriasJugador++
            spanVictoriasJugador.innerHTML = victoriasJugador
        } else if (ataqueDinamicoJugador[index] === "TIERRA" && ataqueEnemigo[index] === "AGUA") {
            indexAmbosJugadores(index, index)
            crearMensaje("GANASTE")
            victoriasJugador++
            spanVictoriasJugador.innerHTML = victoriasJugador
        } else {
            indexAmbosJugadores(index, index)
            crearMensaje("PERDISTE")
            victoriasEnemigo++
            spanVictoriasEnemigo.innerHTML = victoriasEnemigo
        }
    }

    revisarVictorias()
}

function revisarVictorias() {
    if (victoriasJugador == victoriasEnemigo) {
        mensajeFinal("Mmmm mismas victorias? supongo que fue un empate...") 
    } else if (vidasJugador > victoriasEnemigo) {
        mensajeFinal("Tuviste mas victorias que el enemigo, ganaste😀")
    } else {
        mensajeFinal("El rival te ganó😭 puedes vencerlo en la siguiente?")
    }
}

function crearMensaje(resultado) {
    let nuevoAtaqueDelJugador = document.createElement("p")
    let nuevoAtaqueDelEnemigo = document.createElement("p")

    sectionMensajes.innerHTML = resultado
    nuevoAtaqueDelJugador.innerHTML = indexAtaqueJugador
    nuevoAtaqueDelEnemigo.innerHTML = indexAtaqueEnemigo

    ataquesDelJugador.appendChild(nuevoAtaqueDelJugador)
    ataquesDelEnemigo.appendChild(nuevoAtaqueDelEnemigo)
}


function mensajeFinal(resultadoFinal) {

    let nuevoMensajeBatalla = document.createElement("p")

    sectionMensajes.innerHTML = resultadoFinal

    sectionMensajes.appendChild(nuevoMensajeBatalla)

    sectionReiniciar.style.display = "flex"
}

function reiniciarJuego() {
    location.reload()
}


function aleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function pintarMascotaYJuego() {
    miPersonaje.x = miPersonaje.x + miPersonaje.velocidadX
    miPersonaje.y = miPersonaje.y + miPersonaje.velocidadY
    lienzo.clearRect(0,0, mapaJuego.width, mapaJuego.height)
    lienzo.drawImage(
        fondoBatalla,
        0,
        0,
        mapaJuego.width,
        mapaJuego.height,
    )
    
    miPersonaje.pintarMascota()

    enviarPosicion(miPersonaje.x, miPersonaje.y)

    personajesEnemigos.forEach(function (personaje) {
        personaje.pintarMascota()
        colisiones(personaje)
    })
}

function enviarPosicion(x, y) { 
    fetch(`http://192.168.1.17:8080/elemental/${jugadorId}/posicion`, { 
        method: "post", 
        headers: { 
            "Content-Type": "application/json" 
        }, 
        body: JSON.stringify({ 
            x, 
            y 
        }) 
    }) 
      .then(function (res) { 
            if (res.ok) { 
                res.json() 
                .then(function ({ enemigos }) { 
                    console.log(enemigos) 
                    personajesEnemigos = enemigos.map(function (enemigo) { 
                        if (enemigo.mascota != undefined) { 
                            let mascotaEnemiga = null 
                            const mascotaNombre = enemigo.mascota.nombre || ""
                            if (mascotaNombre === "Aquanut") { 
                                mascotaEnemiga = new Personaje("Aquanut", "./assets/aquanut-juego.png", 3, "./assets/aquanut-cara.png", enemigo.id) 
                            } else if (mascotaNombre === "Drakon") { mascotaEnemiga = new Personaje("Drakon", "./assets/drakon-personaje.png", 3, "./assets/drakon-cara.png", enemigo.id) 

                            } else if (mascotaNombre === "Selvatron") { mascotaEnemiga = new Personaje("Selvatron", "./assets/Selvatron-personaje.png", 3, "./assets/selvatron-cara.png", enemigo.id) 
                            } 
                            mascotaEnemiga.x = enemigo.x 
                            mascotaEnemiga.y = enemigo.y 
                            return mascotaEnemiga 
                            } 
                        }) 
                    }) 
                } 
            }) 
        }

function teclas(event) {
    switch (event.key) {
        case "ArrowUp":
        case "W":
        case "w":
            moverArriba()
            break
        case "ArrowLeft":
        case "A":
        case "a":
            moverIzquierda()
            break
        case "ArrowDown":
        case "S":
        case "s":
            moverAbajo()
            break
        case "ArrowRight":
        case "D":
        case "d":
            moverDerecha()
            break
        default:
            break
    }
}

function moverArriba() {
    miPersonaje.velocidadY = -5
}

function moverAbajo() {
    miPersonaje.velocidadY = 5
}

function moverIzquierda() {
    miPersonaje.velocidadX = -5
}

function moverDerecha() {
    miPersonaje.velocidadX = 5
}

function detenerMovimiento() {
    miPersonaje.velocidadX = 0
    miPersonaje.velocidadY = 0
}

btnArriba.addEventListener("touchstart", e => {
  e.preventDefault()
  moverArriba()
})

btnArriba.addEventListener("touchend", e => {
  e.preventDefault()
  detenerMovimiento()
})

btnAbajo.addEventListener("touchstart", e => {
  e.preventDefault()
  moverAbajo()
})

btnAbajo.addEventListener("touchend", e => {
  e.preventDefault()
  detenerMovimiento()
})

btnIzquierda.addEventListener("touchstart", e => {
  e.preventDefault()
  moverIzquierda()
})

btnIzquierda.addEventListener("touchend", e => {
  e.preventDefault()
  detenerMovimiento()
})

btnDerecha.addEventListener("touchstart", e => {
  e.preventDefault()
  moverDerecha()
})

btnDerecha.addEventListener("touchend", e => {
  e.preventDefault()
  detenerMovimiento()
})

function obtenerObjetoMascota() {
    for (let i = 0; i < personajes.length; i++) {
        if (guardarMascota === personajes[i].nombre) {
            return personajes[i]
        }
    }
}

function colisiones(enemigo) {
    const arribaMascota = miPersonaje.y
    const abajoMascota = miPersonaje.y + miPersonaje.alto
    const derechaMascota = miPersonaje.x + miPersonaje.ancho
    const izquierdaMascota = miPersonaje.x

    const arribaEnemigo = enemigo.y
    const abajoEnemigo = enemigo.y + enemigo.alto
    const derechaEnemigo = enemigo.x + enemigo.ancho
    const izquierdaEnemigo = enemigo.x

    if(
        abajoMascota < arribaEnemigo ||
        arribaMascota > abajoEnemigo ||
        derechaMascota < izquierdaEnemigo ||
        izquierdaMascota > derechaEnemigo
    ) {
        return
    }
    detenerMovimiento()
    clearInterval(intervalo)
    seleccionarMascotaEnemigo(enemigo)
    console.log("Hubo colision");

    enemigoId = enemigo.id
    sectionCanvasJuego.style.display = "none"
    sectionAtaque.style.display = "flex"
}

window.addEventListener("load", iniciarJuego)