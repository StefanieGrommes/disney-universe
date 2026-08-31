const BASE_URL = "https://api.disneyapi.dev/";
const loadMoreBtnContainer = document.getElementById("load-more-btn-container");
let start = 0;
let end = 20;

function init(){
    loadDisneyCharacters("character", start, end);
}

async function loadDisneyCharacters(extension, start, end) {
    try {
        const response = await fetch(BASE_URL + extension);
        const data = await response.json();
        const dataList = (data.data).slice(start,end); // nur die ersten 20 Character anzeigen lassen
        console.log(dataList);
        renderDisneyCharacters(dataList);
        displayLoadMoreBtn();
    } catch (error) {
        console.error(error);
        displayError("Es ist ein Fehler beim Laden aufgetreten. Bitte versuche es später erneut!");
    }
}

function displayError(errorMessage){
    const main = document.querySelector("main");
    main.innerHTML = `<p class="error-message">${errorMessage}</p>`
}

function renderDisneyCharacters(dataList){
    const list = document.getElementById("character-list");
    for (let characterIndex = 0; characterIndex < dataList.length; characterIndex++) {
        const character = dataList[characterIndex];
        list.innerHTML += displayCharacterCard(character);
    } 
}

function displayLoadMoreBtn(){
    loadMoreBtnContainer.innerHTML = `<button class="load-more-btn" id="load-more-btn">Show me more!</button>`
    const loadMoreBtn = document.getElementById("load-more-btn");
    loadMoreBtn.addEventListener("click",loadMoreCharacters);
}

function displayCharacterCard(character){
    // destructuring => anstatt von const name = specie.name
    //                                const height = specie[average_height] usw  alles zusammen definieren//
    const {
        name: characterName,
        films,
        shortFilms, 
        imageUrl,
        videoGames,
        _id,
    } = character
    return `<li class="character-card">
        <h2>${characterName}</h2>
        <p>${_id}</p>
        <div class="card-img-wrapper">
        <img src="${imageUrl}" alt="${characterName}" loading="lazy">
        </div>
        <p>Films: ${films || "unknown"}</p>
        ${shortFilms ? `<p>Short Films: ${shortFilms}</p>` : ""} 
        ${videoGames ? `<p>Video Games: ${videoGames}</p>` : ""}
        </li>`;
}

function searchCharacter(){
    const inputFieldValue = document.getElementById("search-input-field").value;
    const trueInputValue = inputFieldValue.toLowerCase().trim();
    const list = document.getElementById("character-list");
    list.innerHTML = "";
    loadDisneyCharacters("character"+"?name="+trueInputValue);
}

function loadMoreCharacters(){
    start += 20;
    end += 20;
    loadDisneyCharacters("character", start, end)
}


// TO DO: durch die games und filme/shortfilms iterieren 
// bei search abfrage, ob character schon geladen wurde
// push ins Array
// loading spinner
// back to home button