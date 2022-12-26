import "./BondsForm.scss";

import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Unstable_Grid2";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { NumberFormatValues, NumericFormat } from "react-number-format";

import { Bonds, CancellationPolicy, Duration, InterestPeriod, InterestRate } from "../../../../app/bonds/Types";
import { selectCurrency, updateAvailableBonds, useAppDispatch, useAppSelector } from "../../../../app/store";
import { Utils } from "../../../../app/Utils";
import { DurationInput } from "../../../common/durationInput/DurationInput";





export interface BondsFormProps {
    bonds: Bonds;
}

export function BondsForm(props: BondsFormProps) {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const currency = useAppSelector(selectCurrency);
    
    const formattedCalculatedDuration = useMemo(() => {
        const totalDuration: Duration = {
            num: 0,
            unit: "m",
        };
        for (const interestPeriod of props.bonds.interestPeriods) {
            totalDuration.num += Utils.getDurationMonths(interestPeriod.duration) * interestPeriod.repeats;
        }
        return Utils.formatDuration(totalDuration);
    }, [props.bonds.interestPeriods]);
    
    // Name
    const handleNameChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const newName = event.target.value;
        const bonds = { ...props.bonds};
        bonds.name = newName;
        dispatch(updateAvailableBonds({ id: props.bonds.id, bonds }));
    }, [dispatch, props.bonds]);
    
    // Unit price
    const isUnitPriceAllowed = useCallback((values: NumberFormatValues) => {
        return values.floatValue === undefined || (values.floatValue >= 0.01 && values.floatValue <= 1000000);
    }, []);
    const handleUnitPriceChange = useCallback((newUnitPrice: NumberFormatValues) => {
        const bonds = { ...props.bonds};
        bonds.unitPrice = newUnitPrice.floatValue ?? 100;
        dispatch(updateAvailableBonds({ id: props.bonds.id, bonds }));
    }, [dispatch, props.bonds]);
    
    // Capitalization
    const handleCapitalizationChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const newCapitalization = event.target.checked;
        const bonds = { ...props.bonds};
        bonds.capitalization = newCapitalization;
        dispatch(updateAvailableBonds({ id: props.bonds.id, bonds }));
    }, [dispatch, props.bonds]);
    
    // Adding interest period
    const handleAddInterestPeriodClick = useCallback(() => {
        const bonds = { ...props.bonds};
        bonds.interestPeriods = [...bonds.interestPeriods];
        bonds.interestPeriods.push({
            id: Date.now().toString(),
            repeats: 1,
            duration: { num: 1, unit: "y" },
            interestRate: { additivePercent: 7.25, additiveInflation: false, additiveReferenceRate: false },
            cancellationPolicy: { fixedPenalty: 2.00, percentOfInterestPeriodInterest: 0, percentOfTotalInterest: 0, limitedToInterestPeriodInterest: true, limitedToTotalInterest: true },
        });
        dispatch(updateAvailableBonds({ id: props.bonds.id, bonds }));
    }, [dispatch, props.bonds]);
    
    return (
        <div className="BondsForm">
            <Stack spacing={4} className="BondsForm__form">
                <TextField
                    label={t("bondsForm.name")}
                    value={props.bonds.name}
                    onChange={handleNameChange}
                />
                <NumericFormat
                    thousandSeparator=" "
                    suffix={` ${currency}`}
                    label={t("bondsForm.unitPrice")}
                    isAllowed={isUnitPriceAllowed}
                    decimalScale={2}
                    customInput={TextField}
                    allowNegative={false}
                    value={props.bonds.unitPrice}
                    onValueChange={handleUnitPriceChange}
                />
                <FormControlLabel
                    control={<Switch
                        checked={props.bonds.capitalization}
                        onChange={handleCapitalizationChange}
                    />}
                    label={t("bondsForm.capitalization")}
                />
                <h3>{t("bondsForm.interestPeriods")}:</h3>
                {props.bonds.interestPeriods.map(interestPeriod => (
                    <BondsFormInterestPeriod
                        key={interestPeriod.id}
                        bonds={props.bonds}
                        interestPeriod={interestPeriod}
                    />
                ))}
                <Button
                    variant="contained"
                    size="large"
                    startIcon={<FontAwesomeIcon icon={faPlus} />}
                    sx={{ width: "300px" }}
                    onClick={handleAddInterestPeriodClick}
                >
                    {t("bondsForm.interestPeriods.add")}
                </Button>
                <h3>{t("bondsForm.calculatedDuration")}: {formattedCalculatedDuration}</h3>
            </Stack>
        </div>
    );
}

interface BondsFormInterestPeriodProps {
    interestPeriod: InterestPeriod;
    bonds: Bonds;
}

function BondsFormInterestPeriod(props: BondsFormInterestPeriodProps) {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const currency = useAppSelector(selectCurrency);
    
    // InterestPeriod
    const updateInterestPeriod = useCallback((updater: (interestPeriod: InterestPeriod) => void) => {
        const bonds = { ...props.bonds};
        bonds.interestPeriods = [...bonds.interestPeriods];
        const idx = bonds.interestPeriods.findIndex(interestPeriod => interestPeriod.id === props.interestPeriod.id);
        if (idx < 0) {
            return;
        }
        bonds.interestPeriods[idx] = { ...bonds.interestPeriods[idx] };
        updater(bonds.interestPeriods[idx]);
        dispatch(updateAvailableBonds({ id: props.bonds.id, bonds }));
    }, [dispatch, props.bonds, props.interestPeriod.id]);
    const handleInterestPeriodRepeatsChange = useCallback((repeats: NumberFormatValues) => {
        updateInterestPeriod(interestPeriod => interestPeriod.repeats = (repeats.floatValue ?? 1));
    }, [updateInterestPeriod]);
    const handleInterestPeriodDurationChange = useCallback((duration: Duration) => {
        updateInterestPeriod(interestPeriod => interestPeriod.duration = duration);
    }, [updateInterestPeriod]);
    
    // InterestPeriod / InterestRate
    const updateInterestPeriodInterestRate = useCallback((updater: (interestRate: InterestRate) => void) => {
        updateInterestPeriod(interestPeriod => {
            interestPeriod.interestRate = { ...interestPeriod.interestRate };
            updater(interestPeriod.interestRate);
        });
    }, [updateInterestPeriod]);
    const handleIterestPeriodAdditivePercentChange = useCallback((additivePercent: NumberFormatValues) => {
        updateInterestPeriodInterestRate(interest => interest.additivePercent = (additivePercent.floatValue ?? 1));
    }, [updateInterestPeriodInterestRate]);
    const handleIterestPeriodAdditiveInflationChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const additiveInflation = event.target.checked;
        updateInterestPeriodInterestRate(interest => interest.additiveInflation = additiveInflation);
    }, [updateInterestPeriodInterestRate]);
    const handleIterestPeriodAdditiveReferenceRateChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const additiveReferenceRate = event.target.checked;
        updateInterestPeriodInterestRate(interest => interest.additiveReferenceRate = additiveReferenceRate);
    }, [updateInterestPeriodInterestRate]);
    
    // InterestPeriod / CancellationPolicy
    const updateInterestPeriodCancellationPolicy = useCallback((updater: (cancellationPolicy: CancellationPolicy) => void) => {
        updateInterestPeriod(interestPeriod => {
            interestPeriod.cancellationPolicy = { ...interestPeriod.cancellationPolicy };
            updater(interestPeriod.cancellationPolicy);
        });
    }, [updateInterestPeriod]);
    const handleIterestPeriodFixedPenaltyChange = useCallback((fixedPenalty: NumberFormatValues) => {
        updateInterestPeriodCancellationPolicy(cancellationPolicy => cancellationPolicy.fixedPenalty = (fixedPenalty.floatValue ?? 1));
    }, [updateInterestPeriodCancellationPolicy]);
    const handleIterestPeriodPercentOfInterestPeriodInterestChange = useCallback((percentOfInterestPeriodInterest: NumberFormatValues) => {
        updateInterestPeriodCancellationPolicy(cancellationPolicy => cancellationPolicy.percentOfInterestPeriodInterest = (percentOfInterestPeriodInterest.floatValue ?? 1));
    }, [updateInterestPeriodCancellationPolicy]);
    const handleIterestPeriodPercentOfTotalInterestChange = useCallback((percentOfTotalInterest: NumberFormatValues) => {
        updateInterestPeriodCancellationPolicy(cancellationPolicy => cancellationPolicy.percentOfTotalInterest = (percentOfTotalInterest.floatValue ?? 1));
    }, [updateInterestPeriodCancellationPolicy]);
    const handleIterestPeriodCPLimitedToIPInterestChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const limitedToInterestPeriodInterest = event.target.checked;
        updateInterestPeriodCancellationPolicy(cancellationPolicy => cancellationPolicy.limitedToInterestPeriodInterest = limitedToInterestPeriodInterest);
    }, [updateInterestPeriodCancellationPolicy]);
    const handleIterestPeriodCPLimitedToTotalInterestChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const limitedToTotalInterest = event.target.checked;
        updateInterestPeriodCancellationPolicy(cancellationPolicy => cancellationPolicy.limitedToTotalInterest = limitedToTotalInterest);
    }, [updateInterestPeriodCancellationPolicy]);
    
    // Interest period removal
    const handleRemoveInterestPeriodClick = useCallback(() => {
        const bonds = { ...props.bonds};
        bonds.interestPeriods = [...bonds.interestPeriods];
        const idx = bonds.interestPeriods.findIndex(interestPeriod => interestPeriod.id === props.interestPeriod.id);
        if (idx < 0) {
            return;
        }
        bonds.interestPeriods.splice(idx, 1);
        dispatch(updateAvailableBonds({ id: props.bonds.id, bonds }));
    }, [dispatch, props.bonds, props.interestPeriod.id]);
    
    // Validators
    const isInterestPeriodRepeatsAllowed = useCallback((values: NumberFormatValues) => {
        return values.floatValue === undefined || (values.floatValue >= 1 && values.floatValue <= 120);
    }, []);
    const isInterestPeriodAdditivePercentAllowed = useCallback((values: NumberFormatValues) => {
        return values.floatValue === undefined || (values.floatValue >= 0 && values.floatValue <= 100);
    }, []);
    const isInterestPeriodRepeatsCPFixedPenaltyAllowed = useCallback((values: NumberFormatValues) => {
        return values.floatValue === undefined || (values.floatValue >= 0 && values.floatValue <= 10000);
    }, []);
    const isInterestPeriodPercentOfIPInterestAllowed = useCallback((values: NumberFormatValues) => {
        return values.floatValue === undefined || (values.floatValue >= 0 && values.floatValue <= 100);
    }, []);
    const isInterestPeriodPercentOfTotalInterestAllowed = useCallback((values: NumberFormatValues) => {
        return values.floatValue === undefined || (values.floatValue >= 0 && values.floatValue <= 100);
    }, []);
    
    return (
        <div className="BondsForm__interest-period">
            <Grid container spacing={8}>
                <Grid xs={4}>
                    <NumericFormat
                        thousandSeparator=" "
                        label={t("bondsForm.interestPeriods.repeats")}
                        isAllowed={isInterestPeriodRepeatsAllowed}
                        decimalScale={0}
                        customInput={TextField}
                        allowNegative={false}
                        value={props.interestPeriod.repeats}
                        onValueChange={handleInterestPeriodRepeatsChange}
                        sx={{ width: "100%" }}
                    />
                </Grid>
                <Grid xs={8}>
                    <DurationInput
                        label={t("bondsForm.interestPeriods.duration")}
                        value={props.interestPeriod.duration}
                        onValueChange={handleInterestPeriodDurationChange}
                    />
                </Grid>
            </Grid>
            <h4>{t("bondsForm.interestPeriods.interestRate")}:</h4>
            <Grid container spacing={8}>
                <Grid xs={4}>
                    <NumericFormat
                        thousandSeparator=" "
                        decimalSeparator="."
                        suffix={"%"}
                        label={t("bondsForm.interestPeriods.interestRate.additivePercent")}
                        isAllowed={isInterestPeriodAdditivePercentAllowed}
                        decimalScale={2}
                        customInput={TextField}
                        allowNegative={false}
                        value={props.interestPeriod.interestRate.additivePercent}
                        onValueChange={handleIterestPeriodAdditivePercentChange}
                        sx={{ width: "100%" }}
                    />
                </Grid>
                <Grid xs={4}>
                    <FormControlLabel
                        control={<Switch
                            checked={props.interestPeriod.interestRate.additiveInflation}
                            onChange={handleIterestPeriodAdditiveInflationChange}
                        />}
                        label={t("bondsForm.interestPeriods.interestRate.additiveInflation")}
                    />
                </Grid>
                <Grid xs={4}>
                    <FormControlLabel
                        control={<Switch
                            checked={props.interestPeriod.interestRate.additiveReferenceRate}
                            onChange={handleIterestPeriodAdditiveReferenceRateChange}
                        />}
                        label={t("bondsForm.interestPeriods.interestRate.additiveReferenceRate")}
                    />
                </Grid>
            </Grid>
            <h4>{t("bondsForm.interestPeriods.cancellationPolicy")}:</h4>
            <Grid container spacing={8}>
                <Grid xs={4}>
                    <NumericFormat
                        thousandSeparator=" "
                        decimalSeparator="."
                        suffix={` ${currency}`}
                        label={t("bondsForm.interestPeriods.cancellationPolicy.fixedPenalty")}
                        isAllowed={isInterestPeriodRepeatsCPFixedPenaltyAllowed}
                        decimalScale={2}
                        customInput={TextField}
                        allowNegative={false}
                        value={props.interestPeriod.cancellationPolicy.fixedPenalty}
                        onValueChange={handleIterestPeriodFixedPenaltyChange}
                        sx={{ width: "100%" }}
                    />
                </Grid>
                <Grid xs={4}>
                    <NumericFormat
                        thousandSeparator=" "
                        decimalSeparator="."
                        suffix={"%"}
                        label={t("bondsForm.interestPeriods.cancellationPolicy.percentOfInterestPeriodInterest")}
                        isAllowed={isInterestPeriodPercentOfIPInterestAllowed}
                        decimalScale={2}
                        customInput={TextField}
                        allowNegative={false}
                        value={props.interestPeriod.cancellationPolicy.percentOfInterestPeriodInterest}
                        onValueChange={handleIterestPeriodPercentOfInterestPeriodInterestChange}
                        sx={{ width: "100%" }}
                    />
                </Grid>
                <Grid xs={4}>
                    <NumericFormat
                        thousandSeparator=" "
                        decimalSeparator="."
                        suffix={"%"}
                        label={t("bondsForm.interestPeriods.cancellationPolicy.percentOfTotalInterest")}
                        isAllowed={isInterestPeriodPercentOfTotalInterestAllowed}
                        decimalScale={2}
                        customInput={TextField}
                        allowNegative={false}
                        value={props.interestPeriod.cancellationPolicy.percentOfTotalInterest}
                        onValueChange={handleIterestPeriodPercentOfTotalInterestChange}
                        sx={{ width: "100%" }}
                    />
                </Grid>
            </Grid>
            <Grid container spacing={8}>
                <Grid xs={6}>
                    <FormControlLabel
                        control={<Switch
                            checked={props.interestPeriod.cancellationPolicy.limitedToInterestPeriodInterest}
                            onChange={handleIterestPeriodCPLimitedToIPInterestChange}
                        />}
                        label={t("bondsForm.interestPeriods.cancellationPolicy.limitedToInterestPeriodInterest")}
                    />
                </Grid>
                <Grid xs={6}>
                    <FormControlLabel
                        control={<Switch
                            checked={props.interestPeriod.cancellationPolicy.limitedToTotalInterest}
                            onChange={handleIterestPeriodCPLimitedToTotalInterestChange}
                        />}
                        label={t("bondsForm.interestPeriods.cancellationPolicy.limitedToTotalInterest")}
                    />
                </Grid>
            </Grid>
            {props.bonds.interestPeriods.length > 1 && (
                <IconButton
                    className="BondsForm__remove-interest-period-button"
                    onClick={handleRemoveInterestPeriodClick}
                >
                    <FontAwesomeIcon icon={faTrash} />
                </IconButton>
            )}
        </div>
    );
}
