let form = document.querySelector(".todoForm")
let todoInput = document.querySelector(".todoInput")
let todoUl = document.querySelector(".todoUl")
let completed = document.querySelector(".completed")
let dark_light_mode = document.querySelector(".dark_light_mode")
let todoArrayList = localStorage.getItem("todos") ? JSON.parse(localStorage.getItem("todos")) : []

document.addEventListener("DOMContentLoaded", ()=>{
    let loaded = true
    todosShow(false, loaded)

})

form.addEventListener("submit", (e)=>{
    e.preventDefault();
    let name =  e.target.todo.value
    let completed = e.target.completed.checked
    let editedId = e.target.todo.dataset.todoId
    if(!name){
        alert("Məlumat daxil edin!!!")
        return 
        
    } 
  
    let todo = {
        name,
        completed,
        _id : Date.now(),
        createdAt: new Date()
    }
    if(!editedId){
        addTodo(todo)
    }else {
        updateTodo(todo, editedId)
    }
    e.target.todo.value = ""
    e.target.completed.checked = false
    e.target.todo.removeAttribute("data-todo-id")
})

function addTodo(todo) {
    todoArrayList.push(todo)
    localStorage.setItem("todos", JSON.stringify(todoArrayList))
    todosShow()
}
function deleteTodo(_id) {
    todoArrayList = todoArrayList.filter(el=> el._id !== _id)
    localStorage.setItem("todos", JSON.stringify(todoArrayList))
    todosShow()
}

function updateTodo(todo, _id) {
    todoArrayList = todoArrayList.map((el)=>{
        if(Number(el._id) === Number(_id) ){
            el.name =  todo.name
            el.completed =  todo.completed
        }
        return el
    })
    localStorage.setItem("todos", JSON.stringify(todoArrayList))
    todosShow()
}
function todoEditClicked(_id) {
    let todo = todoArrayList.find((el)=> el._id == _id)
    todoInput.value = todo.name
    todoInput.setAttribute("data-todo-id", _id)
    todoInput.focus()
}
function completedTodo(_id, element) {
    element.nextElementSibling.style.textDecoration = "line-through"
    todoArrayList = todoArrayList.map((el)=>{
        if(Number(el._id) === Number(_id) ){
            el.completed = element.checked
        }
        return el
    })
    localStorage.setItem("todos", JSON.stringify(todoArrayList))
}

function todosShow(status = false, loaded) {
    todoUl.innerHTML = ""
    todoArrayList = todoArrayList.sort((a,b)=> new Date(b.createdAt) - new Date(a.createdAt))
    let count = todoArrayList.length || 0
    todoArrayList.forEach(data => {
        let isChecked = data.completed ? 'checked' : ''
        todoUl.innerHTML +=  `
            <li class="todoLi" data-id="${data._id}">
            <input type="checkbox" class="completed" onclick = "completedTodo(${data._id}, this)" ${isChecked}>
            <span class="todo_name ${data.completed === true ? "completedTodo": ''}">${data.name}</span>
            <div class="events">
                <span class="todo_delete" onclick = "deleteTodo(${data._id})"><i class='bx bx-x'></i></span>
                <span class="todo_edit" onclick = "todoEditClicked(${data._id})"><i class='bx bx-edit'></i></span>
            </div>
             </li>
             `
    });
    todoUl.innerHTML += ` <li class="todo__footer">
    <p class="count">${count} items left</p>
    <ul class="statusTabs">
        <li class="${(status === "all" ) || (loaded === true ) ? 'activeTab' : ''}" onclick="filterByStatus('all', this)">All</li>
        <li class="${status === "active" ? 'activeTab' : ''}" onclick="filterByStatus('active', this)">Active</li>
        <li class="${status === "completed" ? 'activeTab' : ''}" onclick="filterByStatus('completed', this)">Completed</li>
    </ul>
    <span class="clearCompleted" onclick="clearCompleted()">Clear Completed</span>
    </li>`
}


function clearCompleted() {
    todoArrayList = todoArrayList.filter(el=> !el.completed)
    localStorage.setItem("todos", JSON.stringify(todoArrayList))
    todosShow()
}

function filterByStatus(status, element) {
   
    let tabs = document.querySelectorAll(".statusTabs li")
    tabs.forEach(el=>{
        el.classList.remove("activeTab")
    })
    
  
    todoArrayList = JSON.parse(localStorage.getItem("todos")).filter((el)=>{
        if(status == 'all'){
            return true
        }else if(status == "active"){
            return !el.completed
        }else if(status == "completed"){
            return el.completed
        }
    })
    
    todosShow(status)
}

/////// DARK-LIGHT-MODE /////
dark_light_mode.addEventListener("click", (e)=>{
    let mode = localStorage.getItem("mode")
    e.target.classList.remove("dark_mode")
    e.target.classList.remove("light_mode")
    if(mode === "light"){
        e.target.classList.add("light_mode")
        localStorage.setItem("mode", "dark")
        document.body.style.backgroundColor = "#171823"
    }else{
        e.target.classList.add("dark_mode")
        localStorage.setItem("mode", "light")
        document.body.style.backgroundColor = "#eeebeb"
    }
})