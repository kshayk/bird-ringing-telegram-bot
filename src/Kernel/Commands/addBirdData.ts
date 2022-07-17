import BirdDatabase from "./Databases/BirdDatabase";

// TODO: Dont forget to change the birdKeyword and the data
let data = [];
data.push({
    description: "אצל שרקרקים צעירים בקיץ, נוכל להבחין בעין אדמדמה חומה (בניגוד לאדומה בוהקת אצל בוגרים) ושתי נוצות הזנב האמצעיות אשר שוות באורכן לשאר נוצות הזנב (בניגוד לבוגרים ששתי הנוצות המרכזיות ארוכות יותר מהשאר).",
    images: [
        "https://res.cloudinary.com/ddx6dxcwf/image/upload/v1657383798/birds/european-bee-eater/juvenile/PXL_20220709_072221462_oqhpj5.jpg",
        "https://res.cloudinary.com/ddx6dxcwf/image/upload/v1657383796/birds/european-bee-eater/juvenile/PXL_20220709_072123446_fug1ef.jpg",
    ],
    title: "צעיר בקיץ"
});

const birdName = "שרקרק מצוי";
const birdNameEn = "European Bee Eater";
const birdKeyWord = "שרקרק-מצוי";

new BirdDatabase(birdKeyWord).addNewBird({birdName, birdNameEn, data});

