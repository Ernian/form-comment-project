let comments = JSON.parse(localStorage.getItem('comments')) || []
const commentsContainer = document.getElementById('comments-container')
const form = document.forms['comments-form']
const nameLabel = document.getElementById('name-label')
const textLabel = document.getElementById('text-label')
const nameInput = document.getElementById('name-input')
const textInput = document.getElementById('text-input')

form.addEventListener('submit', submitHandler)
//для того чтобы ошибка сбрасывалась при вводе следует использовать
//событие 'input', но тогда функциия будет запускаться на каждый ввод
//символа, что является излишним
nameInput.addEventListener('focus', resetNameError)
textInput.addEventListener('focus', resetTextError)
commentsContainer.addEventListener('click', deleteComment)
commentsContainer.addEventListener('click', commentLikeHandler)
displayComments(comments)

function submitHandler(event) {
  event.preventDefault()
  const comment = getComment()
  if (isValidComment(comment)) {
    addCommentToStorage(comment)
    clearForm()
    //каждый раз все комментарии удаляются и отрисовываются заново
    //неоптимальное решение, но простое для разработки
    clearCommentsContainer()
    displayComments(comments)
  } else {
    handleInputError(comment)
  }
}

function getComment() {
  const dateMs = new Date()
  const today = dateMs.toJSON().slice(0, 10)
  return {
    id: dateMs.getTime(),
    author: form.elements.author.value.trim(),
    text: form.elements.text.value.trim(),
    date: form.elements.date.value || today,
    time: new Date().toLocaleTimeString().slice(0, 5),
    isLike: false
  }
}

function isValidComment(comment) {
  return !!comment.author && !!comment.text
}

function addCommentToStorage(comment) {
  comments.push(comment)
  updateLocalStorage()
}

function updateLocalStorage() {
  localStorage.setItem('comments', JSON.stringify(comments))
}

function clearForm() {
  form.elements.author.value = ''
  form.elements.text.value = ''
  form.elements.date.value = ''
}

function clearCommentsContainer() {
  commentsContainer.innerHTML = ''
}

function displayComments(comments) {
  if (!comments.length) {
    commentsContainer.innerHTML = ''
    commentsContainer.insertAdjacentHTML('afterbegin', '<h2>Пока нет комментариев</h2>')
  }
  const commentsHTML = comments.map(comment => (`
      <div class="card mt-3 p-3 shadow">
        <div class="d-flex justify-content-end gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" 
            fill="currentColor" class="delete-comment-icon" data-id="${comment.id}" viewBox="0 0 16 16">
              <path class="delete-comment-icon" data-id="${comment.id}" d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
              <path class="delete-comment-icon" data-id="${comment.id}" fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" 
            width="25" height="25" fill="currentColor"
            class="like-comment-icon ${comment.isLike ? 'liked' : ''}"
            data-id="${comment.id}" viewBox="0 0 16 16">
              <path class="like-comment-icon ${comment.isLike ? 'liked' : ''}" data-id="${comment.id}" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
              <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z" fill="#0d6efd"/>
          </svg>
        </div>
       
        <div class="card-body">
          <blockquote class="blockquote mb-0">
            <p>${comment.text}</p>
            <footer class="d-flex justify-content-between fs-8">
              ${comment.author} 
              <span class="fw-lighter fst-italic">
              ${formatDate(comment.date)} - ${comment.time}
              </span>
            </footer>
          </blockquote>
        </div>
      </div>
    `))
  commentsContainer.insertAdjacentHTML('afterbegin', commentsHTML.join(''))
}

function handleInputError(comment) {
  if (!comment.author) {
    nameLabel.classList.add('text-danger')
    nameLabel.textContent = 'Пожалуйста, введите Ваше имя'
  }
  if (!comment.text) {
    textLabel.classList.add('text-danger')
    textLabel.textContent = 'Пожалуйста, введите комментарий'
  }
}

function resetNameError() {
  nameLabel.classList.remove('text-danger')
  nameLabel.textContent = 'Ваше имя'
}
function resetTextError() {
  textLabel.classList.remove('text-danger')
  textLabel.textContent = 'Ваш комментарий'
}

function formatDate(date) {
  const today = new Date().toJSON().slice(0, 10)
  const yesterday = new Date(new Date().setDate(new Date().getDate() - 1)).toJSON().slice(0, 10)
  if (date === today) {
    return 'Сегодня'
  }
  if (date === yesterday) {
    return 'Вчера'
  }
  return date
}

function deleteComment(event) {
  if (!event.target.classList.contains('delete-comment-icon')) {
    return
  }
  const id = +event.target.dataset.id
  comments = comments.filter(comment => comment.id !== id)
  updateLocalStorage()
  clearCommentsContainer()
  displayComments(comments)
}

function commentLikeHandler(event) {
  if (!event.target.classList.contains('like-comment-icon')) {
    return
  }
  const id = +event.target.dataset.id
  comments = comments.map(comment => {
    if (comment.id === id) {
      comment.isLike = !comment.isLike
    }
    return comment
  })
  updateLocalStorage()
  clearCommentsContainer()
  displayComments(comments)
}