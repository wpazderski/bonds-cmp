import { render } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";

import { init as initI18n } from "./app/i18n/init";
import { store } from "./app/store/Store";





export class TestUtils {
    
    static beforeAll(): void {
        initI18n();
    }
    
    static afterAll(): void {
    }
    
    static beforeEach(): void {
    }
    
    static afterEach(): void {
    }
    
}

export function Wrapper(props: React.PropsWithChildren) {
    return (
        <Provider store={store}>
            {props.children}
        </Provider>
    );
}

export function renderWithWrapper(component: React.ReactNode) {
    return render(
        <Wrapper>
            {component}
        </Wrapper>
    );
}
