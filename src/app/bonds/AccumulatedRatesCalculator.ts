import { RatesCalculator } from "./RatesCalculator";

export class AccumulatedRatesCalculator {
    
    private annualRates: number[];
    private accumulatedAnnualRates: number[];
    private accumulatedMonthlyRates: number[];
    
    constructor(ratesCalculator: RatesCalculator, private numYears: number) {
        this.annualRates = ratesCalculator.getAnnualRates();
        this.accumulatedAnnualRates = this.calculateAccumulatedAnnualRates();
        this.accumulatedMonthlyRates = this.calculateAccumulatedMonthlyRates();
    }
    
    private calculateAccumulatedAnnualRates(): number[] {
        const accAnnualRates: number[] = [];
        accAnnualRates[0] = 0;
        for (let year = 0; year < this.numYears - 1; ++year) {
            const prevRatio = 1.0 + accAnnualRates[year];
            const currRatio = 1.0 + this.annualRates[year + 1];
            const accRatio = prevRatio * currRatio;
            const currAccRates = accRatio - 1.0;
            accAnnualRates.push(currAccRates);
        }
        return accAnnualRates;
    }
    
    private calculateAccumulatedMonthlyRates(): number[] {
        const accMonthlyRates: number[] = [];
        for (let year = 0; year < this.numYears - 1; year++) {
            const startingRates = this.accumulatedAnnualRates[year];
            const endingRates = this.accumulatedAnnualRates[year + 1];
            for (let month = 0; month < 12; ++month) {
                const p = month / 12;
                const q = (1.0 - p);
                const currAccRates = startingRates * q + endingRates * p;
                accMonthlyRates.push(currAccRates);
            }
        }
        accMonthlyRates.push(this.accumulatedAnnualRates[this.accumulatedAnnualRates.length - 1]);
        return accMonthlyRates;
    }
    
    getAccumulatedAnnualRates(): number[] {
        return [...this.accumulatedAnnualRates];
    }
    
    getAccumulatedMonthlyRates(): number[] {
        return [...this.accumulatedMonthlyRates];
    }
    
    getAccumulatedRateByMonth(monthId: number): number {
        return this.accumulatedMonthlyRates[monthId];
    }
    
}
