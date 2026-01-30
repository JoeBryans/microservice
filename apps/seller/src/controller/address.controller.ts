
import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { HttpErrorBadRequest } from "@repose/error";
import { asyncHandler } from "../utils/asyncHandler";
import { AddressService } from "../service/address.service";
import { sellerModel } from "../model/seller.model";

const addressService = new AddressService();




export const AddressController = {

    create: asyncHandler(async (req, res, next) => {
        const rawUserId = req.headers["x-user-id"];

        console.log("rawUserId: ", rawUserId);

        if (!rawUserId || Array.isArray(rawUserId)) {
            throw new HttpErrorBadRequest("Invalid user id");
        }

        const userId = new mongoose.Types.ObjectId(rawUserId);

        const { country, city, state, zipCode, location } = req.body;

        if (!country || !city || !state || !zipCode || !location) {
            throw new HttpErrorBadRequest("Please provide all required fields");
        }

        const address = await addressService.create(
            { userId, country, city, state, zipCode, location },
            next
        );

        await sellerModel.updateOne(
            { userId },
            {
                $set: {
                    onboardingStep: "ADDRESS_ADDED",
                    addressInfo: { country, city, state, zipCode, location }
                },
                $push: {
                    onboardingHistory: {
                        step: "ADDRESS_ADDED",
                        status: "COMPLETED",
                        reason: "",
                        timestamp: new Date()
                    }
                }
            }

        );

        return res.status(201).json(address);
    })

}