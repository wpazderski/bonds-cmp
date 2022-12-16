import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import { useTranslation } from "react-i18next";
import { NumericFormat } from "react-number-format";
import { Duration, DurationUnit } from "../../../app/bonds/Types";
import "./DurationInput.scss";

export interface DurationInputProps {
    value: Duration;
    onValueChange?: (value: Duration) => void;
    label?: string;
}

export function DurationInput(props: DurationInputProps) {
    const { t } = useTranslation();
    const handleNumChange = (num: number) => {
        if (!props.onValueChange) {
            return;
        }
        props.onValueChange({
            num,
            unit: props.value.unit,
        });
    };
    const handleUnitChange = (unit: DurationUnit) => {
        if (!props.onValueChange) {
            return;
        }
        props.onValueChange({
            num: props.value.num,
            unit,
        });
    };
    
    return (
        <div className="DurationInput">
            <NumericFormat
                className="DurationInput__value-num"
                thousandSeparator=" "
                label={props.label}
                isAllowed={values => values.floatValue === undefined || (values.floatValue >= 1 && values.floatValue <= 120)}
                decimalScale={0}
                customInput={TextField}
                allowNegative={false}
                value={props.value.num}
                onValueChange={value => handleNumChange(value.floatValue ?? 1)}
            />
            <Select
                className="DurationInput__value-unit"
                value={props.value.unit}
                sx={{ marginLeft: 1 }}
                onChange={event => handleUnitChange((event.target as any).value)}
            >
                <MenuItem value="m">{t("common.duration.months")}</MenuItem>
                <MenuItem value="y">{t("common.duration.years")}</MenuItem>
            </Select>
        </div>
    );
}
