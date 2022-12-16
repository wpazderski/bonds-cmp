import { useState } from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import { useTranslation } from "react-i18next";
import { NumericFormat } from "react-number-format";
import { Duration } from "../../../app/bonds/Types";
import { Utils } from "../../../app/Utils";
import "./NumberArrayInput.scss";

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
    const handleValueChange = (itemIndex: number, itemValue: number) => {
        const value = [...props.value];
        value[itemIndex] = itemValue;
        props.onValueChange(value);
        setPresetId("");
    };
    const handlePresetChange = (presetId: string | null) => {
        setPresetId(presetId ?? "");
        const preset = props.presets?.find(preset => preset.id === presetId);
        if (!preset) {
            return;
        }
        props.onValueChange([...preset.values]);
    };
    
    return (
        <div className="NumberArrayInput">
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
                        onChange={event => handlePresetChange(event.target.value)}
                    >
                        {props.presets.map(preset => (
                            <MenuItem value={preset.id} key={preset.id}>{t(`common.numberArrayInput.presets.${preset.name}`)}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            )}
            <div className="NumberArrayInput__fields">
                {new Array(numRows).fill(0).map((_, index) => (
                    <NumericFormat
                        key={index}
                        thousandSeparator=" "
                        decimalSeparator="."
                        suffix={props.suffix}
                        label={t("common.numberArrayInput.year") + " " + index}
                        isAllowed={values => values.floatValue === undefined || (values.floatValue >= props.min && values.floatValue <= props.max)}
                        decimalScale={props.decimalScale}
                        customInput={TextField}
                        allowNegative={props.allowNegative}
                        value={props.value[index]}
                        onValueChange={value => handleValueChange(index, value.floatValue ?? 0)}
                    />
                ))}
            </div>
        </div>
    );
}
