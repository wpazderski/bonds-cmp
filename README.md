# bonds-cmp
Tool for comparing profitability of treasury bonds


<hr />

<p align="center">
    <img src="https://raw.githubusercontent.com/wpazderski/bonds-cmp/master/readme-img1.png" width="900" />
</p>

<hr />

## Features
* customization of investment parameters,
* customization of bonds parameters,
* comparison of bonds (charts),
* optional adjustment for inflation,
* data export/import,
* sharing via url,
* two languages: `en` and `pl`.

The tool was developed to help people answer the following question: "Which bonds will be more profitable in my case?". It was inspired by people purchasing 4-year bonds instead of 10-year bonds, because they didn't want to freeze their money for a decade. However, it was more profitable to cancel 10y bonds after 4 years than to keep 4y bonds for the same duration. Many people didn't do the calculation and they lost an opportunity to earn more money.

## Disclaimers
* This is not an investment recommendation.
* Computer programs may have bugs - always do your own calculations before investing.

## Demo
* https://pazderski.dev/bonds/?lng=en
* https://pazderski.dev/obligacje/?lng=pl

## Building and deployment
```
git clone https://github.com/wpazderski/bonds-cmp.git
cd bonds-cmp
npm ci
npm run build
```
Upload contents of `./build/` directory to your server (destination directory depends on server's configuration). See [CRA deployment documentation](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Usage
1. Click the flag in the top-right corner if you want to change interface language.
1. Open `Settings` tab (open by default) to adjust investment and environment parameters:
    - currency, amount of money to invest, investment duration and income tax rate,
    - whether to automatically adjust interest rates if bonds are repeated (it happens if investmentDuration > bondsDuration),
    - predicted inflation rates and reference rates.
1. Open `Bonds` tab to configure bonds. There are some bonds defined by default - these are treasury bonds offered in Poland. You can remove them and add your own bonds.
    - each interest period can be repeated ("Number of repeats") - there is a difference between 3x4months and 1x12months because of cancellation policy, capitalization and additive inflationRate/referenceRate,
    - configure interest rate; example:
        - percent is 5.5%,
        - "Add inflation" is enabled and inflation rate is 13.7%,
        - "Add reference rate" is enabled and reference rate is 8.25%,
        - interest rate is 5.5% + 13.7% + 8.25% = 27.45%,
    - configure cancellation policy (fees applied if you cancel the investment before current interest period ends),
    - you can add more interest periods.
1. Open `Charts` tab to compare bonds. There are 4 charts available:
    - "Total": amountInvested + interest - cancellationPolicy(if applicable) - incomeTax,
    - "Only earnings": does not include amountInvested,
    - "Total, adjusted for inflation": same as "Total", but reduced by inflation; example: total=575, inflation=15%; adjustedTotal=575 / (1 + 0.15)=500,
    - "Only earnings, adjusted for inflation": same as "Only earnings", but reduced by inflation.
1. If you want to save, export/import or share your results, go to `Save / Import / Share` tab.
