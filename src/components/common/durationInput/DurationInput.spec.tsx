import "@testing-library/jest-dom";

import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { renderWithWrapper, TestUtils } from "../../../TestUtils";
import { DurationInput } from "./DurationInput";





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
    renderWithWrapper(<DurationInput onValueChange={() => {}} value={{ num: 1, unit: "y" }} />);
    const durationInput = screen.getByTestId("DurationInput");
    expect(durationInput).toBeInTheDocument();
});

it("renders with initial value", () => {
    renderWithWrapper(<DurationInput onValueChange={() => {}} value={{ num: 17, unit: "m" }} />);
    const numInput = screen.getByTestId("DurationInput-num").querySelector("input");
    const unitInput = screen.getByTestId("DurationInput-unit");
    expect(numInput).toHaveValue("17");
    expect(unitInput).toHaveTextContent("months");
});

it("renders label", () => {
    renderWithWrapper(<DurationInput onValueChange={() => {}} value={{ num: 1, unit: "y" }} label="Lorem ipsum" />);
    const label = screen.getByTestId("DurationInput-num").querySelector("label");
    expect(label).toHaveTextContent("Lorem ipsum");
});

it("triggers onValueChange", async () => {
    const onValueChange = jest.fn();
    renderWithWrapper(<DurationInput onValueChange={onValueChange} value={{ num: 17, unit: "m" }} />);
    const numInput = screen.getByTestId("DurationInput-num").querySelector("input");
    userEvent.type(numInput!, "{backspace}{backspace}5");
    await waitFor(() => {
        expect(onValueChange).toBeCalled();
    });
});

it("disallows negative values", async () => {
    renderWithWrapper(<DurationInput onValueChange={() => {}} value={{ num: 17, unit: "m" }} />);
    const numInput = screen.getByTestId("DurationInput-num").querySelector("input");
    const unitInput = screen.getByTestId("DurationInput-unit");
    userEvent.type(numInput!, "{backspace}{backspace}-5");
    await waitFor(() => {
        expect(numInput).toHaveValue("5");
        expect(unitInput).toHaveTextContent("months");
    });
});

it("disallows values above maxMonths and allows values: 1 <= value <= maxMonths", async () => {
    renderWithWrapper(<DurationInput onValueChange={() => {}} value={{ num: 17, unit: "m" }} maxMonths={18} />);
    const numInput = screen.getByTestId("DurationInput-num").querySelector("input");
    const unitInput = screen.getByTestId("DurationInput-unit");
    userEvent.type(numInput!, "{backspace}{backspace}19");
    await waitFor(() => {
        expect(numInput).toHaveValue("1");
        expect(unitInput).toHaveTextContent("months");
    });
    userEvent.type(numInput!, "{backspace}{backspace}18");
    await waitFor(() => {
        expect(numInput).toHaveValue("18");
        expect(unitInput).toHaveTextContent("months");
    });
    userEvent.type(numInput!, "{backspace}{backspace}1");
    await waitFor(() => {
        expect(numInput).toHaveValue("1");
        expect(unitInput).toHaveTextContent("months");
    });
});
