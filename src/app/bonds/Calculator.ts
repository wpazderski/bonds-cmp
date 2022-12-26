import { SettingsState } from "../store";
import { Utils } from "../Utils";
import { AccumulatedRatesCalculator } from "./AccumulatedRatesCalculator";
import { RatesCalculator } from "./RatesCalculator";
import { Bonds, CancellationPolicy, InterestRate } from "./Types";





export class Calculator {
    
    private durationMonths: number;
    private durationYears: number;
    private inflationRatesCalculator: RatesCalculator;
    private accumulatedInflationRatesCalculator: AccumulatedRatesCalculator;
    private referenceRatesCalculator: RatesCalculator;
    
    constructor(private bonds: Bonds, private settings: SettingsState) {
        this.durationMonths = Utils.getDurationMonths(settings.investmentDuration);
        this.durationYears = Math.ceil(Utils.getDurationYears(settings.investmentDuration));
        const ratesCalculationNumYears = this.durationYears + 1;
        this.inflationRatesCalculator = new RatesCalculator(this.settings.inflationRates, ratesCalculationNumYears);
        this.accumulatedInflationRatesCalculator = new AccumulatedRatesCalculator(this.inflationRatesCalculator, ratesCalculationNumYears);
        this.referenceRatesCalculator = new RatesCalculator(this.settings.referenceRates, ratesCalculationNumYears);
    }
    
    calculate(onlyEarnings: boolean, adjustedForInflation: boolean): number[] {
        const totals = this.calculateTotals();
        if (onlyEarnings) {
            const earnings = this.calculateEarnings(totals);
            if (adjustedForInflation) {
                const totalsAdjustedForInflation = this.calculateTotalsAdjustedForInflation(totals);
                return this.calculateEarningsAdjustedForInflation(totals, earnings, totalsAdjustedForInflation);
            }
            else {
                return earnings;
            }
        }
        else {
            if (adjustedForInflation) {
                return this.calculateTotalsAdjustedForInflation(totals);
            }
            else {
                return totals;
            }
        }
    }
    
    private calculateEarningsAdjustedForInflation(totals: number[], earnings: number[], totalsAdjustedForInflation: number[]): number[] {
        return totals.map((total, i) => earnings[i] - (total - totalsAdjustedForInflation[i]));
    }
    
    private calculateEarnings(totals: number[]): number[] {
        return totals.map(total => total - this.settings.amountToInvest);
    }
    
    private calculateTotalsAdjustedForInflation(totals: number[]): number[] {
        return totals.map((total, i) => total / (1.0 + this.accumulatedInflationRatesCalculator.getAccumulatedRateByMonth(i)));
    }
    
    private calculateTotals(): number[] {
        const totals: number[] = [];
        let amountToInvest: number = this.settings.amountToInvest;
        totals.push(amountToInvest);
        let months = 0;
        while (totals.length < this.durationMonths) {
            const result = this.simulateBondsSingleIteration(amountToInvest, totals, months);
            amountToInvest = result.nextAmountToInvest;
            months = result.months;
        }
        return totals;
    }
    
    private simulateBondsSingleIteration(amountToInvest: number, totals: number[], currMonth: number): { nextAmountToInvest: number, months: number } {
        const bondsStartMonthId = currMonth;
        const numUnits = Math.floor(amountToInvest / this.bonds.unitPrice);
        const initialAmountInvested = numUnits * this.bonds.unitPrice;
        let amountInvested = initialAmountInvested;
        const amountNotInvested = amountToInvest - amountInvested;
        let interestNotReinvested = 0;
        let taxFromReinvested = 0;
        
        for (const interestPeriod of this.bonds.interestPeriods) {
            const isLastInterestPeriod = interestPeriod === this.bonds.interestPeriods[this.bonds.interestPeriods.length - 1];
            for (let i = 0; i < interestPeriod.repeats; ++i) {
                const isLastInterestPeriodRepeat = isLastInterestPeriod && (i + 1) === interestPeriod.repeats;
                const durationMonths = Utils.getDurationMonths(interestPeriod.duration);
                const annualInterestRate = this.calculateInterestRate(interestPeriod.interestRate, currMonth, bondsStartMonthId);
                const totalInterestRate = annualInterestRate * durationMonths / 12;
                const totalInterest = totalInterestRate * amountInvested;
                const monthlyInterest = totalInterest / durationMonths;
                
                for (let monthRelative = 1; monthRelative <= durationMonths; ++monthRelative) {
                    const isCancellation = !(isLastInterestPeriodRepeat && monthRelative === durationMonths);
                    const grossInterest = monthlyInterest * monthRelative;
                    const grossInterestAfterFees = isCancellation
                        ? this.subtractCancellationFees(
                            grossInterest,
                            amountInvested + interestNotReinvested + grossInterest - initialAmountInvested,
                            interestPeriod.cancellationPolicy,
                            numUnits,
                        )
                        : grossInterest;
                    const netInterest = (1.0 - this.settings.investmentIncomeTax / 100) * grossInterestAfterFees;
                    const netInterestNotReinvested = (1.0 - this.settings.investmentIncomeTax / 100) * interestNotReinvested;
                    totals.push(amountInvested + netInterestNotReinvested + netInterest + amountNotInvested - taxFromReinvested);
                }
                
                if (this.bonds.capitalization) {
                    amountInvested += totalInterest;
                    taxFromReinvested += (this.settings.investmentIncomeTax / 100) * totalInterest;
                }
                else {
                    interestNotReinvested += totalInterest;
                }
                
                currMonth += durationMonths;
            }
        }
        return {
            nextAmountToInvest: totals[totals.length - 1],
            months: currMonth,
        };
    }
    
    private calculateInterestRate(interestRateSpec: InterestRate, interestPeriodStartMonthId: number, bondsStartMonthId: number): number {
        let interestRate = interestRateSpec.additivePercent / 100;
        if (this.settings.adjustInterestRatePercentage) {
            const initialReferenceRate = this.referenceRatesCalculator.getRateByMonth(0);
            const bondsReferenceRate = this.referenceRatesCalculator.getRateByMonth(bondsStartMonthId);
            interestRate *= bondsReferenceRate / initialReferenceRate;
        }
        if (interestRateSpec.additiveInflation) {
            interestRate += this.inflationRatesCalculator.getRateByMonth(interestPeriodStartMonthId);
        }
        if (interestRateSpec.additiveReferenceRate) {
            interestRate += this.referenceRatesCalculator.getRateByMonth(interestPeriodStartMonthId);
        }
        return interestRate;
    }
    
    private subtractCancellationFees(grossInterest: number, totalInterest: number, cancellationPolicy: CancellationPolicy, numUnits: number): number {
        let fees = cancellationPolicy.fixedPenalty * numUnits;
        fees += cancellationPolicy.percentOfInterestPeriodInterest / 100 * grossInterest;
        fees += cancellationPolicy.percentOfTotalInterest / 100 * totalInterest;
        if (cancellationPolicy.limitedToTotalInterest) {
            fees = Math.min(fees, totalInterest);
        }
        if (cancellationPolicy.limitedToInterestPeriodInterest) {
            fees = Math.min(fees, grossInterest);
        }
        return grossInterest - fees;
    }
    
}
