import { useTranslation } from "react-i18next";
import { Chart } from "./chart/Chart";
import "./Charts.scss";

export function Charts() {
    const { t } = useTranslation();
    
    return (
        <div className="Charts">
            <h3>{t("charts.calculationMethod")}</h3>
            <ul>
                <li>{t("charts.calculationMethod.1")}</li>
                <li>{t("charts.calculationMethod.2")}</li>
                <li>{t("charts.calculationMethod.3")}</li>
                <li>{t("charts.calculationMethod.4")}</li>
            </ul>
            <Chart chartId="total" />
            <Chart chartId="onlyEarnings" />
            <Chart chartId="totalAdjustedForInflation" />
            <Chart chartId="onlyEarningsAdjustedForInflation" />
        </div>
    );
}
