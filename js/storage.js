// Get the currently logged-in user's ID.
function getCurrentUserId() {
    return localStorage.getItem("digitalClosetCurrentUser");
}

// Generate a separate storage key for each user.
function getClothingStorageKey() {
    return `digitalClosetItems_${getCurrentUserId()}`;
}

function getOutfitsStorageKey() {
    return `digitalClosetOutfits_${getCurrentUserId()}`;
}


// ---------------- CLOTHING STORAGE ----------------

function getClothingItems() {
    const userId = getCurrentUserId();

    if (!userId) {
        return [];
    }

    const items = localStorage.getItem(
        getClothingStorageKey()
    );

    if (!items) {
        return [];
    }

    return JSON.parse(items);
}

function saveClothingItems(items) {
    if (!getCurrentUserId()) {
        return;
    }

    localStorage.setItem(
        getClothingStorageKey(),
        JSON.stringify(items)
    );
}

function addClothingItem(item) {
    const items = getClothingItems();

    items.push(item);

    saveClothingItems(items);
}

function deleteClothingItem(id) {
    const items = getClothingItems();

    const item = items.find(
        item => item.id === id
    );

    if (!item) {
        return;
    }

    const confirmed = confirm(
        `Are you sure you want to delete "${item.name}"?`
    );

    if (!confirmed) {
        return;
    }

    const updatedItems = items.filter(
        item => item.id !== id
    );

    saveClothingItems(updatedItems);
}


// ---------------- OUTFIT STORAGE ----------------

function getOutfits() {
    const userId = getCurrentUserId();

    if (!userId) {
        return [];
    }

    const outfits = localStorage.getItem(
        getOutfitsStorageKey()
    );

    if (!outfits) {
        return [];
    }

    return JSON.parse(outfits);
}

function saveOutfits(outfits) {
    if (!getCurrentUserId()) {
        return;
    }

    localStorage.setItem(
        getOutfitsStorageKey(),
        JSON.stringify(outfits)
    );
}

function saveOutfitToStorage(outfit) {
    const outfits = getOutfits();

    outfits.push(outfit);

    saveOutfits(outfits);
}

function deleteOutfit(id) {
    const outfits = getOutfits();

    const outfit = outfits.find(
        outfit => outfit.id === id
    );

    if (!outfit) {
        return;
    }

    const confirmed = confirm(
        `Are you sure you want to delete "${outfit.name}"?`
    );

    if (!confirmed) {
        return;
    }

    const updatedOutfits = outfits.filter(
        outfit => outfit.id !== id
    );

    saveOutfits(updatedOutfits);
}

function updateOutfit(updatedOutfit) {
    const outfits = getOutfits();

    const updatedOutfits = outfits.map(outfit => {
        if (outfit.id === updatedOutfit.id) {
            return updatedOutfit;
        }

        return outfit;
    });

    saveOutfits(updatedOutfits);
}
