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