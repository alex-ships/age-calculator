
function calculateAge(){
    let userInput = document.getElementById("date").value

    let userDate = new Date(userInput)
    let userYear = userDate.getFullYear()
    let currentDate = new Date()
    let currentYear = currentDate.getFullYear()
    let calculation = currentYear - userYear

    document.getElementById("result").innerHTML = "You are " + calculation + " Years old Buddy!"
}


function changeColor(){
    let randomColor = color[Math.floor(Math.random() * color.length)] 
    document.getElementById("main").style.backgroundColor = randomColor
}
let color = ["red", "blue", "green", "yellow", "orange", "purple", "pink", "brown", "gray", "cyan"]




