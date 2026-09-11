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
        waitForData();
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

function waitForData(){
    checkIfDataHasOverflow();
    hideLoadingSpinner();
    displayLoadMoreBtn();
}
/**function controls if the ul of each card has overflow (scrollHeight > clientHeight) or not and displays the expand Btn if overflow is true
 * 
 */

function checkIfDataHasOverflow(){
     document.querySelectorAll(".character-card").forEach(card => {
        const cardInfo = card.querySelector(".card-info");
        const expandBtn = card.querySelector(".expand-btn");
        const hasOverflow = cardInfo.scrollHeight > cardInfo.clientHeight;
            if (hasOverflow) {
            expandBtn.style.visibility = "visible";
            } else {
                expandBtn.style.visibility = "hidden";
            }
    });
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
        imageUrl,
        _id,
    } = character
    return `<li class="character-card" id="card-${_id}">
        <div class="card-headline">
        <h2>${characterName}</h2>
        </div>
        <div class="card-img-wrapper">
        <img src="${imageUrl || "./assets/clker-free-vector-images-mickey-311577.svg"}" alt="${characterName}" loading="lazy" onerror="handleImageError(this)"> 
        </div>
        ${!imageUrl ? '<p class="img-error">Image not available</p>' : ''}
        <div class="card-info">
        ${buildInfoList(character)}
        </div>
        <button class="expand-btn" onclick="toggleCard('card-${_id}')">Display more</button>
        </li>`; 
}

function handleImageError(imgElement){
    imgElement.src ='./assets/clker-free-vector-images-mickey-311577.svg';
    if (!imgElement.dataset.errorHandled) {
        imgElement.insertAdjacentHTML('afterend', '<p><i>Image not available</i></p>');
        imgElement.dataset.errorHandled = true;
    }
}

function toggleCard(cardId){
    const expandedCard = document.getElementById(cardId);
    expandedCard.classList.toggle("expanded");
    const expandBtn = expandedCard.querySelector(".expand-btn");
    expandBtn.innerText = expandedCard.classList.contains("expanded") ? "Display less" : "Display more";
}

function buildInfoList(character){
    const categories = [
        {label: "Films", data: character.films},
        {label: "Short Films", data: character.shortFilms},
        {label: "TV Shows", data: character.tvShows},
        {label: "Video Games", data: character.videoGames},
    ];
    const filledCategories = categories.filter(category => category.data && category.data.length > 0);
    if (filledCategories.length === 0) {
        return displayNoInfo();
    }
    let html = "";
    filledCategories.forEach (category => {
    html += displayCategoryInfo(category)
    }); 
    return html;
}

function displayCategoryInfo(category){
    return `<ul><b>${category.label}</b>: ${category.data.join(", ")}</ul>`
}

function displayNoInfo(){
    return `<p> No additional info available </p>`
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
        checkIfDataHasOverflow();
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
