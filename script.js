const BASE_URL = "https://api.disneyapi.dev/";
const loadMoreBtnContainer = document.getElementById("load-more-btn-container");
let pageNumber = 1;
let allCharacters = [];

function init(){
    loadVisibleDisneyCharacters("character", pageNumber);
    loadAllCharacters();
}

/**
 * This function loads the characters of a page 
 * @param {string} extension  - This is the extension of the Base URL  
 * @param {number} pageNumber - This is the page number to load
 */

async function loadVisibleDisneyCharacters(extension, pageNumber) {
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

const errorSection = document.getElementById("error-message");

function displayError(errorMessage){
    errorSection.innerHTML = `<p class="error-message">${errorMessage}</p>`
}

function renderDisneyCharacters(dataList){
    const list = document.getElementById("character-list");
    let html = ""; 
    for (let characterIndex = 0; characterIndex < dataList.length; characterIndex++) {
        const character = dataList[characterIndex];
        html += displayCharacterCard(character); //jedes html einmal rechnen und dann nächstes im array datalist
    }
    list.innerHTML = html; //zum schluss die komplette liste anzeigen lassen , sonst sehr langsam 
}

function displayLoadMoreBtn(){
    loadMoreBtnContainer.innerHTML = `<button class="load-more-btn" id="load-more-btn">Show me more!</button>`
    const loadMoreBtn = document.getElementById("load-more-btn");
    loadMoreBtn.addEventListener("click",loadMoreCharacters);
}

function hideLoadMoreButton(){
    loadMoreBtnContainer.innerHTML = "";
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
        <div class="card-info">
        <p>Films: ${films || "unknown"}</p>
        ${shortFilms ? `<p>Short Films: ${shortFilms}</p>` : ""} 
        ${videoGames ? `<p>Video Games: ${videoGames}</p>` : ""}
        </li>`;
}

async function loadAllCharacters(){
    const responseAllCharacters = await fetch(BASE_URL + "character?pageSize=10000");
    const dataAllCharacters = await responseAllCharacters.json();
    allCharacters = dataAllCharacters.data;
}

function searchCharacter(){
    const inputFieldValue = document.getElementById("search-input-field").value;
    const trueInputValue = inputFieldValue.toLowerCase().trim();
    const list = document.getElementById("character-list");
    list.innerHTML = "";
    hideLoadMoreButton();
    let searchedCharacters = allCharacters.filter(character => character.name.toLowerCase().includes(trueInputValue));
    if(searchedCharacters.length === 0) {
        errorSection.innerHTML = `<p class="error-message">No characters found.</p>`;
    } else {
        renderDisneyCharacters(searchedCharacters);
    }
}

function loadMoreCharacters(){
    //pageNumber++;
    //if (pageNumber > 149) {pageNumber = 1};   alte Version, besser mit ternary Operator:
    pageNumber = pageNumber >= 149 ? 1 : pageNumber +1 ; // Weil die Prüfung jetzt vor statt nach dem Hochzählen passiert, 
    // muss die Grenze im Vergleich um eins nach vorne verschoben werden (>  wird zu >=), damit das Verhalten gleich bleibt.
    loadVisibleDisneyCharacters("character", pageNumber);
}


// TO DO: durch die games und filme/shortfilms iterieren 
// loading spinner
// back to home button