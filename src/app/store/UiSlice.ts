import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "./Store";





export type AppMainTabs = "settings" | "bonds" | "charts" | "exportImport";

export interface UiState {
    openTabId: AppMainTabs;
    openBondsId: string;
}

export const initialState: UiState = {
    openTabId: "settings",
    openBondsId: "",
};

export const settingsSlice = createSlice({
    name: "settings",
    initialState,
    reducers: {
        setOpenTabId: (state, action: PayloadAction<AppMainTabs>) => {
            state.openTabId = action.payload;
        },
        setOpenBondsId: (state, action: PayloadAction<string>) => {
            state.openBondsId = action.payload;
        },
    },
});

export const {
    setOpenTabId,
    setOpenBondsId,
} = settingsSlice.actions;

export const selectOpenTabId = (state: RootState) => state.ui.openTabId;
export const selectOpenBondsId = (state: RootState) => state.ui.openBondsId;

export default settingsSlice.reducer;
