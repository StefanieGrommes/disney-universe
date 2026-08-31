const BASE_URL = "https://api.disneyapi.dev/";
const loadMoreBtnContainer = document.getElementById("load-more-btn-container");
let pageNumber = 1;
let allCharacters = [];

function init(){
    loadDisneyCharacters("character", pageNumber);
    loadAllCharacters();
}

async function loadDisneyCharacters(extension, pageNumber) {
    try {
        const response = await fetch(BASE_URL + extension + "?page=" + pageNumber);
        const data = await response.json();
        const dataList = data.data;
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

async function loadAllCharacters(){
    const responseAllCharacters = await fetch(BASE_URL + "character?pageSize=10000");
    const dataAllCharacters = await responseAllCharacters.json();
    allCharacters = dataAllCharacters.data;
    console.log("ANzahl geladen:" , allCharacters.length);
    console.log(dataAllCharacters.info);
}

function searchCharacter(){
    const inputFieldValue = document.getElementById("search-input-field").value;
    const trueInputValue = inputFieldValue.toLowerCase().trim();
    const list = document.getElementById("character-list");
    list.innerHTML = "";
    loadDisneyCharacters("character"+"?name="+trueInputValue);
}

function loadMoreCharacters(){
    //pageNumber++;
    //if (pageNumber > 149) {pageNumber = 1};   alte Version, besser mit ternary Operator:
    pageNumber = pageNumber >= 149 ? 1 : pageNumber +1 ; // Weil die Prüfung jetzt vor statt nach dem Hochzählen passiert, 
    // muss die Grenze im Vergleich um eins nach vorne verschoben werden (>  wird zu >=), damit das Verhalten gleich bleibt.
    loadDisneyCharacters("character", pageNumber);
}


// TO DO: durch die games und filme/shortfilms iterieren 
// bei search abfrage das dataAllcharacters filtern, nicht den charcter fetchen
// loading spinner
// back to home button