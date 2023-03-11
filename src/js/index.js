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
          <img class="icon delete-comment-icon" 
           data-id="${comment.id}" src="./src/svg/cart-icon.svg" 
           alt="delete comment">
          <img class="icon like-comment-icon" data-id="${comment.id}"
          src="${comment.isLike ? './src/svg/heart-fill-icon.svg' : './src/svg/heart-icon.svg'}" 
          alt="like">
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