import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ReferenceLine,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface TrafficChartProps {
  title: string;
  description: string;
  data: any[];
  dataKeys: string[];
}

export function TrafficChart({
  title,
  description,
  data,
  dataKeys,
}: TrafficChartProps) {
  const chartConfig = {
    data: {
      color: "hsl(var(--chart-1))",
    },
    data2: {
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{ left: -30, right: 10 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={true}
              axisLine={true}
              tickMargin={8}
              interval="preserveStartEnd"
              tickFormatter={(value) => value}
              tickCount={2}
              padding={"gap"}
            />
            <YAxis domain={[0, "auto"]} />
            <ReferenceLine y={0} stroke="var(--border)" />
            <ChartTooltip
              cursor={true}
              content={<ChartTooltipContent className="w-46" />}
            />
            <defs>
              <linearGradient id="fillData" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-data)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-data2)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillData2" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-data2)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-data)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey={dataKeys[0]}
              type="monotone"
              fill="url(#fillData)"
              fillOpacity={0.4}
              stroke="var(--color-data)"
              baseValue={0}
              connectNulls={true}
            />
            <Area
              dataKey={dataKeys[1]}
              type="monotone"
              fill="url(#fillData2)"
              fillOpacity={0.4}
              stroke="var(--color-data2)"
              baseValue={0}
              connectNulls={true}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
