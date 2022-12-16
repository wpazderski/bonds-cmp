import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Duration } from "../bonds/Types";
import { RootState } from "./Store";

export interface SettingsState {
    currency: string;
    amountToInvest: number;
    investmentDuration: Duration;
    investmentIncomeTax: number;
    adjustInterestRatePercentage: boolean;
    inflationRates: number[];
    referenceRates: number[];
}

const initialState: SettingsState = {
    currency: "PLN",
    amountToInvest: 10000,
    investmentDuration: { num: 10, unit: "y" },
    investmentIncomeTax: 19.00,
    adjustInterestRatePercentage: true,
    inflationRates: [20, 10, 8, 5, 5, 4, 4, 3, 3, 3, ...new Array(110).fill(2.5)],
    referenceRates: [ 9,  7, 4, 2, 2, 2, 1, 1, 1, 1, ...new Array(110).fill(1)],
};

export const settingsSlice = createSlice({
    name: "settings",
    initialState,
    reducers: {
        setSettings: (state, action: PayloadAction<SettingsState>) => {
            state.currency = action.payload.currency;
            state.amountToInvest = action.payload.amountToInvest;
            state.investmentDuration = action.payload.investmentDuration;
            state.investmentIncomeTax = action.payload.investmentIncomeTax;
            state.adjustInterestRatePercentage = action.payload.adjustInterestRatePercentage;
            state.inflationRates = action.payload.inflationRates;
            state.referenceRates = action.payload.referenceRates;
        },
        setCurrency: (state, action: PayloadAction<string>) => {
            state.currency = action.payload;
        },
        setAmountToInvest: (state, action: PayloadAction<number>) => {
            state.amountToInvest = action.payload;
        },
        setInvestmentDuration: (state, action: PayloadAction<Duration>) => {
            state.investmentDuration = action.payload;
        },
        setInvestmentIncomeTax: (state, action: PayloadAction<number>) => {
            state.investmentIncomeTax = action.payload;
        },
        setAdjustInterestRatePercentage: (state, action: PayloadAction<boolean>) => {
            state.adjustInterestRatePercentage = action.payload;
        },
        setInflationRates: (state, action: PayloadAction<number[]>) => {
            state.inflationRates = action.payload;
        },
        setReferenceRates: (state, action: PayloadAction<number[]>) => {
            state.referenceRates = action.payload;
        },
    },
});

export const {
    setSettings,
    setCurrency,
    setAmountToInvest,
    setInvestmentDuration,
    setAdjustInterestRatePercentage,
    setInvestmentIncomeTax,
    setInflationRates,
    setReferenceRates,
} = settingsSlice.actions;

export const selectSettings = (state: RootState) => state.settings;
export const selectCurrency = (state: RootState) => state.settings.currency;
export const selectAmountToInvest = (state: RootState) => state.settings.amountToInvest;
export const selectInvestmentDuration = (state: RootState) => state.settings.investmentDuration;
export const selectInvestmentIncomeTax = (state: RootState) => state.settings.investmentIncomeTax;
export const selectAdjustInterestRatePercentage = (state: RootState) => state.settings.adjustInterestRatePercentage;
export const selectInflationRates = (state: RootState) => state.settings.inflationRates;
export const selectReferenceRates = (state: RootState) => state.settings.referenceRates;

export default settingsSlice.reducer;
