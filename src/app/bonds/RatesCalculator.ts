export interface RatesCalculatorOptions {
    useFirstRateAsBaseForAccumulatedRates: boolean;
}

export class RatesCalculator {
    
    private annualRates: number[];
    private monthlyRates: number[];
    private accumulatedAnnualRates: number[];
    private accumulatedMonthlyRates: number[];
    
    constructor(private rates: number[], private numYears: number, private options: RatesCalculatorOptions) {
        this.numYears++;
        this.rates = [...this.rates, this.rates[this.rates.length - 1]];
        this.annualRates = this.calculateAnnualRates();
        this.monthlyRates = this.calculateMonthlyRates();
        this.accumulatedAnnualRates = this.calculateAccumulatedAnnualRates();
        this.accumulatedMonthlyRates = this.calculateAccumulatedMonthlyRates();
    }
    
    private calculateAnnualRates(): number[] {
        const annualRates: number[] = [];
        for (let year = 0; year <= this.numYears; ++year) {
            const currRates = this.rates[year] / 100;
            annualRates.push(currRates);
        }
        return annualRates;
    }
    
    private calculateMonthlyRates(): number[] {
        const monthlyRates: number[] = [];
        for (let year = 0; year < this.annualRates.length - 1; year++) {
            const startingRates = this.annualRates[year];
            const endingRates = this.annualRates[year + 1];
            for (let month = 0; month < 12; ++month) {
                const p = month / 12;
                const q = (1.0 - p);
                const currRates = startingRates * q + endingRates * p;
                monthlyRates.push(currRates);
            }
        }
        return monthlyRates;
    }
    
    private calculateAccumulatedAnnualRates(): number[] {
        const accAnnualRates: number[] = [];
        accAnnualRates[0] = this.options.useFirstRateAsBaseForAccumulatedRates ? 0 : this.annualRates[0];
        for (let year = 1; year <= this.numYears; ++year) {
            const prevRatio = 1.0 + accAnnualRates[year - 1];
            const currRatio = 1.0 + this.annualRates[year];
            const accRatio = prevRatio * currRatio;
            const currAccRates = accRatio - 1.0;
            accAnnualRates.push(currAccRates);
        }
        return accAnnualRates;
    }
    
    private calculateAccumulatedMonthlyRates(): number[] {
        const accMonthlyRates: number[] = [];
        for (let year = 0; year < this.accumulatedAnnualRates.length - 1; year++) {
            const startingRates = this.accumulatedAnnualRates[year];
            const endingRates = this.accumulatedAnnualRates[year + 1];
            for (let month = 0; month < 12; ++month) {
                const p = month / 12;
                const q = (1.0 - p);
                const currAccRates = startingRates * q + endingRates * p;
                accMonthlyRates.push(currAccRates);
            }
        }
        return accMonthlyRates;
    }
    
    getRateByMonth(monthId: number): number {
        return this.monthlyRates[monthId];
    }
    
    getAccumulatedRate(yearId: number, monthId: number): number {
        const idx = yearId * 12 + monthId;
        return this.getAccumulatedRateByMonth(idx);
    }
    
    getAccumulatedRateByMonth(monthId: number): number {
        return this.accumulatedMonthlyRates[monthId];
    }
    
}