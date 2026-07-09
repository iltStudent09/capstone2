export type UserRole = 'admin' | 'user'

export type MockUser = {
  id: number
  name: string
  email: string
  role: UserRole
}

const MOCK_USERS: MockUser[] = [
  {
    id: 1,
    name: 'System Admin',
    email: 'admin@company.com',
    role: 'admin',
  },
  {
    id: 2,
    name: 'User One',
    email: 'user1@company.com',
    role: 'user',
  },
  {
    id: 3,
    name: 'User Two',
    email: 'user2@company.com',
    role: 'user',
  },
]

const STORAGE_KEY = 'customer-manager-mock-user-id'
export const AUTH_CHANGED_EVENT = 'mock-auth-changed'

export function getMockUsers() {
  return MOCK_USERS
}

export function getCurrentMockUser(): MockUser {
  if (typeof window === 'undefined') {
    return MOCK_USERS[0]
  }

  const storedUserId = Number(window.localStorage.getItem(STORAGE_KEY))

  if (Number.isNaN(storedUserId)) {
    return MOCK_USERS[0]
  }

  return MOCK_USERS.find((user) => user.id === storedUserId) ?? MOCK_USERS[0]
}

export function setCurrentMockUser(userId: number) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(STORAGE_KEY, String(userId))
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT))
}

export function isCurrentUserAdmin() {
  return getCurrentMockUser().role === 'admin'
}
