import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Bonds } from "../bonds/Types";
import { RootState } from "./Store";





export interface BondsState {
    availableBonds: Bonds[];
}

const initialState: BondsState = {
    availableBonds: [
        {
            id: "pl3mOTS122022",
            name: "3m OTS 12.2022",
            unitPrice: 100,
            capitalization: false,
            interestPeriods: [
                {
                    id: "ip1",
                    repeats: 1,
                    duration: { num: 3, unit: "m" },
                    interestRate: { additivePercent: 3.00, additiveInflation: false, additiveReferenceRate: false },
                    cancellationPolicy: { fixedPenalty: 0.00, percentOfInterestPeriodInterest: 0, percentOfTotalInterest: 100, limitedToInterestPeriodInterest: false, limitedToTotalInterest: false },
                },
            ],
        },
        {
            id: "pl1yROR122022",
            name: "1y ROR 12.2022",
            unitPrice: 100,
            capitalization: false,
            interestPeriods: [
                {
                    id: "ip1",
                    repeats: 1,
                    duration: { num: 1, unit: "m" },
                    interestRate: { additivePercent: 6.75, additiveInflation: false, additiveReferenceRate: false },
                    cancellationPolicy: { fixedPenalty: 0.50, percentOfInterestPeriodInterest: 0, percentOfTotalInterest: 0, limitedToInterestPeriodInterest: false, limitedToTotalInterest: true },
                },
                {
                    id: "ip2",
                    repeats: 11,
                    duration: { num: 1, unit: "m" },
                    interestRate: { additivePercent: 0.00, additiveInflation: false, additiveReferenceRate: true },
                    cancellationPolicy: { fixedPenalty: 0.50, percentOfInterestPeriodInterest: 0, percentOfTotalInterest: 0, limitedToInterestPeriodInterest: false, limitedToTotalInterest: false },
                },
            ],
        },
        {
            id: "pl2yDOR122022",
            name: "2y DOR 12.2022",
            unitPrice: 100,
            capitalization: false,
            interestPeriods: [
                {
                    id: "ip1",
                    repeats: 1,
                    duration: { num: 1, unit: "m" },
                    interestRate: { additivePercent: 6.85, additiveInflation: false, additiveReferenceRate: false },
                    cancellationPolicy: { fixedPenalty: 0.70, percentOfInterestPeriodInterest: 0, percentOfTotalInterest: 0, limitedToInterestPeriodInterest: false, limitedToTotalInterest: true },
                },
                {
                    id: "ip2",
                    repeats: 23,
                    duration: { num: 1, unit: "m" },
                    interestRate: { additivePercent: 0.10, additiveInflation: false, additiveReferenceRate: true },
                    cancellationPolicy: { fixedPenalty: 0.70, percentOfInterestPeriodInterest: 0, percentOfTotalInterest: 0, limitedToInterestPeriodInterest: false, limitedToTotalInterest: false },
                },
            ],
        },
        {
            id: "pl3yTOS122022",
            name: "3y TOS 12.2022",
            unitPrice: 100,
            capitalization: true,
            interestPeriods: [
                {
                    id: "ip1",
                    repeats: 3,
                    duration: { num: 1, unit: "y" },
                    interestRate: { additivePercent: 6.85, additiveInflation: false, additiveReferenceRate: false },
                    cancellationPolicy: { fixedPenalty: 0.70, percentOfInterestPeriodInterest: 0, percentOfTotalInterest: 0, limitedToInterestPeriodInterest: false, limitedToTotalInterest: true },
                },
            ],
        },
        {
            id: "pl4yCOI122022",
            name: "4y COI 12.2022",
            unitPrice: 100,
            capitalization: false,
            interestPeriods: [
                {
                    id: "ip1",
                    repeats: 1,
                    duration: { num: 1, unit: "y" },
                    interestRate: { additivePercent: 7.00, additiveInflation: false, additiveReferenceRate: false },
                    cancellationPolicy: { fixedPenalty: 0.70, percentOfInterestPeriodInterest: 0, percentOfTotalInterest: 0, limitedToInterestPeriodInterest: false, limitedToTotalInterest: true },
                },
                {
                    id: "ip2",
                    repeats: 3,
                    duration: { num: 1, unit: "y" },
                    interestRate: { additivePercent: 1.00, additiveInflation: true, additiveReferenceRate: false },
                    cancellationPolicy: { fixedPenalty: 0.70, percentOfInterestPeriodInterest: 0, percentOfTotalInterest: 0, limitedToInterestPeriodInterest: false, limitedToTotalInterest: false },
                },
            ],
        },
        {
            id: "pl10yEDO122022",
            name: "10y EDO 12.2022",
            unitPrice: 100,
            capitalization: true,
            interestPeriods: [
                {
                    id: "ip1",
                    repeats: 1,
                    duration: { num: 1, unit: "y" },
                    interestRate: { additivePercent: 7.25, additiveInflation: false, additiveReferenceRate: false },
                    cancellationPolicy: { fixedPenalty: 2.00, percentOfInterestPeriodInterest: 0, percentOfTotalInterest: 0, limitedToInterestPeriodInterest: false, limitedToTotalInterest: true },
                },
                {
                    id: "ip2",
                    repeats: 9,
                    duration: { num: 1, unit: "y" },
                    interestRate: { additivePercent: 1.25, additiveInflation: true, additiveReferenceRate: false },
                    cancellationPolicy: { fixedPenalty: 2.00, percentOfInterestPeriodInterest: 0, percentOfTotalInterest: 0, limitedToInterestPeriodInterest: false, limitedToTotalInterest: true },
                },
            ],
        },
    ],
};

export const bondsSlice = createSlice({
    name: "bonds",
    initialState,
    reducers: {
        setBonds: (state, action: PayloadAction<BondsState>) => {
            state.availableBonds = action.payload.availableBonds;
        },
        setAvailableBonds: (state, action: PayloadAction<Bonds[]>) => {
            state.availableBonds = action.payload;
        },
        addAvailableBonds: (state, action: PayloadAction<Bonds>) => {
            state.availableBonds.push(action.payload);
        },
        removeAvailableBonds: (state, action: PayloadAction<string>) => {
            const idx = state.availableBonds.findIndex(bonds => bonds.id === action.payload);
            if (idx >= 0) {
                state.availableBonds.splice(idx, 1);
            }
        },
        updateAvailableBonds: (state, action: PayloadAction<{ id: string, bonds: Bonds }>) => {
            const idx = state.availableBonds.findIndex(bonds => bonds.id === action.payload.id);
            if (idx >= 0) {
                state.availableBonds[idx] = action.payload.bonds;
            }
        },
    },
});

export const {
    setBonds,
    setAvailableBonds,
    addAvailableBonds,
    removeAvailableBonds,
    updateAvailableBonds,
} = bondsSlice.actions;

export const selectBonds = (state: RootState) => state.bonds;
export const selectAvailableBonds = (state: RootState) => state.bonds.availableBonds;

export default bondsSlice.reducer;
