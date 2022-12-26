import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";

import bondsReducer from "./BondsSlice";
import settingsReducer from "./SettingsSlice";
import uiReducer from "./UiSlice";





export const store = configureStore({
    reducer: {
        bonds: bondsReducer,
        settings: settingsReducer,
        ui: uiReducer,
    },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
