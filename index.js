// Servidor y dependencias/librerias
const express = require("express")
const cors = require("cors")
const http = require("http")
const { Server } = require("socket.io")
const app = express()
const server = http.createServer(app)

app.use(express.static("public"))
app.use(cors())
app.use(express.json())

const io = new Server(server, {
    cors: {
        origin: "*"
    }
})

//variable globlal que almacena a todos los jugadores
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

io.on("connection", (socket) => {
    console.log("Jugador conectado:", socket.id)
    
    // 🔥 MOVIMIENTO
    socket.on("mover", (data) => {

        const jugador = jugadores.find(j => j.id === data.jugadorId)

        if (jugador) {
            jugador.x = data.x
            jugador.y = data.y
        }

    })

    // 🔥 ATAQUES
    socket.on("ataque", (data) => {

        const jugador = jugadores.find(j => j.id === data.jugadorId)

        if (jugador) {
            jugador.ataques = data.ataque
        }

        socket.broadcast.emit("ataqueEnemigo", data)

    })

    // 🔥 DESCONEXIÓN REAL
    socket.on("disconnect", () => {

        console.log("Jugador desconectado:", socket.id)

        // eliminar jugador usando su id lógico
        jugadores = jugadores.filter(j => j.socketId !== socket.id)
    })

    socket.on("heartbeat", (data) => {
        const jugador = jugadores.find(j => j.id === data.jugadorId)

        if (jugador) {
        jugador.ultimoLatido = Date.now()
        }
    })

    socket.on("registrar", (jugadorId) => {
        const jugador = jugadores.find(j => j.id === jugadorId)

        if (jugador) {
            jugador.socketId = socket.id
        }
    })
})

setInterval(() => {
    io.emit("estado", jugadores)
}, 50)

setInterval(() => {
    const ahora = Date.now()

    jugadores = jugadores.filter(jugador => {
        if (ahora - jugador.ultimoLatido > 5000) {
            console.log("Jugador eliminado por inactividad:", jugador.id)
            return false
        }
        return true
    })
}, 2000)

// puerto del servidor en local
const PORT = process.env.PORT || 8080

server.listen(PORT, "0.0.0.0", () => {
    console.log("Servidor funcionando")
})