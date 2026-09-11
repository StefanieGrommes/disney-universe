function displayCharacterCard(character){
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


function displayCategoryInfo(category){
    return `<ul><b>${category.label}</b>: ${category.data.join(", ")}</ul>`
}


function displayNoInfo(){
    return `<p> No additional info available </p>`
}


function displayError(errorMessage){
    errorSection.innerHTML = `<p class="error-message">${errorMessage}</p>`
}


function displayNoCharactersFound(errorSection){
errorSection.innerHTML = `<p class="error-message">No characters found.</p>`
}


function displayBackToStartBtn(){
    return `<button class="back-to-start-btn" id="back-to-start-btn">Back to Start</button>`
}


function displayLoadMoreBtn(){
    return `<button class="load-more-btn" id="load-more-btn">Show me more!</button>`
}