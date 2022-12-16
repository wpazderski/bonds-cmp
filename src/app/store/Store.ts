import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import bondsReducer from "./BondsSlice";
import uiReducer from "./UiSlice";
import settingsReducer from "./SettingsSlice";

export const store = configureStore({
    reducer: {
        bonds: bondsReducer,
        ui: uiReducer,
        settings: settingsReducer,
    },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
