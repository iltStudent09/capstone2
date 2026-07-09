const jsonServer = require('json-server')

const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()

server.use(middlewares)
server.use(jsonServer.bodyParser)

function normalizePhone(value) {
  return String(value ?? '').replace(/\D/g, '')
}

function nextId(collection) {
  const ids = collection.map((item) => Number(item.id)).filter((value) => !Number.isNaN(value))

  if (ids.length === 0) {
    return 1
  }

  return Math.max(...ids) + 1
}

server.post('/auth/register', (req, res) => {
  const email = String(req.body?.email ?? '').trim().toLowerCase()
  const phone = String(req.body?.phone ?? '').trim()
  const password = String(req.body?.password ?? '')
  const normalizedPhone = normalizePhone(phone)

  if (!email || !normalizedPhone || password.length < 6) {
    return res.status(400).json({ message: 'Email, phone, and password are required' })
  }

  const users = router.db.get('users').value()
  const existingUser = users.find((candidateUser) => {
    return (
      candidateUser.email === email ||
      normalizePhone(candidateUser.phone) === normalizedPhone
    )
  })

  if (existingUser) {
    return res.status(409).json({ message: 'User already exists' })
  }

  const usernameFromEmail = email.split('@')[0] || 'New User'
  const name = usernameFromEmail
    .split('.')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ')

  const newUser = {
    id: nextId(users),
    email,
    phone,
    password,
    role: 'user',
    name,
  }

  router.db.get('users').push(newUser).write()

  return res.status(201).json({ id: newUser.id })
})

server.post('/auth/login', (req, res) => {
  const email = String(req.body?.email ?? '').trim().toLowerCase()
  const phone = String(req.body?.phone ?? '').trim()
  const password = String(req.body?.password ?? '')
  const normalizedPhone = normalizePhone(phone)

  if (!email || !normalizedPhone || !password) {
    return res.status(400).json({ message: 'Email, phone, and password are required' })
  }

  const user = router.db
    .get('users')
    .find((candidateUser) => {
      return (
        candidateUser.email === email &&
        normalizePhone(candidateUser.phone) === normalizedPhone &&
        candidateUser.password === password
      )
    })
    .value()

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }

  return res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
  })
})

function getCurrentUser(req) {
  const userId = Number(req.header('x-user-id'))
  const role = req.header('x-user-role')

  if (!userId || !role) {
    return undefined
  }

  const user = router.db.get('users').find({ id: userId }).value()

  if (!user || user.role !== role) {
    return undefined
  }

  return user
}

function isCustomersPath(req) {
  return req.path === '/customers' || req.path.startsWith('/customers/')
}

function isUsersPath(req) {
  return req.path === '/users' || req.path.startsWith('/users/')
}

server.use((req, res, next) => {
  if (!isCustomersPath(req) && !isUsersPath(req)) {
    return next()
  }

  const currentUser = getCurrentUser(req)

  if (!currentUser) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  req.currentUser = currentUser

  if (req.method === 'POST' && req.path === '/users') {
    const requestedRole = req.body?.role

    if (requestedRole === 'admin') {
      const existingAdmin = router.db.get('users').find({ role: 'admin' }).value()

      if (existingAdmin) {
        return res.status(409).json({ message: 'Only one admin account is allowed' })
      }
    }
  }

  if (!isCustomersPath(req)) {
    return next()
  }

  if (req.method === 'GET' && req.path === '/customers' && currentUser.role !== 'admin') {
    req.query.createdByUserId = String(currentUser.id)
    return next()
  }

  if (req.method === 'POST' && req.path === '/customers') {
    req.body = {
      ...req.body,
      createdByUserId: currentUser.id,
      updatedByUserId: currentUser.id,
    }
    return next()
  }

  const customerId = Number(req.path.split('/')[2])

  if (!customerId) {
    return next()
  }

  const customer = router.db.get('customers').find({ id: customerId }).value()

  if (!customer) {
    return res.status(404).json({ message: 'Customer not found' })
  }

  const isOwner = customer.createdByUserId === currentUser.id
  const isAdmin = currentUser.role === 'admin'

  if (!isAdmin && !isOwner) {
    return res.status(403).json({ message: 'Forbidden' })
  }

  if ((req.method === 'PUT' || req.method === 'PATCH') && req.body) {
    req.body = {
      ...req.body,
      createdByUserId: customer.createdByUserId,
      updatedByUserId: currentUser.id,
    }
  }

  next()
})

server.use(router)

server.listen(3001, () => {
  console.log('JSON Server with RBAC running on http://localhost:3001')
})
