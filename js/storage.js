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


/* =========================
   CLOTHING LIFECYCLE
========================= */

// Archive clothing without permanently deleting it.
function archiveClothingItem(id) {
    const items = getClothingItems();

    const itemExists = items.some(
        item => item.id === id
    );

    if (!itemExists) {
        return false;
    }

    const updatedItems = items.map(item => {
        if (item.id === id) {
            return {
                ...item,
                status: "archived",
                archivedDate: new Date()
                    .toISOString()
                    .split("T")[0]
            };
        }

        return item;
    });

    saveClothingItems(updatedItems);
    return true;
}


// Restore an archived clothing item.
function restoreClothingItem(id) {
    const items = getClothingItems();

    const itemExists = items.some(
        item => item.id === id
    );

    if (!itemExists) {
        return false;
    }

    const updatedItems = items.map(item => {
        if (item.id === id) {
            return {
                ...item,
                status: "active",
                archivedDate: null
            };
        }

        return item;
    });

    saveClothingItems(updatedItems);
    return true;
}


// Record that a clothing item was worn today.
function recordClothingWear(id) {
    const items = getClothingItems();

    const item = items.find(
        item => item.id === id
    );

    if (!item) {
        return false;
    }

    if (item.status === "archived") {
        alert("Restore this item before recording it as worn.");
        return false;
    }

    const today = new Date()
        .toISOString()
        .split("T")[0];

    const updatedItems = items.map(item => {
        if (item.id === id) {
            return {
                ...item,
                lastWornDate: today,
                wearCount: (item.wearCount || 0) + 1
            };
        }

        return item;
    });

    saveClothingItems(updatedItems);
    return true;
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
