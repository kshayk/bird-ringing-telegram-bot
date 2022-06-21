import BirdDatabase from "./birdDatabase/BirdDatabase";

// TODO: Dont forget to change the birdKeyword and the data
let data = [];
data.push({
    description: "בדיקה בדיקה",
    images: [
        "https://res.cloudinary.com/ddx6dxcwf/image/upload/v1655618394/birds/reed-warbler/juvenile%20/%D7%A7%D7%A0%D7%99%D7%AA-%D7%A7%D7%98%D7%A0%D7%94-%D7%A6%D7%A2%D7%99%D7%A8-%D7%A2%D7%99%D7%9F_jlw91r.jpg",
        "https://res.cloudinary.com/ddx6dxcwf/image/upload/v1655618394/birds/reed-warbler/juvenile%20/%D7%A7%D7%A0%D7%99%D7%AA-%D7%A7%D7%98%D7%A0%D7%94-%D7%A6%D7%A2%D7%99%D7%A8-%D7%A2%D7%99%D7%9F_jlw91r.jpg",
        "https://res.cloudinary.com/ddx6dxcwf/image/upload/v1655618394/birds/reed-warbler/juvenile%20/%D7%A7%D7%A0%D7%99%D7%AA-%D7%A7%D7%98%D7%A0%D7%94-%D7%A6%D7%A2%D7%99%D7%A8-%D7%A2%D7%99%D7%9F_jlw91r.jpg",
    ],
    title: "פרט צעיר"
});

data.push({
    description: "בדיקה בדיקה 2",
    images: [
        "https://res.cloudinary.com/ddx6dxcwf/image/upload/v1655618394/birds/reed-warbler/juvenile%20/%D7%A7%D7%A0%D7%99%D7%AA-%D7%A7%D7%98%D7%A0%D7%94-%D7%A6%D7%A2%D7%99%D7%A8-%D7%A2%D7%99%D7%9F_jlw91r.jpg",
        "https://res.cloudinary.com/ddx6dxcwf/image/upload/v1655618394/birds/reed-warbler/juvenile%20/%D7%A7%D7%A0%D7%99%D7%AA-%D7%A7%D7%98%D7%A0%D7%94-%D7%A6%D7%A2%D7%99%D7%A8-%D7%A2%D7%99%D7%9F_jlw91r.jpg",
        "https://res.cloudinary.com/ddx6dxcwf/image/upload/v1655618394/birds/reed-warbler/juvenile%20/%D7%A7%D7%A0%D7%99%D7%AA-%D7%A7%D7%98%D7%A0%D7%94-%D7%A6%D7%A2%D7%99%D7%A8-%D7%A2%D7%99%D7%9F_jlw91r.jpg",
    ],
    title: "פרט בוגר",
    sfdsd: 'sdfs'
});

const birdName = "קנית בצרה";
const birdNameEn = "Basra Reed Warbler";
const birdKeyWord = "קנית-בצרה";

new BirdDatabase(birdKeyWord).addNewBird({birdName, birdNameEn, data});

