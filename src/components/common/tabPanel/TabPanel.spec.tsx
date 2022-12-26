import "@testing-library/jest-dom";

import { screen } from "@testing-library/react";

import { renderWithWrapper, TestUtils } from "../../../TestUtils";
import { TabPanel } from "./TabPanel";





beforeAll(() => {
    TestUtils.beforeAll();
});

afterAll(() => {
    TestUtils.afterAll();
});

beforeEach(() => {
    TestUtils.beforeEach();
});

afterEach(() => {
    TestUtils.afterEach();
});

it("renders", () => {
    renderWithWrapper(
        <TabPanel isOpen={true}>
            tb1
        </TabPanel>
    );
    const tabPanels = screen.getByTestId("TabPanel");
    expect(tabPanels).toBeInTheDocument();
});


it("renders", () => {
    renderWithWrapper(
        <div data-testid="TabPanels-wrapper">
            <TabPanel isOpen={true}>
                tb1
            </TabPanel>
            <TabPanel isOpen={false}>
                tb2
            </TabPanel>
        </div>
    );
    const tabPanelsWrapper = screen.getByTestId("TabPanels-wrapper");
    expect(tabPanelsWrapper).toHaveTextContent("tb1");
    expect(tabPanelsWrapper).not.toHaveTextContent("tb2");
});
