const express = require("express")
const bodyParser = require("body-parser")
const { scheduleTask, shceduledTasks } = require("./task")
const cors = require("cors")

const app = express()

app.use(cors())
app.enable("trust proxy")
app.use(bodyParser.raw({ type: "application/octet-stream" }))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.get("/", (req, res) => {
  // Basic index to verify app is serving
  res.send("Hello, World!").end()
})

app.get("/list", async (req, res) => {
  try {
    const tasks = await shceduledTasks()
    res.send(tasks)
  } catch (err) {
    res.status(500).send(err)
  }
})

app.post("/schedule", async (req, res) => {
  const { url, image, image_title, text, date } = req.body
  const inSecods = (Date.parse(date) - Date.now()) / 1000
  try {
    console.log(
      "calling schedule",
      url,
      image,
      image_title,
      text,
      date,
      inSecods
    )
    const result = await scheduleTask(url, image, image_title, text, inSecods)

    res.send(result)
  } catch (error) {
    res.status(500).send(error)
  }
})

app.get("*", (req, res) => {
  res.send("OK").end()
})

module.exports = { app }