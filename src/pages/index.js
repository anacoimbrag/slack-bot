import "bootstrap/dist/css/bootstrap.min.css"

import React, { useState } from "react"
import Container from "react-bootstrap/Container"
import Col from "react-bootstrap/Col"
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import Row from "react-bootstrap/Row"
import Card from "react-bootstrap/Card"
import moment from "moment"

export default () => {
  const [tasks, setTasks] = useState([])
  const [url, setUrl] = useState(undefined)
  const [text, setText] = useState(undefined)
  const [image, setImage] = useState(undefined)
  const [imageTitle, setImageTitle] = useState(undefined)
  const [date, setDate] = useState(
    moment()
      .format()
      .substr(0, 10)
  )
  const [time, setTime] = useState(
    moment()
      .format()
      .substr(11, 5)
  )

  const send = () => {
    fetch("https://boox-app.appspot.com/schedule", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url,
        text,
        image,
        image_title: imageTitle,
        date: new Date(date + "T" + time + ":00.000").toString(),
      }),
    })
      .then(response => {
        console.log(response)
        alert("Agendado com sucesso!")
      })
      .catch(err => {
        console.error(err)
        alert("Não foi possível agendar mensagem.")
      })
  }

  const getTasks = () => {
    fetch("https://boox-app.appspot.com/list")
      .then(res => res.json())
      .then(data => {
        console.log(data)
        setTasks(data[0])
      })
      .catch(console.log)
  }
  return (
    <Container>
      <h3 as={Col} md={12} className="text-center mt-4">
        Kobe - Envio de mensagens no slack
      </h3>
      <Row className="justify-content-md-center mt-4">
        <Col md={6}>
          <Form>
            <Form.Group>
              <Form.Label>Webhook</Form.Label>
              <Form.Control
                required
                type="url"
                onChange={el => setUrl(el.target.value)}
                placeholder="https://hooks.slack.com/services/xxx/xxx/xxxx"
              />
              <Form.Text className="text-muted">
                Verifique ou crie a url do webhook que deseja inserir{" "}
                <a href="https://slack.com/apps/A0F7XDUAZ-incoming-webhooks">
                  aqui
                </a>. (Necessário login no workspace para ter acesso)
              </Form.Text>
            </Form.Group>
            <Form.Group>
              <Form.Label>Texto (opcional)</Form.Label>
              <Form.Control
                type="text"
                onChange={el => setText(el.target.value)}
                placeholder="Mensagem do slack (é possível incluir emojis, por exemplo: ':blue_heart:' e também *negrito* ou _itálico_"
              />
            </Form.Group>
            <Form.Row>
              <Form.Group as={Col}>
                <Form.Label>Url da imagem (opcional)</Form.Label>
                <Form.Control
                  type="url"
                  onChange={el => setImage(el.target.value)}
                  placeholder="Url da imagem"
                />
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Título da imagem (opcional)</Form.Label>
                <Form.Control
                  type="text"
                  onChange={el => setImageTitle(el.target.value)}
                  placeholder="Título da imagem"
                />
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col}>
                <Form.Label>Data para envio da mensagem</Form.Label>
                <Form.Control
                  type="date"
                  value={date}
                  onChange={el => setDate(el.target.value)}
                />
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Horário para envio da mensagem</Form.Label>
                <Form.Control
                  type="time"
                  value={time}
                  onChange={el => setTime(el.target.value)}
                />
              </Form.Group>
            </Form.Row>
            <Button variant="primary" type="button" onClick={() => send()}>
              Enviar
            </Button>
          </Form>
        </Col>
        <Col md={6}>
          <Button variant="primary" type="button" onClick={() => getTasks()}>
            Listar
          </Button>
          <Row>
            {tasks.map(task => {
              const body = JSON.parse(
                Buffer.from(task.httpRequest.body).toString()
              )
              console.log(body)
              const image = body.blocks.find(block => block.type === "image")
              console.log(image)
              const text = body.blocks.find(block => block.type === "section")
              return (
                <Col md={6} key={task.name}>
                  <Card className="mt-3">
                    {image && (
                      <Card.Img
                        variant="top"
                        alt={image.title.text}
                        src={image.image_url}
                      />
                    )}
                    <Card.Body>
                      {image && <Card.Title>{image.title.text}</Card.Title>}
                      <Card.Subtitle className="mb-2 text-muted">
                        {new Date(
                          Number(task.scheduleTime.seconds) * 1000
                        ).toLocaleString("pt-BR")}
                      </Card.Subtitle>
                      {text && (
                        <Card.Text>
                          <b>Text:</b> {text.text.text}
                        </Card.Text>
                      )}
                      {
                        <Card.Text>
                          <b>Webhook:</b> {task.httpRequest.url}
                        </Card.Text>
                      }
                    </Card.Body>
                  </Card>
                </Col>
              )
            })}
          </Row>
        </Col>
      </Row>
    </Container>
  )
}
