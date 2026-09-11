const BASE_URL = "https://api.disneyapi.dev/";
const loadMoreBtnContainer = document.getElementById("load-more-btn-container");
let pageNumber = 1;
let allCharacters = [];


function init(){
    loadVisibleDisneyCharacters("character", pageNumber);
    loadAllCharacters();
}


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


function renderDisneyCharacters(dataList){
    const list = document.getElementById("character-list");
    let html = ""; 
    for (let characterIndex = 0; characterIndex < dataList.length; characterIndex++) {
        const character = dataList[characterIndex];
        html += displayCharacterCard(character); 
    }
    list.innerHTML += html; 
}


function waitForData(){
    checkIfDataHasOverflow();
    hideLoadingSpinner();
    renderLoadMoreBtn();
}


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


function renderLoadMoreBtn(){
    loadMoreBtnContainer.innerHTML = displayLoadMoreBtn();
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
    return renderCategoryInfo(filledCategories);
}


function renderCategoryInfo(filledCategories){
    let html = "";
    filledCategories.forEach (category => {
    html += displayCategoryInfo(category)
    }); 
    return html;
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
    if(searchedCharacters.length === 0) displayNoCharactersFound(errorSection);
    else {
        renderDisneyCharacters(searchedCharacters);
        checkIfDataHasOverflow();
    }
    inputField.value = "";
    showBacktoStartBtn();
}


function showBacktoStartBtn(){
    loadMoreBtnContainer.innerHTML = displayBackToStartBtn();
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
    pageNumber = pageNumber >= 149 ? 1 : pageNumber +1 ; 
    loadVisibleDisneyCharacters("character", pageNumber);
}
