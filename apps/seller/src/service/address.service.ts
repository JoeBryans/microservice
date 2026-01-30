import AddressModel from "../model/address.model";

export class AddressService {
    constructor() { }
    async create(addressData: any, next: any) {
        try {

            if (!addressData.userId) {
                return next(new Error("userId is required"));
            }
            const { userId, country, city, state, zipCode, location } = addressData;

            const address = await AddressModel.create({
                userId,
                country,
                city,
                state,
                zipCode,
                location,
                isActive: true,
            });
            return address;
        } catch (error) {
            console.error(error);
            return next(error);
        }
    }
}