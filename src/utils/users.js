const users = []

// addUser, removeUser, getUser, getUsersInRoom

const addUser = ({ id, username, room }) => {
  // clean the data
  username = username.trim().toLowerCase()
  room = room.trim().toLowerCase()

  // validate the data
  if (!username || !room) {
    return {
      error: 'Username and Room are required!',
    }
  }

  // check for existing users
  const existingUsers = users.find(
    (user) => user.room == room && user.username == username
  )

  // validate username
  if (existingUsers) {
    return {
      error: 'Username already exists',
    }
  }

  const user = { id, username, room }
  users.push(user)
  return { user }
}

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id)

  if (index !== -1) {
    return users.splice(index, 1)[0]
  }
}

const getUser = (id) => {
  return users.find((user) => user.id === id)
}

const getUsersInRoom = (room) => {
  return users.filter((user) => user.room === room.trim().toLowerCase())
}

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
}
