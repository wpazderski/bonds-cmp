export class RatesCalculator {
    
    private annualRates: number[];
    private monthlyRates: number[];
    
    constructor(private ratesPercent: number[], private numYears: number) {
        this.ratesPercent = [...this.ratesPercent, this.ratesPercent[this.ratesPercent.length - 1]];
        this.annualRates = this.calculateAnnualRates();
        this.monthlyRates = this.calculateMonthlyRates();
    }
    
    private calculateAnnualRates(): number[] {
        const annualRates: number[] = [];
        for (let year = 0; year < this.numYears; ++year) {
            const currRates = this.ratesPercent[year] / 100;
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
        monthlyRates.push(this.annualRates[this.annualRates.length - 1]);
        return monthlyRates;
    }
    
    getAnnualRates(): number[] {
        return [...this.annualRates];
    }
    
    getMonthlyRates(): number[] {
        return [...this.monthlyRates];
    }
    
    getRateByMonth(monthId: number): number {
        return this.monthlyRates[monthId];
    }
    
}
