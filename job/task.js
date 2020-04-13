const { CloudTasksClient } = require("@google-cloud/tasks")

const client = new CloudTasksClient()
const parent = client.queuePath("boox-app", "us-central1", "slack-bot")

exports.scheduleTask = async (url, image, image_title, text, inSeconds) => {
  console.log("start scheduling task..")
  const blocks = buildBlocks(text, image, image_title)
  const task = {
    httpRequest: {
      url,
      httpMethod: "POST",
      body: Buffer.from(JSON.stringify({ text, blocks })).toString("base64"),
    },
    scheduleTime: { seconds: Number(inSeconds) + Date.now() / 1000 },
    timeZone: "America/Sao_Paulo",
  }
  const request = { parent, task }
  try {
    const tasks = client.createTask(request)
    return tasks
  } catch (error) {
    console.error(error)
    throw error
  }
}

exports.shceduledTasks = async () => {
  try {
    const request = { parent, responseView: "FULL" }
    const tasks = await client.listTasks(request)
    return tasks
  } catch (error) {
    console.error(error)
    throw error
  }
}

// const schedule = async (
//   url,
//   image,
//   image_title,
//   text,
//   hour,
//   minute,
//   day_of_week
// ) => {
//   console.log("start scheduling..")
//   const blocks = buildBlocks(text, image, image_title)
//   console.log("created blocks")
//   const job = {
//     httpTarget: {
//       uri: url,
//       httpMethod: "POST",
//       body: Buffer.from(JSON.stringify({ blocks })),
//     },
//     schedule: `${minute || "*"} ${hour || "*"} * * ${day_of_week || "*"}`,
//     timeZone: "America/Sao_Paulo",
//   }
//   const request = {
//     parent: parent,
//     job: job,
//   }

//   try {
//     const [response] = await client.createJob(request)

//     console.log(`Created job: ${response.name}`, response)
//     return response
//   } catch (error) {
//     console.error(error)
//     throw error
//   }
// }

const buildBlocks = (text, image, image_title) => {
  const blocks = new Array()
  if (image)
    blocks.push({
      type: "image",
      title: {
        type: "plain_text",
        text: image_title,
        emoji: true,
      },
      image_url: image,
      alt_text: image_title || 'untitled',
    })
  if (text)
    blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: text,
      },
    })
  return blocks
}

// scheduleTask(...process.argv.slice(2))

// shceduledTasks()