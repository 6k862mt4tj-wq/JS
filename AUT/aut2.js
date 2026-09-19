const database = {
  products: [
    {
      id: 1,
      title: "Apple",
      price: 0.7,
    },
    {
      id: 2,
      title: "Orange",
      price: 2.2,
    },
  ],
  users: [
    {
      id: 1,
      name: "Alex",
      role: "USER",
    },
 
    {
      id: 2,
      name: "John",
      role: "ADMIN",
    },
  ],
};
 
function findProductById(productId) {
  return database.products.find((p) => p.id === productId);
}
 
function findUserById(userId) {
    return database.users.find(u => u.id===userId);
}
 
function canUpdateProduct(user){
    return user.role === 'ADMIN';
}
 
function updatePriceProduct(productId, newPrice, userId){
    const product=findProductById(productId);
    const user = findUserById(userId);
 
    if (!product || !user) {
        return;
    }
 
    if (canUpdateProduct(user)) {
        product.price = newPrice;
    } else {
        console.log("Операция запрещена!");
       
    }
}
 
const product = findProductById(2);
console.log(product);
 
updatePriceProduct(2,2.35,1);
console.log(product)