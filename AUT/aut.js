function updateProduct(product, newPrice, user) {
    if (canUpdate(user)){
        product.price = newPrice;
    } else {
        console.log("Операция запрещена");        
    }
}
function canUpdate1(user) { // Вер 1 - самая неудачная
    if (user.role==="ADMIN"){
        return true;
    }
     if (user.role==="MANAGER"){
        return true;
    }
    return false;
}
function canUpdate2(user) { // Вер 2 - чуть получше
    if (user.role==="ADMIN" || user.role==="MANAGER"){
        return true;
    }    
    return false;
}
function canUpdate(user) { // Вер 3 - самая удачная
       return ['ADMIN','MANAGER'].includes(user.role);
}
const user = {
    name: 'Alex',
    role: 'USER'
};
const admin = {
    name: 'John',
    role: 'ADMIN'
};
const manager = {
    name: 'Jack',
    role: 'MANAGER'
};
const product ={
    title: 'Apple',
    price: 0.65
};
console.log(product);
updateProduct(product,0.75,manager);
console.log(product);
