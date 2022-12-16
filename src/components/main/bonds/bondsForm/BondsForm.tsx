import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Unstable_Grid2";
import Stack from "@mui/material/Stack";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import { useTranslation } from "react-i18next";
import { NumericFormat } from "react-number-format";
import { Bonds, CancellationPolicy, Duration, InterestRate, InterestPeriod } from "../../../../app/bonds/Types";
import { selectCurrency, updateAvailableBonds, useAppDispatch, useAppSelector } from "../../../../app/store";
import { DurationInput } from "../../../common/durationInput/DurationInput";
import { Utils } from "../../../../app/Utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import "./BondsForm.scss";

export interface BondsFormProps {
    bonds: Bonds;
}

export function BondsForm(props: BondsFormProps) {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const currency = useAppSelector(selectCurrency);
    const handleNameChange = (newName: string) => {
        const bonds = { ...props.bonds};
        bonds.name = newName;
        dispatch(updateAvailableBonds({ id: props.bonds.id, bonds }));
    };
    const handleUnitPriceChange = (newUnitPrice: number) => {
        const bonds = { ...props.bonds};
        bonds.unitPrice = newUnitPrice;
        dispatch(updateAvailableBonds({ id: props.bonds.id, bonds }));
    };
    const handleCapitalizationChange = (newCapitalization: boolean) => {
        const bonds = { ...props.bonds};
        bonds.capitalization = newCapitalization;
        dispatch(updateAvailableBonds({ id: props.bonds.id, bonds }));
    };
    const updateInterestPeriod = (interestPeriodId: string, updater: (interestPeriod: InterestPeriod) => void) => {
        const bonds = { ...props.bonds};
        bonds.interestPeriods = [...bonds.interestPeriods];
        const idx = bonds.interestPeriods.findIndex(interestPeriod => interestPeriod.id === interestPeriodId);
        if (idx < 0) {
            return;
        }
        bonds.interestPeriods[idx] = { ...bonds.interestPeriods[idx] };
        updater(bonds.interestPeriods[idx]);
        dispatch(updateAvailableBonds({ id: props.bonds.id, bonds }));
    };
    const handleInterestPeriodRepeatsChange = (interestPeriodId: string, repeats: number) => {
        updateInterestPeriod(interestPeriodId, interestPeriod => interestPeriod.repeats = repeats);
    };
    const handleInterestPeriodDurationChange = (interestPeriodId: string, duration: Duration) => {
        updateInterestPeriod(interestPeriodId, interestPeriod => interestPeriod.duration = duration);
    };
    const updateInterestPeriodInterestRate = (interestPeriodId: string, updater: (interestRate: InterestRate) => void) => {
        updateInterestPeriod(interestPeriodId, interestPeriod => {
            interestPeriod.interestRate = { ...interestPeriod.interestRate };
            updater(interestPeriod.interestRate);
        });
    };
    const handleIterestPeriodAdditivePercentChange = (interestPeriodId: string, additivePercent: number) => {
        updateInterestPeriodInterestRate(interestPeriodId, interest => interest.additivePercent = additivePercent);
    };
    const handleIterestPeriodAdditiveInflationChange = (interestPeriodId: string, additiveInflation: boolean) => {
        updateInterestPeriodInterestRate(interestPeriodId, interest => interest.additiveInflation = additiveInflation);
    };
    const handleIterestPeriodAdditiveReferenceRateChange = (interestPeriodId: string, additiveReferenceRate: boolean) => {
        updateInterestPeriodInterestRate(interestPeriodId, interest => interest.additiveReferenceRate = additiveReferenceRate);
    };
    const updateInterestPeriodCancellationPolicy = (interestPeriodId: string, updater: (cancellationPolicy: CancellationPolicy) => void) => {
        updateInterestPeriod(interestPeriodId, interestPeriod => {
            interestPeriod.cancellationPolicy = { ...interestPeriod.cancellationPolicy };
            updater(interestPeriod.cancellationPolicy);
        });
    };
    const handleIterestPeriodFixedPenaltyChange = (interestPeriodId: string, fixedPenalty: number) => {
        updateInterestPeriodCancellationPolicy(interestPeriodId, cancellationPolicy => cancellationPolicy.fixedPenalty = fixedPenalty);
    };
    const handleIterestPeriodPercentOfInterestPeriodInterestChange = (interestPeriodId: string, percentOfInterestPeriodInterest: number) => {
        updateInterestPeriodCancellationPolicy(interestPeriodId, cancellationPolicy => cancellationPolicy.percentOfInterestPeriodInterest = percentOfInterestPeriodInterest);
    };
    const handleIterestPeriodPercentOfTotalInterestChange = (interestPeriodId: string, percentOfTotalInterest: number) => {
        updateInterestPeriodCancellationPolicy(interestPeriodId, cancellationPolicy => cancellationPolicy.percentOfTotalInterest = percentOfTotalInterest);
    };
    const handleIterestPeriodCPLimitedToIPInterestChange = (interestPeriodId: string, limitedToInterestPeriodInterest: boolean) => {
        updateInterestPeriodCancellationPolicy(interestPeriodId, cancellationPolicy => cancellationPolicy.limitedToInterestPeriodInterest = limitedToInterestPeriodInterest);
    };
    const handleIterestPeriodCPLimitedToTotalInterestChange = (interestPeriodId: string, limitedToTotalInterest: boolean) => {
        updateInterestPeriodCancellationPolicy(interestPeriodId, cancellationPolicy => cancellationPolicy.limitedToTotalInterest = limitedToTotalInterest);
    };
    const removeInterestPeriod = (interestPeriodId: string) => {
        const bonds = { ...props.bonds};
        bonds.interestPeriods = [...bonds.interestPeriods];
        const idx = bonds.interestPeriods.findIndex(interestPeriod => interestPeriod.id === interestPeriodId);
        if (idx < 0) {
            return;
        }
        bonds.interestPeriods.splice(idx, 1);
        dispatch(updateAvailableBonds({ id: props.bonds.id, bonds }));
    };
    const addInterestPeriod = () => {
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
    };
    
    
    const totalDuration: Duration = {
        num: 0,
        unit: "m",
    };
    for (const interestPeriod of props.bonds.interestPeriods) {
        totalDuration.num += Utils.getDurationMonths(interestPeriod.duration) * interestPeriod.repeats;
    }
    
    return (
        <div className="BondsForm">
            <Stack spacing={4} className="BondsForm__form">
                <TextField
                    label={t("bondsForm.name")}
                    value={props.bonds.name}
                    onChange={event => handleNameChange(event.target.value)}
                />
                <NumericFormat
                    thousandSeparator=" "
                    suffix={` ${currency}`}
                    label={t("bondsForm.unitPrice")}
                    isAllowed={values => values.floatValue === undefined || (values.floatValue >= 0.01 && values.floatValue <= 1000000)}
                    decimalScale={2}
                    customInput={TextField}
                    allowNegative={false}
                    value={props.bonds.unitPrice}
                    onValueChange={value => handleUnitPriceChange(value.floatValue ?? 100)}
                />
                <FormControlLabel control={<Switch
                    checked={props.bonds.capitalization}
                    onChange={event => handleCapitalizationChange(event.target.checked)}
                />} label={t("bondsForm.capitalization")} />
                <h3>{t("bondsForm.interestPeriods")}:</h3>
                {props.bonds.interestPeriods.map(interestPeriod => (
                    <div key={interestPeriod.id} className="BondsForm__interest-period">
                        <Grid container spacing={8}>
                            <Grid xs={4}>
                                <NumericFormat
                                    thousandSeparator=" "
                                    label={t("bondsForm.interestPeriods.repeats")}
                                    isAllowed={values => values.floatValue === undefined || (values.floatValue >= 1 && values.floatValue <= 120)}
                                    decimalScale={0}
                                    customInput={TextField}
                                    allowNegative={false}
                                    value={interestPeriod.repeats}
                                    onValueChange={value => handleInterestPeriodRepeatsChange(interestPeriod.id, value.floatValue ?? 1)}
                                    sx={{ width: "100%" }}
                                />
                            </Grid>
                            <Grid xs={8}>
                                <DurationInput
                                    label={t("bondsForm.interestPeriods.duration")}
                                    value={interestPeriod.duration}
                                    onValueChange={value => handleInterestPeriodDurationChange(interestPeriod.id, value)}
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
                                    isAllowed={values => values.floatValue === undefined || (values.floatValue >= 0 && values.floatValue <= 100)}
                                    decimalScale={2}
                                    customInput={TextField}
                                    allowNegative={false}
                                    value={interestPeriod.interestRate.additivePercent}
                                    onValueChange={value => handleIterestPeriodAdditivePercentChange(interestPeriod.id, value.floatValue ?? 1)}
                                    sx={{ width: "100%" }}
                                />
                            </Grid>
                            <Grid xs={4}>
                                <FormControlLabel control={<Switch
                                    checked={interestPeriod.interestRate.additiveInflation}
                                    onChange={event => handleIterestPeriodAdditiveInflationChange(interestPeriod.id, event.target.checked)}
                                />} label={t("bondsForm.interestPeriods.interestRate.additiveInflation")} />
                            </Grid>
                            <Grid xs={4}>
                                <FormControlLabel control={<Switch
                                    checked={interestPeriod.interestRate.additiveReferenceRate}
                                    onChange={event => handleIterestPeriodAdditiveReferenceRateChange(interestPeriod.id, event.target.checked)}
                                />} label={t("bondsForm.interestPeriods.interestRate.additiveReferenceRate")} />
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
                                    isAllowed={values => values.floatValue === undefined || (values.floatValue >= 0 && values.floatValue <= 10000)}
                                    decimalScale={2}
                                    customInput={TextField}
                                    allowNegative={false}
                                    value={interestPeriod.cancellationPolicy.fixedPenalty}
                                    onValueChange={value => handleIterestPeriodFixedPenaltyChange(interestPeriod.id, value.floatValue ?? 1)}
                                    sx={{ width: "100%" }}
                                />
                            </Grid>
                            <Grid xs={4}>
                                <NumericFormat
                                    thousandSeparator=" "
                                    decimalSeparator="."
                                    suffix={"%"}
                                    label={t("bondsForm.interestPeriods.cancellationPolicy.percentOfInterestPeriodInterest")}
                                    isAllowed={values => values.floatValue === undefined || (values.floatValue >= 0 && values.floatValue <= 100)}
                                    decimalScale={2}
                                    customInput={TextField}
                                    allowNegative={false}
                                    value={interestPeriod.cancellationPolicy.percentOfInterestPeriodInterest}
                                    onValueChange={value => handleIterestPeriodPercentOfInterestPeriodInterestChange(interestPeriod.id, value.floatValue ?? 1)}
                                    sx={{ width: "100%" }}
                                />
                            </Grid>
                            <Grid xs={4}>
                                <NumericFormat
                                    thousandSeparator=" "
                                    decimalSeparator="."
                                    suffix={"%"}
                                    label={t("bondsForm.interestPeriods.cancellationPolicy.percentOfTotalInterest")}
                                    isAllowed={values => values.floatValue === undefined || (values.floatValue >= 0 && values.floatValue <= 100)}
                                    decimalScale={2}
                                    customInput={TextField}
                                    allowNegative={false}
                                    value={interestPeriod.cancellationPolicy.percentOfTotalInterest}
                                    onValueChange={value => handleIterestPeriodPercentOfTotalInterestChange(interestPeriod.id, value.floatValue ?? 1)}
                                    sx={{ width: "100%" }}
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={8}>
                            <Grid xs={6}>
                                <FormControlLabel control={<Switch
                                    checked={interestPeriod.cancellationPolicy.limitedToInterestPeriodInterest}
                                    onChange={event => handleIterestPeriodCPLimitedToIPInterestChange(interestPeriod.id, event.target.checked)}
                                />} label={t("bondsForm.interestPeriods.cancellationPolicy.limitedToInterestPeriodInterest")} />
                            </Grid>
                            <Grid xs={6}>
                                <FormControlLabel control={<Switch
                                    checked={interestPeriod.cancellationPolicy.limitedToTotalInterest}
                                    onChange={event => handleIterestPeriodCPLimitedToTotalInterestChange(interestPeriod.id, event.target.checked)}
                                />} label={t("bondsForm.interestPeriods.cancellationPolicy.limitedToTotalInterest")} />
                            </Grid>
                        </Grid>
                        {props.bonds.interestPeriods.length > 1 && (
                            <IconButton
                                className="BondsForm__remove-interest-period-button"
                                onClick={() => removeInterestPeriod(interestPeriod.id)}
                            >
                                <FontAwesomeIcon icon={faTrash} />
                            </IconButton>
                        )}
                    </div>
                ))}
                <Button
                    variant="contained"
                    size="large"
                    startIcon={<FontAwesomeIcon icon={faPlus} />}
                    sx={{ width: "300px" }}
                    onClick={() => addInterestPeriod()}
                >
                    {t("bondsForm.interestPeriods.add")}
                </Button>
                <h3>{t("bondsForm.calculatedDuration")}: {Utils.formatDuration(totalDuration)}</h3>
            </Stack>
        </div>
    );
}
