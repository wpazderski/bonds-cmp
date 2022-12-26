import "./NumberArrayInput.scss";

import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { NumberFormatValues, NumericFormat } from "react-number-format";

import { Duration } from "../../../app/bonds/Types";
import { Utils } from "../../../app/Utils";





export interface Preset {
    id: string;
    name: "low" | "medium" | "high";
    values: number[];
}

export interface NumberArrayInputProps {
    value: number[];
    onValueChange: (value: number[]) => void;
    forDuration: Duration;
    label?: string;
    suffix: string;
    min: number;
    max: number;
    decimalScale: number;
    allowNegative: boolean;
    presets?: Preset[];
}

export function NumberArrayInput(props: NumberArrayInputProps) {
    const { t } = useTranslation();
    const [presetId, setPresetId] = useState("");
    const numRows = Math.min(props.value.length, Math.ceil(Utils.getDurationMonths(props.forDuration) / 12)) + 1;
    const onValueChange = props.onValueChange;
    
    const handleValueChange = useCallback((itemIndex: number, itemValue: number) => {
        const value = [...props.value];
        value[itemIndex] = itemValue;
        onValueChange(value);
        setPresetId("");
    }, [onValueChange, props.value]);
    
    const handlePresetChange = useCallback((event: SelectChangeEvent) => {
        const presetId = event.target.value;
        setPresetId(presetId ?? "");
        const preset = props.presets?.find(preset => preset.id === presetId);
        if (!preset) {
            return;
        }
        onValueChange([...preset.values]);
    }, [onValueChange, props.presets]);
    
    return (
        <div className="NumberArrayInput" data-testid="NumberArrayInput">
            <h4>{props.label}:</h4>
            <div className="NumberArrayInput__info">{t("common.numberArrayInput.info")}</div>
            {props.presets && (
                <FormControl sx={{ width: "300px", marginBottom: "25px" }}>
                    <InputLabel id="demo-simple-select-label">{t("common.numberArrayInput.presets.label")}</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={presetId}
                        label={t("common.numberArrayInput.presets.label")}
                        onChange={handlePresetChange}
                    >
                        {props.presets.map(preset => (
                            <MenuItem value={preset.id} key={preset.id}>{t(`common.numberArrayInput.presets.${preset.name}`)}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            )}
            <div className="NumberArrayInput__fields">
                {new Array(numRows).fill(0).map((_, index) => (
                    <ValueInput
                        key={index}
                        index={index}
                        value={props.value[index]}
                        suffix={props.suffix}
                        decimalScale={props.decimalScale}
                        allowNegative={props.allowNegative}
                        min={props.min}
                        max={props.max}
                        onValueChange={handleValueChange}
                        label={t("common.numberArrayInput.year") + " " + index}
                    />
                ))}
            </div>
        </div>
    );
}

interface ValueInputProps {
    index: number;
    value: number;
    suffix: string;
    decimalScale: number;
    allowNegative: boolean;
    min: number;
    max: number;
    onValueChange: (index: number, value: number) => void;
    label: string;
}

const ValueInput = React.memo(function (props: ValueInputProps) {
    const onValueChange = props.onValueChange;
    
    const isValueAllowed = useCallback((values: NumberFormatValues) => {
        return values.floatValue === undefined || (values.floatValue >= props.min && values.floatValue <= props.max);
    }, [props.min, props.max]);
    
    const handleValueChange = useCallback((values: NumberFormatValues) => {
        onValueChange(props.index, values.floatValue ?? 0);
    }, [onValueChange, props.index]);
    
    return (
        <NumericFormat
            thousandSeparator=" "
            decimalSeparator="."
            suffix={props.suffix}
            label={props.label}
            isAllowed={isValueAllowed}
            decimalScale={props.decimalScale}
            customInput={TextField}
            allowNegative={props.allowNegative}
            value={props.value}
            onValueChange={handleValueChange}
        />
    );
});
