import TermDatabase from "./Databases/TermDatabase";

// TODO: Dont forget to change the keyword and the data
let photos = [];
photos.push({
    url: "https://res.cloudinary.com/ddx6dxcwf/image/upload/v1657955726/terms/hand-molting/InkedPXL_20220715_063431987-explained_gkz6rv.jpg",
    title: "חילוף אברות יד אצל דרור בקיץ"
});

const termName = "חילוף אברות יד";
const termKeyWord = "חילוף-אברות-יד";
const extras = [];

new TermDatabase(termKeyWord).addNewTerm({termName, photos, extras});

