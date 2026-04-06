// referencias del html
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
const regresarCreditos = document.getElementById("regresar-creditos")

const ENV = "dev" // separa entornos dev y prod para hacer pruebas locales y despliegue en render.com

//detecta automaciamente el entorno y asigna la URL del backend según corresponda
const API_URL = window.location.hostname === "localhost"
    ? "http://192.168.1.17:8080"
    : "https://elemental-754y.onrender.com"

// variables globales
let jugadorId = null // id de cada jugador
let enemigoId = null // id de cada enemigo
let personajes = [] // personajes disponibles para jugar
let personajesEnemigos = [] // todos los personajes enemigos que se van a mostrar en el mapa
let ataqueJugador = []
let ataqueEnemigo = []
let opcionDePersonajes
let mascota1
let mascota2
let mascota3
let guardarMascota
let miPersonaje //personaje del jugador
let ataquesPersonajeEnemigo = [] // botones de ataque dinamicos, segun el personaje elegido por el enemigo
let ataqueDinamicoJugador = [] // botones de ataque dinamicos, segun el personaje elegido por el jugador
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
let lienzo = mapaJuego.getContext("2d") // el mapa
let intervalo // indica cada cuanto tiempo se realizan ciertas acciones, como pintar el mapa, obtener ataques del enemigo, etc
let fondoBatalla = new Image()
fondoBatalla.src = "./assets/fondo-batalla.png" 
let buscarAltura
let anchoDelMapa = window.innerWidth - 20
const anchoMaximoMapa = 500
let opcionDeAtaques
let enMapa = false // controla si el jugador esta en el mapa para el sistema de desconexión por inactividad
let ultimoMovimiento = Date.now() //variables globales

if (anchoDelMapa > anchoMaximoMapa) {
    anchoDelMapa = anchoMaximoMapa - 20
}                                      

buscarAltura = anchoDelMapa * 600 / 800

mapaJuego.width = anchoDelMapa
mapaJuego.height = buscarAltura

//el constructor de cada personaje, con sus atributos y métodos para pintar su imagen en el mapa
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

//funcion de clase, pinta el personaje y sus coordenadas
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

//crea los personajes jugables
let aquanut = new Personaje("Aquanut", "./assets/aquanut-juego.png", 3, "./assets/aquanut-cara.png") 

let drakon = new Personaje("Drakon", "./assets/drakon-personaje.png", 3, "./assets/drakon-cara.png")

let selvatron = new Personaje("Selvatron", "./assets/Selvatron-personaje.png", 3, "./assets/selvatron-cara.png")

// conjunto de ataques de cada personaje
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

// asigna los ataques a cada personaje
aquanut.ataques.push(...aquanut_ataques)

drakon.ataques.push(...drakon_ataques)

selvatron.ataques.push(...selvatron_ataques)

// lista qur guarda todos los personajes
personajes.push(aquanut, drakon, selvatron)

//funcion que cancela todas las funciones y el pintado de un personaje que ya no esta en el juego
function desconectarJugador() {
    console.log("Jugador desconectado completamente")
    enMapa = false
    
    // recibe la orden del servidor para ejecutar la funcion
    fetch(`${API_URL}/disconnect`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jugadorId: jugadorId })
    })
    
    lienzo.clearRect(0, 0, mapaJuego.width, mapaJuego.height)
    clearInterval(intervalo)
    window.removeEventListener("keydown", teclas)
    window.removeEventListener("keyup", detenerMovimiento)
    
    sectionCanvasJuego.style.display = "none"
    sectionMenuPrincipal.style.display = "flex"
    alert("Desconectado por inactividad")
}

// inicia toda la logica basica del juego
function iniciarJuego() {
    enMapa = false
    unirseJuego()

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

    sectionMenuPrincipal.style.display = "flex"
    sectionMascota.style.display = "none"
    sectionAtaque.style.display = "none"
    sectionReiniciar.style.display = "none"
    pantallaCreditos.style.display = "none"
    sectionCanvasJuego.style.display = "none"

    botonJugar.addEventListener("click", empezarJuego)
    quitarJuego.addEventListener("click", cerrarJuego)
    btnCreditos.addEventListener("click", mostrarCreditos)
    botonMascota.addEventListener("click", seleccionarMascota)
    botonReiniciar.addEventListener("click", reiniciarJuego)
}

// cada segundo ejecuta una funcion que evalua si el jugador esta inactivo, despues de 5 segundos de inactividad se desconecta al jugador
setInterval(() => {
    if (!enMapa) return // 👈 SOLO en mapa

    const ahora = Date.now()

    if (ahora - ultimoMovimiento > 5000) {
        console.log("Inactivo 5s → desconectar")

        const data = new Blob(
            [JSON.stringify({ jugadorId: jugadorId })],
            { type: "application/json" }
        )

        navigator.sendBeacon(`${API_URL}/disconnect`, data)

        desconectarJugador() 
    }
}, 1000)

// cada 2 segundos le manda actividad al servidor, si lleva 2 segundos sin actividad DENTRO del mapa, tambien desconecta al jugador ya que beforeunload puede fallar
setInterval(() => {

    if (!jugadorId) return

    fetch(`${API_URL}/heartbeat`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            jugadorId: jugadorId
        })
    })

}, 2000)

// evalua si el jugador esta en dispositivo movil, si es asi muestra las flechas de movimiento, de lo contrario las oculta porque en pc se usan las teclas fisicas para moverse
function dispositivoMovil() {
    const pantallaTouch = navigator.maxTouchPoints > 0 || "ontouchstart" in window;

    return pantallaTouch
}

if (dispositivoMovil()) {
        flechasDispositivo.style.display = "flex"
    } else {
        flechasDispositivo.style.display = "none"
    }

// funcion para mostras los creditos
function mostrarCreditos() {
    sectionMenuPrincipal.style.display = "none"
    pantallaCreditos.style.display = "flex"
    enMapa = false 
}

// funcion para quitar los creditos
function quitarCreditos() {
    pantallaCreditos.style.display = "none"
    sectionMenuPrincipal.style.display = "flex"
    enMapa = false 
}

regresarCreditos.addEventListener("click", quitarCreditos)

// asigna un id aleatorio entre 0 y 1 a cada persona que entra al juego
function unirseJuego() {
    fetch(`${API_URL}/unirse`)
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

// detecta si el jugador cerró la pestaña o la ventana con el juego (inseguro) tiene respaldo de heartbeat (seguro)
window.addEventListener("beforeunload", () => {
    const data = new Blob(
        [JSON.stringify({ jugadorId: jugadorId })],
        { type: "application/json" }
    )

    navigator.sendBeacon(`${API_URL}/disconnect`, data)
})

// oculta la seccion de elegir mascota y muestra el mapa del juego
function empezarJuego() {
    sectionMenuPrincipal.style.display = "none"
    sectionMascota.style.display = "flex"
    pantallaCreditos.style.display = "none"
    enMapa = false
}

// cierra el juego completo
function cerrarJuego() {
    window.close();
}

// funcion para elegir mascota y guardar el id de la mascota
function seleccionarMascota() {
    if(mascota1.checked) {
        spanMascotaJugador.innerHTML = mascota1.id
        guardarMascota = mascota1.id
    } else if (mascota2.checked) {
        spanMascotaJugador.innerHTML = mascota2.id
        guardarMascota = mascota2.id
    } else if (mascota3.checked) {
        spanMascotaJugador.innerHTML = mascota3.id
        guardarMascota = mascota3.id
    } else {
        alert("Selecciona una mascota, porfavor")
        return
    }
    sectionMascota.style.display = "none"
    sectionCanvasJuego.style.display = "flex"

    mascotaSeleccionada(guardarMascota)
    extraerAtaques(guardarMascota)
    iniciarMapa()
}

// le comunica al servidor que mascota eligio el jugador para mostrarlo a los demas jugadores
function mascotaSeleccionada(guardarMascota) {
    fetch(`${API_URL}/elemental/${jugadorId}`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            mascota: guardarMascota
        })
    })
}

// inicia el mapa y la logica del jugador en el mapa
function iniciarMapa() {
    miPersonaje = obtenerObjetoMascota(guardarMascota)
    intervalo = setInterval(pintarMascotaYJuego, 100)
    window.addEventListener("keydown", teclas)
    window.addEventListener("keyup", detenerMovimiento)
    enMapa = true
    ultimoMovimiento = Date.now()
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

// muestra los ataques dinamicos
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

// evalua que ataques fueron seleccionas y desactiva el boton del ataque seleccionado y despues de cada ataque evalua si el jugador seleccionó 5 ataques para mandarlo al servidor
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

// la informarcion de la mascota enemiga
function seleccionarMascotaEnemigo(enemigo) {
    spanMascotaEnemigo.innerHTML = enemigo.nombre
    ataquesPersonajeEnemigo = enemigo.ataques
    secuenciaAtaque()
}

// envia los ataques de ambos jugadores al servidor y cada 50ms obtiene los ataques del enemigo
function enviarAtaques() {
    fetch (`${API_URL}/elemental/${jugadorId}/ataques`, {
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

//obtiene los ataques de ambos jugadores, y si ambos seleccionaron 5 ataque se muestra el resultdado del combate
function obtenerAtaques() {
    fetch(`${API_URL}/elemental/${enemigoId}/ataques`)
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

// asigna el ataque seleccionado por cada jugador para mostrarlo en el resultado del combate
function indexAmbosJugadores(jugador, enemigo) {
    indexAtaqueJugador = ataqueDinamicoJugador[jugador]
    indexAtaqueEnemigo = ataqueEnemigo[enemigo]
}

//funcion de combate, se evalua los ataques de ambos jugadores y se determina que jugador gana y cual pierde, ejm(J1: Fuego, J2: Agua. J2 pierde) y se crea un mensaje para mostrar en el cuadro de informacion los ataques que lanzaron ambos jugadores y en el orden en que lo hicieron, el jugador que gana se le suman victorias dependiendo las veces que haya ganado, el mensaje final se escribe dinamicamente en ambas pantallas, mensaje de derrota para el que tuvo menos victorias al final y mensaje de victoria para el que tuvo mas victorias al final
function combate() {
    clearInterval(intervalo)

    victoriasJugador = 0
    victoriasEnemigo = 0

    ataquesDelJugador.innerHTML = ""
    ataquesDelEnemigo.innerHTML = ""
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

// despues de terminar el combate evalua quien tuvo mas victorias para mostrar el mensaje de vicotoria en la pantalla de ese jugador, y el mensaje de derrota para el otro jugador
function revisarVictorias() {
    if (victoriasJugador == victoriasEnemigo) {
        mensajeFinal("Mmmm mismas victorias? supongo que fue un empate...") 
    } else if (victoriasJugador > victoriasEnemigo) {
        mensajeFinal("Tuviste mas victorias que el enemigo, ganaste😀")
    } else {
        mensajeFinal("El rival te ganó😭 puedes vencerlo en la siguiente?")
    }
}

// crea y muestra el mensaje de cada uno de los ataques lanzados por ambos jugadores
function crearMensaje(resultado) {
    let nuevoAtaqueDelJugador = document.createElement("p")
    let nuevoAtaqueDelEnemigo = document.createElement("p")

    sectionMensajes.innerHTML = resultado
    nuevoAtaqueDelJugador.innerHTML = indexAtaqueJugador
    nuevoAtaqueDelEnemigo.innerHTML = indexAtaqueEnemigo

    ataquesDelJugador.appendChild(nuevoAtaqueDelJugador)
    ataquesDelEnemigo.appendChild(nuevoAtaqueDelEnemigo)
}

// crea y muestra el mensaje final en ambas pantallas dependiendo del resultado del combate, y muestra el boton de reiniciar
function mensajeFinal(resultadoFinal) {

    let nuevoMensajeBatalla = document.createElement("p")

    sectionMensajes.innerHTML = resultadoFinal

    sectionMensajes.appendChild(nuevoMensajeBatalla)

    sectionReiniciar.style.display = "flex"
}

// reinicia el juego completo, debido a que reinicia la pagina
function reiniciarJuego() {
    enMapa = false 
    location.reload()
}

// funcion que usa una operacion matematica para generar un numero aleatorio entre un rango definido, se asigna un rango distinto dependiendo de la necesidad
function aleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

// pinta la mascota y el mapa, la mascota se pinta con la diferencia de que se pintan las coordenadas en tiempo real de la mascot y poder llamar a la funcion "enviarPosicion" con esta informacion
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

    personajesEnemigos.forEach(function (enemigo) {
        if (enemigo != undefined) {
            enemigo.pintarMascota()
            colisiones(enemigo)
        }
    })
}

// envia la posicion en tiempo real de la mascota al servidor, para que otros jugadores puedan ver el movimiento de las mascotas. Tambien evalua si la mascota enemiga existe, si no existe crea todos los valores necesarios para que la mascota exista y todo funcione correctamente
function enviarPosicion(x, y) { 
    fetch(`${API_URL}/elemental/${jugadorId}/posicion`, { 
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
                            let mascotaEnemiga
                            const mascotaNombre = enemigo.mascota.nombre || ""
                            
                            if (mascotaNombre === "Aquanut") {
                                mascotaEnemiga = new Personaje("Aquanut", "./assets/aquanut-juego.png", 3, "./assets/aquanut-cara.png", enemigo.id)
                            } else if (mascotaNombre === "Drakon") {
                                mascotaEnemiga = new Personaje("Drakon", "./assets/drakon-personaje.png", 3, "./assets/drakon-cara.png", enemigo.id)
                            } else if (mascotaNombre === "Selvatron") {
                                mascotaEnemiga = new Personaje("Selvatron", "./assets/Selvatron-personaje.png", 3, "./assets/selvatron-cara.png", enemigo.id)
                            }
                            
                            if (mascotaEnemiga) {
                                mascotaEnemiga.x = enemigo.x 
                                mascotaEnemiga.y = enemigo.y 
                                return mascotaEnemiga 
                            }
                        } 
                    }).filter(enemigo => enemigo != undefined) 
                    }) 
                } 
            }) 
        }

// funcion con condicional switch que evalua que tecla fisica fue presionada en un disposisitivo no movil para ejecutar cierta funcion para cada grupo de casos y mover al personaje segun la tecla presionada
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

// funciones para el movimiento del personaje, tambien se reinicia la inactividad cuando alguna de las funciones se ejecuta
function moverArriba() {
    miPersonaje.velocidadY = -5
    ultimoMovimiento = Date.now()
}

function moverAbajo() {
    miPersonaje.velocidadY = 5
    ultimoMovimiento = Date.now()
}

function moverIzquierda() {
    miPersonaje.velocidadX = -5
    ultimoMovimiento = Date.now()
}

function moverDerecha() {
    miPersonaje.velocidadX = 5
    ultimoMovimiento = Date.now()
}

function detenerMovimiento() {
    miPersonaje.velocidadX = 0
    miPersonaje.velocidadY = 0
}

// lo mismo de arriba pero para el movimiento en dispositivo movil
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

// obtiene la mascota del jugador
function obtenerObjetoMascota() {
    for (let i = 0; i < personajes.length; i++) {
        if (guardarMascota === personajes[i].nombre) {
            return personajes[i]
        }
    }
}

// funcion que detecta colision entre 2 jugadores
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

    if(enemigo.x == undefined || enemigo.y == undefined) {
        return
    }

    detenerMovimiento()
    clearInterval(intervalo)
    enMapa = false 
    seleccionarMascotaEnemigo(enemigo)
    console.log("Hubo colision");

    enemigoId = enemigo.id
    sectionCanvasJuego.style.display = "none"
    sectionAtaque.style.display = "flex"
}

window.addEventListener("load", iniciarJuego)