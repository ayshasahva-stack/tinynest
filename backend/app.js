import express from 'express'
const app = express()
app.get("/", (req, res) => {
    res.send("tinynest running")
})
export default app