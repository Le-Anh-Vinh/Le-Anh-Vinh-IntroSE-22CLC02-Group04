class category {
    constructor(categoryID, categoryName) {
        this.categoryID = categoryID;
        this.categoryName = categoryName;
    }
}

class product {
    constructor(productID, productName, productPrice, categoryID, productDescription, productImage, productQuantity, productStatus, storeID) {
        this.productID = productID;
        this.productName = productName;
        this.productPrice = productPrice;
        this.categoryID = categoryID;
        this.productDescription = productDescription;
        this.productImage = productImage;
        this.productQuantity = productQuantity;
        this.productStatus = productStatus;
        this.storeID = storeID;
    }
}

class productAspect{
    constructor(productID, keyword) {
        this.productID = productID;
        this.keyword = keyword;
    }
}

class productVariation{
    constructor(productID, value) {
        this.productID = productID;
        this.value = value;
    }
}

export {
    category,
    product,
    productAspect,
    productVariation
}