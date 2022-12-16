import Autocomplete from "@mui/material/Autocomplete";
import FormControlLabel from "@mui/material/FormControlLabel";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import { FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { NumericFormat } from "react-number-format";
import { selectAdjustInterestRatePercentage, selectAmountToInvest, selectCurrency, selectInflationRates, selectInvestmentDuration, selectInvestmentIncomeTax, selectReferenceRates, setAdjustInterestRatePercentage, setAmountToInvest, setCurrency, setInflationRates, setInvestmentDuration, setInvestmentIncomeTax, setReferenceRates, useAppDispatch, useAppSelector } from "../../../app/store";
import { DurationInput } from "../../common/durationInput/DurationInput";
import { NumberArrayInput, Preset } from "../../common/numberArrayInput/NumberArrayInput";
import "./Settings.scss";

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
        values: [15, 7, 6, 5.5, 5, 4, 3, 2, 1, 1, ...new Array(110).fill(1)],
    },
    {
        id: "medium",
        name: "medium",
        values: [20, 10, 8, 5, 5, 4, 4, 3, 3, 3, ...new Array(110).fill(2.5)],
    },
    {
        id: "high",
        name: "high",
        values: [25, 20, 17, 15, 10, 7, 6, 5, 4.5, 4.5, ...new Array(110).fill(4)],
    },
];
const referenceRatesPresets: Preset[] = [
    {
        id: "low",
        name: "low",
        values: [ 5, 4.5, 4, 4, 3.5, 3, 2, 1.5, 1.5, 1, ...new Array(110).fill(1)],
    },
    {
        id: "medium",
        name: "medium",
        values: [ 9, 7, 4, 2, 2, 2, 1, 1, 1, 1, ...new Array(110).fill(2)],
    },
    {
        id: "high",
        name: "high",
        values: [ 12, 10, 8, 8, 7, 7, 6, 5, 4.5, 4.5, ...new Array(110).fill(4)],
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
    
    return (
        <div className="Settings">
            <Stack spacing={2} className="Settings__form">
                <Autocomplete
                    freeSolo
                    options={getCommonCurrencies()}
                    renderInput={params => <TextField {...params} label={t("settings.field.currency")} />}
                    value={currency}
                    onChange={(_, value) => dispatch(setCurrency(typeof(value) === "string" ? value : (value ? value.label : "")))}
                    onInput={(event: FormEvent<HTMLInputElement>) => dispatch(setCurrency((event.target as any).value))}
                ></Autocomplete>
                <NumericFormat
                    thousandSeparator=" "
                    suffix={` ${currency}`}
                    label={t("settings.field.amountToInvest")}
                    isAllowed={values => values.floatValue === undefined || (values.floatValue >= 100 && values.floatValue <= 1000000000)}
                    decimalScale={0}
                    customInput={TextField}
                    allowNegative={false}
                    value={amountToInvest}
                    onValueChange={value => dispatch(setAmountToInvest(value.floatValue ?? 0))}
                />
                <DurationInput
                    label={t("settings.field.investmentDuration")}
                    value={investmentDuration}
                    onValueChange={value => dispatch(setInvestmentDuration(value))}
                />
                <NumericFormat
                    thousandSeparator=" "
                    decimalSeparator="."
                    suffix={"%"}
                    label={t("settings.field.investmentIncomeTax")}
                    isAllowed={values => values.floatValue === undefined || (values.floatValue >= 0 && values.floatValue <= 100)}
                    decimalScale={2}
                    customInput={TextField}
                    allowNegative={false}
                    value={investmentIncomeTax}
                    onValueChange={value => dispatch(setInvestmentIncomeTax(value.floatValue ?? 0))}
                />
                <div className="Settings__separate-option">
                    <FormControlLabel
                        control={
                            <Switch
                                checked={adjustInterestRatePercentage}
                                onChange={value => dispatch(setAdjustInterestRatePercentage(value.target.checked))}
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
                        onValueChange={value => dispatch(setInflationRates(value))}
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
                        onValueChange={value => dispatch(setReferenceRates(value))}
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
