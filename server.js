import * as dotenv from 'dotenv'
dotenv.config()

import Fastify from 'fastify'
import cors from '@fastify/cors'
import { v4 as uuidv4 } from 'uuid'

const port = process.env.PORT || 3000

const users = [
  {
    id: uuidv4(),
    username: 'johndoe',
  },
  {
    id: uuidv4(),
    username: 'janedoe',
  },
  {
    id: uuidv4(),
    username: 'test',
  },
]

const fastify = Fastify({
  logger: true,
})
await fastify.register(cors, {
  origin: '*',
})

fastify.get('/', (req, rep) => {
  rep.send({ message: 'Hello from fastify' })
})

fastify.get('/users', (req, rep) => {
  rep.send(users)
})

fastify.get('/users/:id', (req, rep) => {
  const { id } = req.params

  console.log(id)

  const userFound = users.find((user) => user.id === id)

  if (!userFound) {
    rep.status(404).send({ message: `User with id ${id} not found` })
    return
  }

  rep.send(userFound)
})

fastify.post('/users', (req, rep) => {
  const { username } = req.body

  if (username) {
    users.push({ id: uuidv4(), username })

    rep.send(users)
    return
  }

  rep.status(400).send({ message: 'Malformed request' })
})

fastify.listen({ port }, (err, address) => {
  if (err) throw err
  else console.log('Server running on', address)
})
