import "./Settings.scss";

import Autocomplete, { AutocompleteRenderInputParams } from "@mui/material/Autocomplete";
import FormControlLabel from "@mui/material/FormControlLabel";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import React, { FormEvent, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { NumberFormatValues, NumericFormat } from "react-number-format";

import { Duration } from "../../../app/bonds";
import {
    selectAdjustInterestRatePercentage,
    selectAmountToInvest,
    selectCurrency,
    selectInflationRates,
    selectInvestmentDuration,
    selectInvestmentIncomeTax,
    selectReferenceRates,
    setAdjustInterestRatePercentage,
    setAmountToInvest,
    setCurrency,
    setInflationRates,
    setInvestmentDuration,
    setInvestmentIncomeTax,
    setReferenceRates,
    useAppDispatch,
    useAppSelector,
} from "../../../app/store";
import { DurationInput } from "../../common/durationInput/DurationInput";
import { NumberArrayInput, Preset } from "../../common/numberArrayInput/NumberArrayInput";





function getCommonCurrencies() {
    return [
        { label: "PLN" },
        { label: "EUR" },
        { label: "USD" },
    ];
}

const inflationPresets: Preset[] = [
    {
        id: "low",
        name: "low",
        values: [8, 6, 4, 3, 2.5, 2.5, 2, 2, 1, 1, ...new Array(120).fill(1)],
    },
    {
        id: "medium",
        name: "medium",
        values: [12, 9, 6, 5, 5, 4, 4, 3, 3, 3, ...new Array(120).fill(2.5)],
    },
    {
        id: "high",
        name: "high",
        values: [25, 20, 17, 15, 10, 7, 6, 5, 4.5, 4.5, ...new Array(120).fill(4)],
    },
];

const referenceRatesPresets: Preset[] = [
    {
        id: "low",
        name: "low",
        values: [ 5, 4.5, 4, 4, 3.5, 3, 2, 1.5, 1.5, 1, ...new Array(120).fill(1)],
    },
    {
        id: "medium",
        name: "medium",
        values: [ 9, 7, 4, 2, 2, 2, 1, 1, 1, 1, ...new Array(120).fill(2)],
    },
    {
        id: "high",
        name: "high",
        values: [ 12, 10, 8, 8, 7, 7, 6, 5, 4.5, 4.5, ...new Array(120).fill(4)],
    },
];

export function Settings() {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const currency = useAppSelector(selectCurrency);
    const amountToInvest = useAppSelector(selectAmountToInvest);
    const investmentDuration = useAppSelector(selectInvestmentDuration);
    const investmentIncomeTax = useAppSelector(selectInvestmentIncomeTax);
    const adjustInterestRatePercentage = useAppSelector(selectAdjustInterestRatePercentage);
    const inflationRates = useAppSelector(selectInflationRates);
    const referenceRates = useAppSelector(selectReferenceRates);
    
    // Currency
    const renderCurrencyInput = useCallback((params: AutocompleteRenderInputParams) => {
        return <TextField {...params} label={t("settings.field.currency")} />;
    }, [t]);
    const handleCurrencyChange = useCallback((_event: React.SyntheticEvent, value: string | { label: string } | null) => {
        const valueStr = typeof(value) === "string" ? value : (value ? value.label : ""); 
        dispatch(setCurrency(valueStr));
    }, [dispatch]);
    const handleCurrencyInput = useCallback((event: FormEvent<HTMLInputElement>) => {
        dispatch(setCurrency((event.target as HTMLInputElement).value));
    }, [dispatch]);
    
    // Amount to invest
    const isAmountToInvestAllowed = useCallback((values: NumberFormatValues) => {
        return values.floatValue === undefined || (values.floatValue >= 100 && values.floatValue <= 1000000000);
    }, []);
    const handleAmountToInvestChange = useCallback((value: NumberFormatValues) => {
        dispatch(setAmountToInvest(value.floatValue ?? 0));
    }, [dispatch]);
    
    const handleInvestmentDurationChange = useCallback((value: Duration) => {
        dispatch(setInvestmentDuration(value));
    }, [dispatch]);
    
    // Investment income tax
    const isInvestmentIncomeTaxAllowed = useCallback((values: NumberFormatValues) => {
        return values.floatValue === undefined || (values.floatValue >= 0 && values.floatValue <= 100);
    }, []);
    const handleInvestmentIncomeTaxChange = useCallback((value: NumberFormatValues) => {
        dispatch(setInvestmentIncomeTax(value.floatValue ?? 0));
    }, [dispatch]);
    
    // Interest rate percentage adjustment
    const handleAdjustInterestRatePercentageChange = useCallback((value: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setAdjustInterestRatePercentage(value.target.checked));
    }, [dispatch]);
    
    // Inflation rates
    const handleInflationRatesChange = useCallback((value: number[]) => {
        dispatch(setInflationRates(value));
    }, [dispatch]);
    
    // Reference rates
    const handleReferenceRatesChange = useCallback((value: number[]) => {
        dispatch(setReferenceRates(value));
    }, [dispatch]);
    
    return (
        <div className="Settings">
            <Stack spacing={2} className="Settings__form">
                <Autocomplete
                    freeSolo
                    options={getCommonCurrencies()}
                    renderInput={renderCurrencyInput}
                    value={currency}
                    onChange={handleCurrencyChange}
                    onInput={handleCurrencyInput}
                ></Autocomplete>
                <NumericFormat
                    thousandSeparator=" "
                    suffix={` ${currency}`}
                    label={t("settings.field.amountToInvest")}
                    isAllowed={isAmountToInvestAllowed}
                    decimalScale={0}
                    customInput={TextField}
                    allowNegative={false}
                    value={amountToInvest}
                    onValueChange={handleAmountToInvestChange}
                />
                <DurationInput
                    label={t("settings.field.investmentDuration")}
                    value={investmentDuration}
                    maxMonths={50 * 12}
                    onValueChange={handleInvestmentDurationChange}
                />
                <NumericFormat
                    thousandSeparator=" "
                    decimalSeparator="."
                    suffix={"%"}
                    label={t("settings.field.investmentIncomeTax")}
                    isAllowed={isInvestmentIncomeTaxAllowed}
                    decimalScale={2}
                    customInput={TextField}
                    allowNegative={false}
                    value={investmentIncomeTax}
                    onValueChange={handleInvestmentIncomeTaxChange}
                />
                <div className="Settings__separate-option">
                    <FormControlLabel
                        control={
                            <Switch
                                checked={adjustInterestRatePercentage}
                                onChange={handleAdjustInterestRatePercentageChange}
                            />
                        }
                        label={t("settings.field.adjustInterestRatePercentage")}
                    />
                    <div className="Settings_extra-info">
                        {t("settings.field.adjustInterestRatePercentage.info")}
                        <ul>
                            <li>{t("settings.field.adjustInterestRatePercentage.info.1")}</li>
                            <li>{t("settings.field.adjustInterestRatePercentage.info.2")}</li>
                        </ul>
                    </div>
                </div>
                <div className="Settings__form__full-width">
                    <NumberArrayInput
                        label={t("settings.field.inflationRates")}
                        value={inflationRates}
                        onValueChange={handleInflationRatesChange}
                        forDuration={investmentDuration}
                        suffix={"%"}
                        min={-1000}
                        max={1000}
                        decimalScale={2}
                        allowNegative={true}
                        presets={inflationPresets}
                    />
                    <NumberArrayInput
                        label={t("settings.field.referenceRates")}
                        value={referenceRates}
                        onValueChange={handleReferenceRatesChange}
                        forDuration={investmentDuration}
                        suffix={"%"}
                        min={-1000}
                        max={1000}
                        decimalScale={2}
                        allowNegative={true}
                        presets={referenceRatesPresets}
                    />
                </div>
            </Stack>
        </div>
    );
}
