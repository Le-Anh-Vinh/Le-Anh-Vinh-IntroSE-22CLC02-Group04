import MyError from '../cerror.js';

class cart{
    constructor(productID, customerID, cartValue, cartQuantity) {
        this.productID = productID;
        this.customerID = customerID; 
        this.cartValuealue = cartValue;
        this.cartQuantity = cartQuantity;
        this.tick = false;
    }
}

class orderDetail{
    constructor(orderID, productID, orderValue, productPrice, orderQuantity) {
        this.orderID = orderID;
        this.productID = productID;
        this.orderValue = orderValue;
        this.productPrice = productPrice;
        this.orderQuantity = orderQuantity;
    }
}

class order{
    constructor(orderID, customerID, storeID, createDate, totalProductPrice, shippingFee, orderStatus) {
        this.orderID = orderID;
        this.customerID = customerID;
        this.storeID = storeID;
        this.createDate = createDate;
        this.totalProductPrice = totalProductPrice;
        this.shippingFee = shippingFee;
        this.totalPrice = totalProductPrice + shippingFee;
        this.orderStatus = orderStatus;
    }
}

export {
    cart,
    orderDetail,
    order
}