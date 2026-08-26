const BASE_URL = "https://api.disneyapi.dev/character";

function init(){
    loadDisneyCharacters();
}

async function loadDisneyCharacters() {
    try {
        const response = await fetch(BASE_URL);
        const data = await response.json();
        const dataList = (data.data).slice(0,20); // nur die ersten 20 Character anzeigen lassen
        console.log(dataList);
        renderDisneyCharacters(dataList);
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

// TO DO: durch die games und filme/shortfilms iterieren 
// button mit load more
//button mit search function