// Focus div based on nav button click
const home = document.getElementById('home')
const single = document.getElementById('single')
const multi = document.getElementById('multi')
const guess = document.getElementById('guess')

const home_button = document.getElementById('homenav')
home_button.addEventListener('click', homeActive)

const single_button = document.getElementById('singlenav')
single_button.addEventListener('click', singleActive)

const multi_button = document.getElementById('multinav')
multi_button.addEventListener('click', multiActive)

const guess_button = document.getElementById('guessnav')
guess_button.addEventListener('click', guessActive)

function homeActive() {
    home.classList.remove('hidden')
    home.classList.add('active')
    single.classList.remove('active')
    single.classList.add('hidden')
    multi.classList.remove('active')
    multi.classList.add('hidden')
    guess.classList.remove('active')
    guess.classList.add('hidden')
}

function singleActive() {
    single.classList.remove('hidden')
    single.classList.add('active')
    home.classList.remove('active')
    home.classList.add('hidden')
    multi.classList.remove('active')
    multi.classList.add('hidden')
    guess.classList.remove('active')
    guess.classList.add('hidden')
}

function multiActive() {
    multi.classList.remove('hidden')
    multi.classList.add('active')
    home.classList.remove('active')
    home.classList.add('hidden')
    single.classList.remove('active')
    single.classList.add('hidden')
    guess.classList.remove('active')
    guess.classList.add('hidden')
}

function guessActive() {
    guess.classList.remove('hidden')
    guess.classList.add('active')
    home.classList.remove('active')
    home.classList.add('hidden')
    single.classList.remove('active')
    single.classList.add('hidden')
    multi.classList.remove('active')
    multi.classList.add('hidden')
}

// Flip one coin and show coin image to match result when button clicked

async function flipCoin(){
    const end = "app/flip/"
    const link = document.baseURI + end;
    await fetch(link)
        .then(function(response){
            return response.json()
        })

            .then(function(result){
                console.log(result)
                document.getElementById("result").innerHTML = result.flip
            })
}

// Flip multiple coins and show coin images in table as well as summary results

async function flipCoins(){

    num_flips = document.getElementById("numberFlips")
    const end = "app/flip/coins"
    const link = document.baseURI + end;
    await fetch(link)
        .then(function(result){
            return result.json()
        })
        .then(function(result){
            document.getElementById("multi").innerHTML = result.show
        })
    
}

// Enter number and press button to activate coin flip series

const pick_num = document.getElementById("num_pick")
pick_num.addEventListener("click", numFlips)

async function numFlips() {
    const end = "app/flips/coins"
    const link = document.baseURI + end;
    await fetch(link)
        .then(function(result){
            return result.json()
        })
        .then(function(result){
            document.getElementById("multi").innerHTML = result.show
        })

}

// Guess a flip by clicking either heads or tails button
