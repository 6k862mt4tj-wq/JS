console.log("02-selectors.js started")

const title = document.querySelector("#shopTitle");
console.log(title);

console.log(typeof title);

console.log(title.textContent);

const product = document.querySelector(".product");
console.log(product);


const products = document.querySelectorAll(".product");
console.log(products);

console.log(products.length);

products.forEach((product) => {
  console.log(product.textContent);
});


// variables -> collections -> forEach -> callback

const price = document.querySelector("#price");
console.log(price);

console.log(price.textContent);




