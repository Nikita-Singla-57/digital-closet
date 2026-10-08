const STORAGE_KEY = "digitalClosetItems";


function getClothingItems() {

    const items = localStorage.getItem(STORAGE_KEY);

    if (!items) {
        return [];
    }

    return JSON.parse(items);
}


function saveClothingItems(items) {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(items)
    );
}


function addClothingItem(item) {

    const items = getClothingItems();

    items.push(item);

    saveClothingItems(items);
}


function deleteClothingItem(id) {

    const items =
        getClothingItems();


    const item =
        items.find(
            item => item.id === id
        );


    if (!item) {
        return;
    }


    const confirmed =
        confirm(
            `Are you sure you want to delete "${item.name}"?`
        );


    if (!confirmed) {
        return;
    }


    const updatedItems =
        items.filter(
            item => item.id !== id
        );


    saveClothingItems(
        updatedItems
    );

}

const OUTFITS_STORAGE_KEY = "digitalClosetOutfits";


function getOutfits() {

    const outfits =
        localStorage.getItem(OUTFITS_STORAGE_KEY);

    if (!outfits) {
        return [];
    }

    return JSON.parse(outfits);
}


function saveOutfits(outfits) {

    localStorage.setItem(
        OUTFITS_STORAGE_KEY,
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