import { AccumulatedRatesCalculator } from "../AccumulatedRatesCalculator";
import { RatesCalculator } from "../RatesCalculator";





const numYears = 10;
const ratesPercent = [20.0, 12.0, 5.0, 0.0, -2.0, 9.0, 7.5, 6.0, 3.0, 2.5];
const expectedAccumulatedRates = [0, 0.12, 0.176, 0.176, 0.15248, 0.2562032, 0.3504184, 0.4314435, 0.4743869, 0.5112465];
const expectedAccumulatedMonthlyRates = [0, 0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.07, 0.08, 0.09, 0.1, 0.11, 0.12, 0.1246667, 0.1293333, 0.134, 0.1386667, 0.1433333, 0.148, 0.1526667, 0.1573333, 0.162, 0.1666667, 0.1713333, 0.176, 0.176, 0.176, 0.176, 0.176, 0.176, 0.176, 0.176, 0.176, 0.176, 0.176, 0.176, 0.176, 0.17404, 0.17208, 0.17012, 0.16816, 0.1662, 0.16424, 0.16228, 0.16032, 0.15836, 0.1564, 0.15444, 0.15248, 0.1611236, 0.1697672, 0.1784108, 0.1870544, 0.195698, 0.2043416, 0.2129852, 0.2216288, 0.2302724, 0.238916, 0.2475596, 0.2562032, 0.2640545, 0.2719057, 0.279757, 0.2876083, 0.2954595, 0.3033108, 0.3111621, 0.3190133, 0.3268646, 0.3347159, 0.3425671, 0.3504184, 0.3571705, 0.3639226, 0.3706747, 0.3774268, 0.3841789, 0.390931, 0.397683, 0.4044351, 0.4111872, 0.4179393, 0.4246914, 0.4314435, 0.4350221, 0.4386007, 0.4421794, 0.445758, 0.4493366, 0.4529152, 0.4564938, 0.4600724, 0.4636511, 0.4672297, 0.4708083, 0.4743869, 0.4774585, 0.4805302, 0.4836018, 0.4866734, 0.4897451, 0.4928167, 0.4958883, 0.49896, 0.5020316, 0.5051032, 0.5081749, 0.5112465];


describe(".getAccumulatedAnnualRates()", () => {
    it("returns correct accumulated annual rates", () => {
        const calculator = new AccumulatedRatesCalculator(new RatesCalculator(ratesPercent, numYears), numYears);
        const actual = calculator.getAccumulatedAnnualRates();
        expect(actual.length).toEqual(expectedAccumulatedRates.length);
        for (let i = 0; i < actual.length; ++i) {
            expect(actual[i]).toBeCloseTo(expectedAccumulatedRates[i], 6);
        }
    });
});

describe(".getAccumulatedMonthlyRates()", () => {
    it("returns correct accumulated monthly rates", () => {
        const calculator = new AccumulatedRatesCalculator(new RatesCalculator(ratesPercent, numYears), numYears);
        const actual = calculator.getAccumulatedMonthlyRates();
        expect(actual.length).toEqual(expectedAccumulatedMonthlyRates.length);
        for (let i = 0; i < actual.length; ++i) {
            expect(actual[i]).toBeCloseTo(expectedAccumulatedMonthlyRates[i], 6);
        }
    });
});

describe(".getAccumulatedRateByMonth()", () => {
    it("returns correct accumulated rate for given month", () => {
        const calculator = new AccumulatedRatesCalculator(new RatesCalculator(ratesPercent, numYears), numYears);
        expect(calculator.getAccumulatedRateByMonth(0)).toBeCloseTo(expectedAccumulatedMonthlyRates[0], 6);
        expect(calculator.getAccumulatedRateByMonth(10)).toBeCloseTo(expectedAccumulatedMonthlyRates[10], 6);
        expect(calculator.getAccumulatedRateByMonth(11)).toBeCloseTo(expectedAccumulatedMonthlyRates[11], 6);
        expect(calculator.getAccumulatedRateByMonth(12)).toBeCloseTo(expectedAccumulatedMonthlyRates[12], 6);
        expect(calculator.getAccumulatedRateByMonth(13)).toBeCloseTo(expectedAccumulatedMonthlyRates[13], 6);
        expect(calculator.getAccumulatedRateByMonth(105)).toBeCloseTo(expectedAccumulatedMonthlyRates[105], 6);
    });
});
