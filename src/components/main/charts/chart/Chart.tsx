import { useMemo, useRef } from "react";
import Button from "@mui/material/Button";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExpand } from "@fortawesome/free-solid-svg-icons";
import { selectAvailableBonds, selectSettings, useAppSelector } from "../../../../app/store";
import { Bonds, Calculator } from "../../../../app/bonds";
import { Line as LineChart } from "react-chartjs-2";
import {  Chart as ChartJS, ChartData, ChartOptions, CategoryScale, LineElement, LinearScale, PointElement, Title, Tooltip, Legend } from "chart.js";
import { Utils } from "../../../../app/Utils";
import { ChartColors } from "./ChartColors";
import "./Chart.scss";

ChartJS.register(
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
);

const chartOptions: ChartOptions<"line"> = {
    interaction: {
        intersect: false,
        mode: "index",
    },
    plugins: {
        tooltip: {
            itemSort: (a, b) => (b.raw as number) - (a.raw as number),
        },
    },
};

const notInvested: Bonds = {
    id: "notInvested",
    name: "",
    unitPrice: 0.01,
    capitalization: false,
    interestPeriods: [
        {
            id: "ip1",
            repeats: 1,
            duration: { num: 1, unit: "y" },
            interestRate: { additivePercent: 0, additiveInflation: false, additiveReferenceRate: false },
            cancellationPolicy: { fixedPenalty: 0.00, percentOfInterestPeriodInterest: 0, percentOfTotalInterest: 0, limitedToInterestPeriodInterest: false, limitedToTotalInterest: false },
        },
    ],
};

export type ChartId = "total" | "onlyEarnings" | "totalAdjustedForInflation" | "onlyEarningsAdjustedForInflation";

export interface ChartProps {
    chartId: ChartId;
}

export function Chart(props: ChartProps) {
    const { t } = useTranslation();
    const chartContainer = useRef<HTMLDivElement>(null);
    const availableBonds = useAppSelector(selectAvailableBonds);
    const settings = useAppSelector(selectSettings);
    const handleOpenFullScreenClick = () => {
        chartContainer.current?.requestFullscreen();
    }; 
    const onlyEarnings = props.chartId === "onlyEarnings" || props.chartId === "onlyEarningsAdjustedForInflation";
    const adjustedForInflation = props.chartId === "totalAdjustedForInflation" || props.chartId === "onlyEarningsAdjustedForInflation";
    
    const labels = useMemo(() => {
        const computedLabels = [];
        const durationMonths = Utils.getDurationMonths(settings.investmentDuration);
        const dt = new Date();
        let m = dt.getMonth() + 1;
        let y = dt.getFullYear();
        for (let i = 0; i < durationMonths; ++i) {
            computedLabels.push(`${m.toString().padStart(2, "0")}.${y}`);
            ++m;
            if (m > 12) {
                m = 1;
                y++;
            }
        }
        return computedLabels;
    }, [settings.investmentDuration]);
    
    const datasets = useMemo(() => {
        const colors = new ChartColors();
        const computedDatasets = [];
        notInvested.name = t("charts.notInvested");
        for (const bonds of [...availableBonds, notInvested]) {
            const calculator = new Calculator(bonds, settings);
            const result = calculator.calculate(onlyEarnings, adjustedForInflation);
            computedDatasets.push({
                label: bonds.name,
                data: result,
                backgroundColor: colors.next(),
            });
        }
        return computedDatasets;
    }, [availableBonds, settings, onlyEarnings, adjustedForInflation, t]);
    
    const chartData = useMemo<ChartData<"line">>(() => {
        return {
            labels: labels,
            datasets: datasets,
        };
    }, [labels, datasets]);
    
    return (
        <section className="Chart">
            <h3>
                {t(`charts.${props.chartId}`)}
                <Button
                    variant="outlined"
                    size="small"
                    startIcon={<FontAwesomeIcon icon={faExpand}/>}
                    onClick={() => handleOpenFullScreenClick()}
                >
                    {t("charts.openFullScreen")}
                </Button>
            </h3>
            {props.chartId === "onlyEarningsAdjustedForInflation" && (
                <ul>
                    <li>{t("charts.onlyEarningsAdjustedForInflation.1")}</li>
                </ul>
            )}
            <div className="Charts__chart-container" data-chart-id={props.chartId} ref={chartContainer}>
                <LineChart data={chartData} options={chartOptions} />
            </div>
        </section>
    );
}
