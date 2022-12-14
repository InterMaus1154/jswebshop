import {
    getArrayOfRandomNumbers,
    listItems,
    appendElements,
    Product,
    getTimeForCaching as time,
    pageIDProducts as products,
    pageIDBasket as basket,
    pageIDHome as home,
    MAX_COUNTDOWN_TIME as MAX_TIME,
    counter_element as counter
} from "./module.js";




/**I add time to the end of time filename, so the browser will refresh it every time it reloads */
const json1_location = "products.json?v="+time;
const json2_location = "articles.json?v="+time;

/**Load data from a separated JSON file, where I store all info of the products*/
async function getData(documentID){

    const response_1 = await fetch(json1_location);
    const data_1 = await response_1.json();

    /*!Unnecessarily loaded, fix later, or not idk i honestly dont care!*/
    const response_2 = await fetch(json2_location);
    const data_2 = await response_2.json();

    checkDocumentID(documentID, data_1, data_2);
}


const onLoadEvents = (event) =>{
    const currentDocument = event.target.querySelector("html");
    const currentDocumentID = currentDocument.getAttribute("data-page-id")

    getData(currentDocumentID).then(r=>{});
}

/** When the page is loaded, it will call the onLoadEvents function which reads the JSON,
 * and check which subpage is it currently on*/
window.onload = onLoadEvents;

/*This function checks which page is it currently on, and then pass the appropriate arguments on*/
function checkDocumentID(documentID, jsonData_1, jsonData_2){
    switch(documentID){
        case home:
            for(let i=0;i<listItems.length;i++){
                if(listItems[i].querySelector("span").innerText.toLowerCase() == home.toLowerCase()){
                    listItems[i].style.textDecoration = "underline";
                }
            }
            useDataOnHome(jsonData_1, jsonData_2);
            break;
        case products:
            break;
        case basket:
            break;
    }
}

/**
* Settings for the "Add to basket" button
* */
const addBasketBtn = document.createElement("button");
addBasketBtn.classList.add("add-to-basket-button");
addBasketBtn.innerText = "Add to basket";

/**/


function useDataOnHome(jsonData_1, jsonData_2){

    loadProductsIntoLatestBar(jsonData_1);
    loadGoodToKnowBar(jsonData_2);

    setInterval(timer, 1000);

    let index = MAX_TIME;
    //in {MAX_TIME}(defined in the external module) seconds the newest products bar will be reloaded,
    // and new products will be rendered randomly
    function timer(){
        counter.innerText = index--;
        if(index == 0){
            loadProductsIntoLatestBar(jsonData_1);
            index = MAX_TIME;
        }
    }
}


/**Load the "Good to know" articles*/
function loadGoodToKnowBar(jsonData_2){
    const descBoxesContainer = document.querySelector(".description-boxes");

    const descriptionBox = document.createElement("div");
    descriptionBox.classList.add("description-box");

    const sectionTitle = document.createElement("div");
    sectionTitle.classList.add("section-title");

    const sectionContent = document.createElement("div");
    sectionContent.classList.add("section-content");

    const articles = jsonData_2.articles;

    for(let i=0;i<articles.length;i++){
        sectionTitle.innerText = articles[i].title;
        sectionContent.innerText = articles[i].content;

        descriptionBox.append(sectionTitle);
        descriptionBox.append(sectionContent);

        if(i == articles.length - 1){
            descriptionBox.id = "jumpDown";
        }

        const descBoxClone = descriptionBox.cloneNode(true);

        descBoxesContainer.append(descBoxClone)

    }
}






/**Load the newest products bar */
function loadProductsIntoLatestBar(jsonData_1){

    const latestProductsContainer = document.querySelector(".latest-products-container");
    latestProductsContainer.innerHTML = "";
    const latestProductBox = document.createElement("div");
    latestProductBox.style.setProperty("--delay-time", MAX_TIME - 1 + "s");
    const processors = jsonData_1.products[0].processors;
    const productImage = document.createElement("img");


    latestProductBox.classList.add("latest-product-box");


    const arrayOfRandoms = getArrayOfRandomNumbers();

    for(let i=0;i<4;i++){
        const processorImgFolder = processors[processors.length-1].image_folder;
        const processorImgID = processors[arrayOfRandoms[i]].image_id;

        productImage.src = processorImgFolder + processorImgID + ".jpg?v=" + time;

        latestProductBox.setAttribute("data-content-value", processors[arrayOfRandoms[i]].name)

        appendElements(latestProductBox, [productImage, addBasketBtn])

        const ltbClone = latestProductBox.cloneNode(true);
        ltbClone.jsonObject = processors[arrayOfRandoms[i]];
        ltbClone.imageFolder = processorImgFolder;
        ltbClone.addEventListener("click", checkEventSource);

        latestProductsContainer.append(ltbClone);
    }
}

//in this function the source of the event is checked, whether it is the container div or the image
function checkEventSource(event){


    const target = event.target;

    //check if it is the container element
    //by checking if it has children or not; only the box container element has children{img, btn}
    if(target.hasChildNodes()){
        goToProductPage(target.jsonObject);
    }
    //if the img is clicked, the same event will be triggered
    if(target.tagName == "IMG"){
        goToProductPage(target.parentNode.jsonObject)
    }else if(target.tagName == "BUTTON"){
        addToBasket(event);
    }



}

//open the page of product
function goToProductPage(object){

}

//an array containing the elements of basket
let basketArray = [];

/*A function which adds products to the basket*/
function addToBasket(event){
    const jsonObject = event.target.parentNode.jsonObject;
    const imageFolder = event.target.parentNode.imageFolder;

    basketArray.push(
      new Product(jsonObject, imageFolder, 1)
    );

    updateBasket(false);
    checkIfBasketIsEmpty();
   

}


/**Interaction for responsive dropdown section*/

const openSectionBtn = document.querySelector(".open-section");
const arrowImage = openSectionBtn.querySelector("img");
const descBoxesContainer = document.querySelector(".description-boxes");


openSectionBtn.addEventListener("click", ()=>{
   arrowImage.classList.toggle("rotated");
   descBoxesContainer.classList.toggle("visible-menu");

   if(arrowImage.classList.contains("rotated")){
       window.location = "#jumpDown";
   }else{
       window.location = "#jumpUp";
   }

});


/*** */


/***Interaction for responsive navigation */
const toggleMenuBtn = document.querySelector(".toggle-menu");

const navBar = document.querySelector("nav");
const navBarClassList = navBar.classList;

const toggleMenuBtnImage = toggleMenuBtn.querySelector("img");

toggleMenuBtn.addEventListener("click", () => {
    navBarClassList.toggle("visible-menu");
    if(navBarClassList.contains("visible-menu")) toggleMenuBtnImage.src = "pics/icons/close.png";
    else toggleMenuBtnImage.src = "pics/icons/menu.png";
});
/** */


/** Basket script*/

const basketBtn = document.querySelector(".basket-button");
const basketElement = document.querySelector(".basket");
const closeBasketBtn = document.querySelector(".close-basket-button");

const tempElem = document.createElement("p");

function checkIfBasketIsEmpty(){
    if(basketArray.length == 0){
        tempElem.innerText = "Basket is empty!";
        tempElem.style.textAlign = "center";
        tempElem.style.margin = "1em";
        tempElem.style.fontSize = "1.25em";
		tempElem.style.fontWeight = "bold";
		
        basketElement.append(tempElem);
    }else{
        tempElem.style.display = "none";
    }
}

basketBtn.onclick = () =>{
    basketBtn.classList.toggle("not-visible");
    basketElement.classList.toggle("visible-menu");

    checkIfBasketIsEmpty();
}

closeBasketBtn.onclick = () =>{
    basketBtn.classList.toggle("not-visible");
    basketElement.classList.toggle("visible-menu");
}




function updateBasket(isNew){

    checkIfBasketIsEmpty();

    const basketProducts = document.querySelector(".basket-products");

		const renderedCode =
            `<div class="basket-product grid">
                        <div class="product-image">
                            <img src="${basketArray[basketArray.length-1].imageFolder}${basketArray[basketArray.length-1].jsonObject.image_id}.jpg" alt="">
                        </div>
                        <div class="product-misc">
                            <div class="product-title">${basketArray[basketArray.length-1].jsonObject.name}  $${basketArray[basketArray.length-1].jsonObject.price}</div>
                            <div class="interaction-bar">
                                <div class="product-qty">
                                    <label for="product-quantity">Qty</label>
                                    <input id="product-quantity" value=${basketArray[basketArray.length-1].qty} type="number" autocomplete="off" min="1" max="10">
                                </div>
                            </div>
                        </div>
                    </div>`;
		basketProducts.innerHTML += renderedCode;

}
