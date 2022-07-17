import BirdDatabase from "./Databases/BirdDatabase";

// TODO: Dont forget to change the birdKeyword and the data
let birdKeyWord = "קנית-בצרה";
let birdName = "קנית בצרה בדיקה";

new BirdDatabase(birdKeyWord).updateBird({birdName});

