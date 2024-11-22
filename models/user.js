export default class User {
    constructor(UID, address, customerID, email, joinDate, name, rate, role, storeID) {
        this.UID = UID;
        this.email = email;
        this.address = address;
        this.customerID = customerID;
        this.joinDate = joinDate;
        this.name = name;
        this.rate = rate;
        this.role = role;
        this.storeID = storeID;
    }
}