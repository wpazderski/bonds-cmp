import "./DurationInput.scss";

import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { NumberFormatValues, NumericFormat } from "react-number-format";

import { Utils } from "../../../app";
import { Duration, DurationUnit } from "../../../app/bonds/Types";





export interface DurationInputProps {
    value: Duration;
    onValueChange: (value: Duration) => void;
    label?: string;
    maxMonths?: number;
}

export function DurationInput(props: DurationInputProps) {
    const { t } = useTranslation();
    const onValueChange = props.onValueChange;
    const maxMonths = props.maxMonths ?? 50 * 12;
    
    // Update duration
    const updateDuration = useCallback((duration: Duration) => {
        const months = Utils.getDurationMonths(duration);
        if (months > maxMonths) {
            if (duration.unit === "m") {
                duration.num = maxMonths;
            }
            else {
                duration.num = Math.floor(maxMonths / 12);
            }
        }
        onValueChange(duration);
    }, [onValueChange, maxMonths]);
    
    // Num
    const isNumAllowed = useCallback((values: NumberFormatValues) => {
        return values.floatValue === undefined || (values.floatValue >= 1 && values.floatValue <= (props.value.unit === "m" ? maxMonths : Math.floor(maxMonths / 12)));
    }, [props.value.unit, maxMonths]);
    const handleNumChange = useCallback((value: NumberFormatValues) => {
        const duration: Duration = {
            num: value.floatValue ?? 1,
            unit: props.value.unit,
        };
        updateDuration(duration);
    }, [updateDuration, props.value.unit]);
    
    // Unit
    const handleUnitChange = useCallback((event: SelectChangeEvent<DurationUnit>) => {
        const duration: Duration = {
            num: props.value.num,
            unit: event.target.value as DurationUnit,
        };
        updateDuration(duration);
    }, [updateDuration, props.value.num]);
    
    return (
        <div className="DurationInput" data-testid="DurationInput">
            <NumericFormat
                className="DurationInput__value-num"
                thousandSeparator=" "
                label={props.label}
                isAllowed={isNumAllowed}
                decimalScale={0}
                customInput={TextField}
                allowNegative={false}
                value={props.value.num}
                onValueChange={handleNumChange}
                data-testid="DurationInput-num"
            />
            <Select
                className="DurationInput__value-unit"
                value={props.value.unit}
                sx={{ marginLeft: 1 }}
                onChange={handleUnitChange}
                data-testid="DurationInput-unit"
            >
                <MenuItem value="m">{t("common.duration.months")}</MenuItem>
                <MenuItem value="y">{t("common.duration.years")}</MenuItem>
            </Select>
        </div>
    );
}
