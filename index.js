const express = require("express")
const cors = require("cors")

const app = express()

app.use(express.static("public"))
app.use(cors())
app.use(express.json())

const jugadores = []

setInterval(() => {
    const ahora = Date.now()

    for (let i = jugadores.length - 1; i >= 0; i--) {
        const jugador = jugadores[i]

        if (ahora - jugador.inactividad > 5000) {
            console.log("Jugador eliminado por inactividad:", jugador.id)
            jugadores.splice(i, 1)
        }
    }

}, 5000)

class Jugador {
    constructor(id, inactividad) {
        this.id = id
        this.inactividad = inactividad
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

class Mascota {
    constructor(nombre) {
        this.nombre = nombre
    }
}

app.get("/unirse", (req, res) => {
    const id = `${Math.random()}`

    const jugador = new Jugador(id)

    jugadores.push(jugador)

    res.setHeader("Access-Control-Allow-Origin", "*")

    res.send(id)
})


app.post("/elemental/:jugadorId", (req, res) => {
    const jugadorId = req.params.jugadorId || ""
    const nombre = req.body.elemental || ""
    const mascota = new Mascota(nombre)

    const jugadorIndex = jugadores.findIndex((jugador) => jugadorId === jugador.id)
    
    if (jugadorIndex >= 0) {
        jugadores[jugadorIndex].asignarMascota(mascota)
    }

    console.log(jugadores)
    console.log(jugadorId)
    res.end()
})

app.post("/elemental/:jugadorId/posicion", (req, res) => {
    const jugadorId = req.params.jugadorId || ""
    const x = req.body.x || 0
    const y = req.body.y || 0

    const jugadorIndex = jugadores.findIndex((jugador) => jugadorId === jugador.id)
    
    if (jugadorIndex >= 0) {
        jugadores[jugadorIndex].actualizarPosicion(x, y)
    }

    const enemigos = jugadores.filter((jugador) => jugadorId !== jugador.id)

    res.send({
        enemigos
    })
})

app.post("/elemental/:jugadorId/ataques", (req, res) => {
    const jugadorId = req.params.jugadorId || ""
    const ataques = req.body.ataques || []

    const jugadorIndex = jugadores.findIndex((jugador) => jugadorId === jugador.id)
    
    if (jugadorIndex >= 0) {
        jugadores[jugadorIndex].asignarAtaques(ataques)
    }

    res.end()
})

app.post("/elemental/:jugadorId/desconectar", (req, res) => {
    const { jugadorId } = req.params

    const index = jugadores.findIndex(j => j.id === jugadorId)

    if (index !== -1) {
        jugadores.splice(index, 1)
        console.log("Jugador desconectado:", jugadorId)
    }

    res.end()
})

app.get("/elemental/:jugadorId/ataques", (req, res) => {
    const jugadorId = req.params.jugadorId || ""
    const jugador = jugadores.find((jugador) => jugador.id === jugadorId)
    res.send({
        ataques: jugador.ataques || []
    })
})

const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
    console.log("Servidor funcionando")
})