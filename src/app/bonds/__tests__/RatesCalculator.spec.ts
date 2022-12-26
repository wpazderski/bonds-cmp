import { RatesCalculator } from "../RatesCalculator";





const numYears = 10;
const ratesPercent = [20.0, 12.0, 5.0, 0.0, -2.0, 9.0, 7.5, 6.0, 3.0, 2.5];
const expectedRates = [0.2, 0.12, 0.05, 0.0, -0.02, 0.09, 0.075, 0.06, 0.03, 0.025];
const expectedMonthlyRates = [0.2, 0.1933333, 0.1866667, 0.18, 0.1733333, 0.1666667, 0.16, 0.1533333, 0.1466667, 0.14, 0.1333333, 0.1266667, 0.12, 0.1141667, 0.1083333, 0.1025, 0.0966667, 0.0908333, 0.085, 0.0791667, 0.0733333, 0.0675, 0.0616667, 0.0558333, 0.05, 0.0458333, 0.0416667, 0.0375, 0.0333333, 0.0291667, 0.025, 0.0208333, 0.0166667, 0.0125, 0.0083333, 0.0041667, 0, -0.0016667, -0.0033333, -0.005, -0.0066667, -0.0083333, -0.01, -0.0116667, -0.0133333, -0.015, -0.0166667, -0.0183333, -0.02, -0.0108333, -0.0016667, 0.0075, 0.0166667, 0.0258333, 0.035, 0.0441667, 0.0533333, 0.0625, 0.0716667, 0.0808333, 0.09, 0.08875, 0.0875, 0.08625, 0.085, 0.08375, 0.0825, 0.08125, 0.08, 0.07875, 0.0775, 0.07625, 0.075, 0.07375, 0.0725, 0.07125, 0.07, 0.06875, 0.0675, 0.06625, 0.065, 0.06375, 0.0625, 0.06125, 0.06, 0.0575, 0.055, 0.0525, 0.05, 0.0475, 0.045, 0.0425, 0.04, 0.0375, 0.035, 0.0325, 0.03, 0.0295833, 0.0291667, 0.02875, 0.0283333, 0.0279167, 0.0275, 0.0270833, 0.0266667, 0.02625, 0.0258333, 0.0254167, 0.025];

describe(".getAnnualRates()", () => {
    it("returns correct annual rates", () => {
        const calculator = new RatesCalculator(ratesPercent, numYears);
        expect(calculator.getAnnualRates()).toEqual(expectedRates);
    });
});

describe(".getMonthlyRates()", () => {
    it("returns correct monthly rates", () => {
        const calculator = new RatesCalculator(ratesPercent, numYears);
        const actual = calculator.getMonthlyRates();
        expect(actual.length).toEqual(expectedMonthlyRates.length);
        for (let i = 0; i < actual.length; ++i) {
            expect(actual[i]).toBeCloseTo(expectedMonthlyRates[i], 6);
        }
    });
});

describe(".getRateByMonth()", () => {
    it("returns correct rate for given month", () => {
        const calculator = new RatesCalculator(ratesPercent, numYears);
        expect(calculator.getRateByMonth(0)).toBeCloseTo(expectedMonthlyRates[0], 6);
        expect(calculator.getRateByMonth(10)).toBeCloseTo(expectedMonthlyRates[10], 6);
        expect(calculator.getRateByMonth(11)).toBeCloseTo(expectedMonthlyRates[11], 6);
        expect(calculator.getRateByMonth(12)).toBeCloseTo(expectedMonthlyRates[12], 6);
        expect(calculator.getRateByMonth(13)).toBeCloseTo(expectedMonthlyRates[13], 6);
        expect(calculator.getRateByMonth(105)).toBeCloseTo(expectedMonthlyRates[105], 6);
    });
});
