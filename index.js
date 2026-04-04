const express = require("express")
const cors = require("cors")

const app = express()

app.use(express.static("public"))
app.use(cors())
app.use(express.json())

let jugadores = []

class Jugador {
    constructor(id) {
        this.id = id
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
    const { x, y } = req.body
    const { jugadorId } = req.params
    
    // Actualiza posición
    const jugador = jugadores.find(j => j.id === jugadorId)
    if (jugador) {
        jugador.x = x
        jugador.y = y
    }
    
    // Filtra enemigos: solo los que tienen mascota definida
    const enemigos = jugadores
        .filter(j => j.id !== jugadorId && j.mascota !== undefined)
    
    res.json({ enemigos })
})

app.post("/disconnect", (req, res) => {
    const { jugadorId } = req.body

    jugadores = jugadores.filter(j => j.id !== jugadorId)

    console.log("Jugador desconectado INMEDIATAMENTE:", jugadorId)

    res.sendStatus(200)
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

app.get("/elemental/:jugadorId/ataques", (req, res) => {
    const jugadorId = req.params.jugadorId || ""
    const jugador = jugadores.find((jugador) => jugador.id === jugadorId)
    res.send({
        ataques: jugador.ataques || []
    })
})

const PORT = process.env.PORT || 8080

app.listen(PORT, "0.0.0.0", () => {
    console.log("Servidor funcionando")
})