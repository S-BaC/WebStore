let productData;
let cost = 0;
let selectedItems = [];

$(document).ready(async function(){
    await populateItems();
    showLocations();
    itemClickListener();
}
)

async function populateItems(){
    await fetch('./product.json')
        .then(res => res.json())
        .then(data => {productData = data;});

    $('.products').append(
        `<div class="title">${productData.title}</div>`
    )

    for(let i = 0; i< productData.products.length; i++){
        $('.products').append(
            `<div class="product">
            <div class="category">${productData.products[i].category}</div>
            <div class="itembox"></div>
            </div>`
        )
        for(let j = 0; j < productData.products[i].items.length; j++){
            $('.itembox').eq(i).append(
                `<div class="card">
                <div class="photo">
                    <img src="${productData.products[i].items[j].img}" />
                    <div class="price"><span>Ks</span> <span class="priceAmt"> ${productData.products[i].items[j].price} </span></div>
                </div>
                <div class="detail">
                  <div class="pname">${productData.products[i].items[j].pname}</div>
                  <div class="code">${productData.products[i].items[j].pcode}</div>
                </div>
              </div>`)
        }
    }
    
}

function showLocations(){
    for(key in productData.locations){
        $('#delivery').append(
            `<option value="${productData.locations[key]}">${key} (+${productData.locations[key]} Ks)</option>`
        )
    }
    
}

function itemClickListener(){
    $('.card').mouseup((e)=>{

        let card = e.currentTarget; // The card

        if(selectedItems.includes(card)){
            // If already included, updates the number, price and cost.
            let index = selectedItems.indexOf(card);
            cost -= (Number)($('.itemPrice').eq(index).text());

            let currentPrice = (Number)($('.itemPrice').eq(index).text());
            let currentNum = (Number)($('.itemNum').eq(index).text());

            $('.itemPrice').eq(index).text((currentPrice/currentNum) * (currentNum + 1));  // Find unit price and multiply it by (updated) num.

            $('.itemNum').eq(index).text(currentNum+1);    // Updates the num

            cost += (Number)($('.itemPrice').eq(index).text());
            
        } else {
            // If note included, a new node is added and cost updated.

            selectedItems.push(card);
            let price = (Number)(card.childNodes[1].childNodes[3].childNodes[2].textContent);
            let category = card.parentElement.parentElement.childNodes[1];

            let details = card.childNodes[3].childNodes;
            cost += price;

            $('.calculateItem').append(
                `<div class="selectedItem">
                    <span>${details[3].textContent}</span>
                    <span>${details[1].textContent}</span>
                    <span>${category.textContent}</span>
                    <span class="itemNum">1</span>
                    <span class="itemPrice">${price}</span>
                </div>`)
        }
        
        //  Cost is updated.
        $('.totalCost').remove();
        $('.calculateItem').append(
          `<div class="totalCost">
                    Total Cost: ${cost}
            </div>`  
        )
 })
}