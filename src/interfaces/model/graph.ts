export default interface GraphData {
    data: Data;
}

interface Data {
    title: Title;
    chart: Chart;
    series: Series[];
    xaxis: Xaxis;
}

interface Xaxis {
    categories: string[];
}

interface Series {
    name: string;
    data: number[];
}

interface Chart {
    type: "bar" | "area" | "line" | "histogram" | "pie" | "donut" | "rangeBar" | "radialBar" | "scatter" | "bubble" | "heatmap" | "candlestick" | "radar" | "polarArea" | undefined;
}

interface Title {
    text: string;
}