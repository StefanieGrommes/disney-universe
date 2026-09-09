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
        await waitForData();
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
    list.innerHTML += html; //zum schluss die komplette liste anzeigen lassen , sonst sehr langsam 
}

async function waitForData(){
    const images = document.querySelectorAll(".character-card img ");
    for (let i = 0; i < images.length; i++) {
        if (!images[i].complete) {
            try {
            await images[i].decode();
            } catch (error) {
                console.warn ("Folgendes Bild konnte nicht geladen werden:", images[i].src);
            }
        }
    }
    hideLoadingSpinner();
    displayLoadMoreBtn();
}

function displayLoadMoreBtn(){
    loadMoreBtnContainer.innerHTML = `<button class="load-more-btn" id="load-more-btn">Show me more!</button>`
    const loadMoreBtn = document.getElementById("load-more-btn");
    loadMoreBtn.addEventListener("click",loadMoreCharacters);
}

function clearButtonContainer(){
    loadMoreBtnContainer.innerHTML = "";
}

const loadingSpinner = document.getElementById("loading-spinner");

function showLoadingSpinner(){
    if (loadingSpinner) {
        loadingSpinner.style.display = "block";
    }
}

function hideLoadingSpinner(){
    if (loadingSpinner) {
        loadingSpinner.style.display = "none";
    }
}

function displayCharacterCard(character){
    // destructuring => anstatt von const name = specie.name
    //                                const height = specie[average_height] usw  alles zusammen definieren//
    // onerror="this.src=``" wenn bild nicht geladen werden kann, dann gibt es folgendes Fallback, this bezieht sich auf img-Element
    const {
        name: characterName,
        films,
        shortFilms, 
        imageUrl,
        videoGames,
        _id,
    } = character
    return `<li class="character-card">
        <div class="card-headline">
        <h2>${characterName}</h2>
        </div>
        <p>${_id}</p>
        <div class="card-img-wrapper">
        <img src="${imageUrl || "./assets/the_shire_hobbit-mike-wazowski-6739521_640.png"}" alt="${characterName}" loading="lazy" onerror="this.src='./assets/the_shire_hobbit-mike-wazowski-6739521_640.png';"> 
        </div>
        <div class="card-info">
        ${films && films.length > 0 ? `<ul><b>Films</b>: ${films.join(", ")}</ul>` : `<ul><b>Films</b>: unknown</ul>`}
        ${shortFilms && shortFilms.length > 0 ? `<ul><b>Short Films </b>: ${shortFilms.join(", ")}</ul>` :  `<ul><b>Short Films</b>: unknown</ul>`}
        ${videoGames && videoGames.length > 0 ? `<ul><b>Video Games </b>: ${videoGames.join(", ")}</ul>` : `<ul><b>Video Games</b>: unknown</ul>`}
        </div>
        </li>`; 
}

async function loadAllCharacters(){
    const responseAllCharacters = await fetch(BASE_URL + "character?pageSize=10000");
    const dataAllCharacters = await responseAllCharacters.json();
    allCharacters = dataAllCharacters.data;
}

function searchCharacter(){
    const inputField = document.getElementById("search-input-field");
    const trueInputValue = inputField.value.toLowerCase().trim();
    const list = document.getElementById("character-list");
    list.innerHTML = "";
    clearButtonContainer();
    let searchedCharacters = allCharacters.filter(character => character.name.toLowerCase().includes(trueInputValue));
    if(searchedCharacters.length === 0) {
        errorSection.innerHTML = `<p class="error-message">No characters found.</p>`;
    } else {
        renderDisneyCharacters(searchedCharacters);
    }
    inputField.value = "";
    showBacktoStartBtn();
}

function showBacktoStartBtn(){
    loadMoreBtnContainer.innerHTML = `<button class="back-to-start-btn" id="back-to-start-btn">Back to Start</button>`
    const backToStartBtn = document.getElementById("back-to-start-btn");
    backToStartBtn.addEventListener("click", reset);
    hideLoadingSpinner();
}

function reset(){
    clearList();
    clearButtonContainer();
    hideErrorMessage();
    loadVisibleDisneyCharacters("character", pageNumber);
}

function clearList(){
    document.getElementById("character-list").innerHTML = "";
}

function hideErrorMessage(){
    errorSection.innerHTML = "";
}

function loadMoreCharacters(){
    showLoadingSpinner();
    //pageNumber++;
    //if (pageNumber > 149) {pageNumber = 1};   alte Version, besser mit ternary Operator:
    pageNumber = pageNumber >= 149 ? 1 : pageNumber +1 ; // Weil die Prüfung jetzt vor statt nach dem Hochzählen passiert, 
    // muss die Grenze im Vergleich um eins nach vorne verschoben werden (>  wird zu >=), damit das Verhalten gleich bleibt.
    loadVisibleDisneyCharacters("character", pageNumber);
}
