const socket = io()

// elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = document.querySelector('input')
const $messageFormButton = document.querySelector('button')
const $sendLocation = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

// templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

// options
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
})

const autoscroll = () => {
  // get new message element
  const $newMessage = $messages.lastElementChild

  // height of the new message
  const newMessageStyles = getComputedStyle($newMessage)
  const newMessageMargin = parseInt(newMessageStyles.marginBottom)
  const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

  // visible height
  const visibleHeight = $messages.offsetHeight

  // height of message container
  const containerHeight = $messages.scrollHeight

  // how far have i scrolled ?
  const scrollOffset = $messages.scrollTop + visibleHeight

  if (containerHeight - newMessageHeight <= scrollOffset) {
    $messages.scrollTop = $messages.scrollHeight
  }
}

socket.on('message', (m) => {
  console.log(m)
  const html = Mustache.render(messageTemplate, {
    username: m.username,
    message: m.text,
    createdAt: moment(m.createdAt).format('h:mm:ss a'),
  })
  $messages.insertAdjacentHTML('beforeend', html)

  autoscroll()
})

socket.on('locationMessage', (u) => {
  console.log(u)
  const html = Mustache.render(locationTemplate, {
    username: u.username,
    url: u.url,
    createdAt: moment(u.createdAt).format('h:mm:ss a'),
  })
  $messages.insertAdjacentHTML('beforeend', html)

  autoscroll()
})

socket.on('roomData', ({ room, users }) => {
  const html = Mustache.render(sidebarTemplate, {
    room,
    users,
  })

  document.querySelector('#sidebar').innerHTML = html
})

$messageForm.addEventListener('submit', (e) => {
  e.preventDefault()

  $messageFormButton.setAttribute('disabled', 'disabled')

  const message = e.target.elements.message.value

  socket.emit('sendMessage', message, (err) => {
    $messageFormButton.removeAttribute('disabled')
    $messageFormInput.value = ''
    $messageFormInput.focus()

    if (err) {
      return console.log(err)
    }

    console.log('The message was sent successfully!')
  })
})

$sendLocation.addEventListener('click', () => {
  if (!navigator.geolocation) {
    return alert('Your browser does not support geolocation!')
  }

  $sendLocation.setAttribute('disabled', 'disabled')

  navigator.geolocation.getCurrentPosition((position) => {
    const coordinates = position.coords

    socket.emit(
      'sendLocation',
      {
        lat: coordinates.latitude,
        long: coordinates.longitude,
      },
      () => {
        $sendLocation.removeAttribute('disabled')
        console.log('The location was shared successfully')
      }
    )
  })
})

socket.emit('join', { username, room }, (err) => {
  if (err) {
    alert(err)
    location.href = '/'
  }
})
