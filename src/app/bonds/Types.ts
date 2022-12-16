export interface Bonds {
    id: string;
    name: string;
    unitPrice: number;
    capitalization: boolean;
    interestPeriods: InterestPeriod[];
}

export interface InterestPeriod {
    id: string;
    repeats: number; // int
    duration: Duration;
    interestRate: InterestRate;
    cancellationPolicy: CancellationPolicy;
}

export interface InterestRate {
    additivePercent: number;
    additiveInflation: boolean;
    additiveReferenceRate: boolean;
}

export interface CancellationPolicy {
    fixedPenalty: number;
    percentOfInterestPeriodInterest: number;
    percentOfTotalInterest: number;
    limitedToTotalInterest: boolean;
    limitedToInterestPeriodInterest: boolean;
}

export type DurationUnit = "m" | "y";

export interface Duration {
    num: number; // int
    unit: DurationUnit;
}
