class rate{
    constructor(customerID, productID, rateValue, rate, rateDate, reviewBody, reviewTitle) {
        this.customerID = customerID;
        this.productID = productID;
        this.rateValue = rateValue;
        this.rate = rate;
        this.rateDate = rateDate;
        this.reviewBody = reviewBody;
        this.reviewTitle = reviewTitle;
    }
}

class report{
    constructor(customerID, storeID, criticize) {
        this.customerID = customerID;
        this.storeID = storeID;
        this.criticize = criticize;
    }
}

export {
    rate,
    report
}