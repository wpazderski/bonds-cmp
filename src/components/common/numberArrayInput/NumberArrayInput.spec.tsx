import "@testing-library/jest-dom";

import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { renderWithWrapper, TestUtils } from "../../../TestUtils";
import { NumberArrayInput } from "./NumberArrayInput";





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
        <NumberArrayInput
            value={[2, 3, 5, 7, 11, 13]}
            onValueChange={() => {}}
            forDuration={{ num: 5, unit: "y" }}
            suffix="%"
            min={0}
            max={100}
            decimalScale={2}
            allowNegative={true}
        />
    );
    const numberArrayInput = screen.getByTestId("NumberArrayInput");
    expect(numberArrayInput).toBeInTheDocument();
});

it("renders correct number of inputs with correct values", () => {
    renderWithWrapper(
        <NumberArrayInput
            value={[2, 3, 5, 7, 11, 13]}
            onValueChange={() => {}}
            forDuration={{ num: 5, unit: "y" }}
            suffix="%"
            min={0}
            max={100}
            decimalScale={2}
            allowNegative={true}
        />
    );
    const numberArrayInput = screen.getByTestId("NumberArrayInput").querySelectorAll("input");
    expect(numberArrayInput.length).toEqual(6);
});


it("triggers onValueChange", async () => {
    const onValueChange = jest.fn();
    renderWithWrapper(
        <NumberArrayInput
            value={[2, 3, 5, 7, 11, 13]}
            onValueChange={onValueChange}
            forDuration={{ num: 5, unit: "y" }}
            suffix="%"
            min={0}
            max={100}
            decimalScale={2}
            allowNegative={true}
        />
    );
    const input = screen.getByTestId("NumberArrayInput").querySelector("input");
    userEvent.type(input!, "{backspace}{backspace}5");
    await waitFor(() => {
        expect(onValueChange).toBeCalled();
    });
});
