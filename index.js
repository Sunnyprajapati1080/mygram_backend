const cors = require("cors")
const connectToMongo = require("./db")
const { app, express} = require("./server")

// configuration
require("dotenv").config()
connectToMongo()
// using middlewares and specifying routes
app.use("/uploads", express.static("uploads"))
app.use(express.json())
app.use(cors())
app.use("/api/auth", require("./routes/auth/index"))
app.use("/api/posts", require("./routes/posts/index"))