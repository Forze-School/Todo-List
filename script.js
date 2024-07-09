let toggleThemaBtn = document.querySelector(".toggle")
let addTextArea = document.querySelector(".main__form .add-text ")
let form = document.querySelector(".main__form")
let input = document.querySelector(".main__form input")
let content = document.querySelector(".content")
let todoItems = []

let editTextArea = document.querySelector(".edit__form .add-text")
let modal = document.querySelector(".modal")
let closeModal = document.querySelector(".close__modal")
let modalInput = document.querySelector(".edit__form input")
let sbmEdit = document.querySelector(".change-text")

toggleThemaBtn.addEventListener("click", () => {
	toggleThemaBtn.classList.toggle("active-toggle")
	document.body.classList.toggle("active-thema")
})

function autoTextAreaHeight() {
	addTextArea.style.height = "5px"
	addTextArea.style.height = (addTextArea.scrollHeight) + "px"
	editTextArea.style.height = "5px"
	editTextArea.style.height = (editTextArea.scrollHeight) + "px"
}

addTextArea.addEventListener("input", autoTextAreaHeight)
editTextArea.addEventListener("input", autoTextAreaHeight)
form.addEventListener("submit", (event) => {
	event.preventDefault()
	if (input.value === "") {
		alert("Ти маєш ввести і заголовок і текст")
	} else {
		let item = {
			id: Date.now(),
			title: input.value,
			text: addTextArea.value,
			favorite: false
		}

		todoItems.push(item)
		input.value = ""
		addTextArea.value = ""
		saveData()
		render(todoItems)
		autoTextAreaHeight()
	}
})

function render(todoArray) {
	content.innerHTML = ""

	if (todoArray.length === 0) {
		content.innerHTML = `<p class="empty">You todo list is empty</p>`
		return
	}

	todoArray.forEach(item => {
		content.innerHTML += `<div class="todo-card ${item.favorite ? "favorite-todo" : ""}" data-id="${item.id}">
        <h3>${item.title}</h3>
        <p>${item.text}</p>
        <div class="row">
            <button class="favorite"><img src="./img/favorite.svg" alt="">Favorite</button>
            <button class="download"><img src="./img/load-white.svg" alt="">Download</button>
            <button class="edit"><img src="./img/edit-white.svg" alt="">Edit</button>
            <button class="delete"><img src="./img/delete-white.svg" alt="">Delete</button>
        </div>
    </div>`
	})
}
function saveData() {
	localStorage.setItem("Forze-school-todo", JSON.stringify(todoItems))
}

function getData() {
	let data = JSON.parse(localStorage.getItem("Forze-school-todo"))

	if (data) {
		todoItems = data
		render(todoItems)
	} else {
		content.innerHTML = `<p class="empty">You todo list is empty</p>`
	}
}

getData()


content.addEventListener("click", (event) => {
	let cardId = event.target.closest(".todo-card").dataset.id
	let index = todoItems.findIndex(item => item.id == cardId)

	if (event.target.closest(".delete")) {
		todoItems.splice(index, 1)
		render(todoItems)
		saveData()
	}

	if (event.target.closest(".favorite")) {
		todoItems[index].favorite = !todoItems[index].favorite
		render(todoItems)
		saveData()
	}


	if (event.target.closest(".edit")) {
		modal.classList.add("active-modal")
		modalInput.value = todoItems[index].title
		editTextArea.value = todoItems[index].text


		sbmEdit.addEventListener("click", editText)

		function editText(event) {
			event.preventDefault()
			if (modalInput.value === "" && editTextArea.value === "") {
				closemodal()
			} else {
				todoItems[index].title = modalInput.value
				todoItems[index].text = editTextArea.value
				saveData()
				closemodal()
				render(todoItems)
				sbmEdit.removeEventListener("click", editText)
			}
		}
		autoTextAreaHeight()
	}

	if (event.target.closest(".download")) {
		let allText = `${todoItems[index].title}\n\n${todoItems[index].text}`

		let blob = new Blob([allText], { type: `text/plain` })
		saveAs(blob, `${todoItems[index].title}.doc`)
	}
})

closeModal.addEventListener("click", closemodal)

function closemodal() {
	modal.classList.remove("active-modal")
}