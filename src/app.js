import express from "express"
import handlebars  from "express-handlebars"
import viewsRoutes from "./routes/views.routes.js"
import __dirname from "./utils.js"
import { Server } from "socket.io"


// Declaración de express y asignación de puerto.
const app = express()
const PORT = 8080
const httpServer = app.listen(PORT, () => console.log(`Escuchando en el puerto: ${PORT}`))


// Configuración de socket
const io = new Server(httpServer)


// Configuración de la carpeta "public"
app.use(express.static(__dirname + "/public"));


// Configuración de Handlebars
app.engine("handlebars", handlebars.engine())
app.set("views", __dirname + "/views")
app.set("view engine", "handlebars")


// Middlewares de configuración
app.use(express.json())
app.use(express.urlencoded({extended:true}))


// Endpoint de telemetría
app.get("/ping", (req, res) => {
    res.send("pong")
})


// Routes
app.use("/", viewsRoutes)


// Canal de comunicación mediante sockets
io.on("connection", socket => {

})
