// Servidor y dependencias/librerias
const express = require("express")
const cors = require("cors")
const app = express()

app.use(express.static("public"))
app.use(cors())
app.use(express.json())

//variable globla que almacena a todos los jugadores
let jugadores = []

// clase con toda la informacion de cada jugador
class Jugador {
    constructor(id) {
        this.id = id
        this.ultimoLatido = Date.now() // 🔥 NUEVO
    }

    asignarMascota(mascota) {
        this.mascota = mascota
    }

    actualizarPosicion(x, y) {
        this.x = x
        this.y = y
    }

    asignarAtaques(ataques) {
        this.ataques = ataques
    }
}

// la mascota de cada jugador
class Mascota {
    constructor(nombre) {
        this.nombre = nombre
    }
}

// asigna un id aleatorio entre 0 y 1 para cada jugador
app.get("/unirse", (req, res) => {
    const id = `${Math.random()}`

    const jugador = new Jugador(id)

    jugadores.push(jugador)

    res.send(id)
})

// manda toda la informacion del jugador al frontend
app.post("/elemental/:jugadorId", (req, res) => {
    const jugadorId = req.params.jugadorId || ""
    const nombre = req.body.mascota || ""
    const mascota = new Mascota(nombre)

    const jugadorIndex = jugadores.findIndex((jugador) => jugadorId === jugador.id)
    
    if (jugadorIndex >= 0) {
        jugadores[jugadorIndex].asignarMascota(mascota)
    }

    console.log(jugadores)
    console.log(jugadorId)
    res.end()
})

// manda la posicion de los jugadores existentes al frontend
app.post("/elemental/:jugadorId/posicion", (req, res) => {
    const { x, y } = req.body
    const { jugadorId } = req.params
    
    // Actualiza posición
    const jugador = jugadores.find(j => j.id === jugadorId)
    if (jugador) {
        jugador.x = x
        jugador.y = y
    }
    
    // Filtra enemigos: solo los que tienen mascota definida
    
    const enemigos = jugadores.filter(j => j.id !== jugadorId)
    res.json({ enemigos })
})

// manda el sistema de desconexion por inactividad al frontend
app.post("/disconnect", (req, res) => {
    const { jugadorId } = req.body

    jugadores = jugadores.filter(j => j.id !== jugadorId)

    console.log("Jugador desconectado INMEDIATAMENTE:", jugadorId)

    res.sendStatus(200)
})

// manda el sistema de desconexion por heartbeat al frontend
app.post("/heartbeat", (req, res) => {
    const { jugadorId } = req.body

    const jugador = jugadores.find(j => j.id === jugadorId)

    if (jugador) {
        jugador.ultimoLatido = Date.now()
    }

    res.sendStatus(200)
})

// manda el conjunto de ataques de cada jugador al frontend
app.post("/elemental/:jugadorId/ataques", (req, res) => {
    const jugadorId = req.params.jugadorId || ""
    const ataques = req.body.ataques || []

    const jugadorIndex = jugadores.findIndex((jugador) => jugadorId === jugador.id)
    
    if (jugadorIndex >= 0) {
        jugadores[jugadorIndex].asignarAtaques(ataques)
    }

    res.end()
})

// obtiene los ataques del enemigo y manda los ataques propios al frontend
app.get("/elemental/:jugadorId/ataques", (req, res) => {
    const jugadorId = req.params.jugadorId || ""
    const jugador = jugadores.find((jugador) => jugador.id === jugadorId)
    res.send({
        ataques: jugador.ataques || []
    })
})

// puerto del servidor en local
const PORT = process.env.PORT || 8080

// cada 2 segundos se evalua si el jugador sigue activo, de lo contrario se desconecta
setInterval(() => {

    const ahora = Date.now()

    jugadores = jugadores.filter(jugador => {
        const vivo = ahora - jugador.ultimoLatido < 2000

        if (!vivo) {
            console.log("Jugador eliminado por heartbeat:", jugador.id)
        }

        return vivo
    })

}, 2000)

app.listen(PORT, "0.0.0.0", () => {
    console.log("Servidor funcionando")
})