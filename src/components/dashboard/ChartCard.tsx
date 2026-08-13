"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type ChartData = Record<string, string | number>;

type ChartCardProps = {
  title: string;
  description?: string;

  data: ChartData[];

  dataKey: string;

  xAxisKey?: string;

  height?: number;

  emptyMessage?: string;
};

export function ChartCard({
  title,
  description,
  data,
  dataKey,
  xAxisKey = "date",
  height = 340,
  emptyMessage = "Ainda não existem dados suficientes para exibir este gráfico.",
}: ChartCardProps) {
  return (
    <Card className="h-full">

      <CardHeader>

        <CardTitle className="heading">
          {title}
        </CardTitle>

        {description && (
          <CardDescription>
            {description}
          </CardDescription>
        )}

      </CardHeader>

      <CardContent>

        {data.length === 0 ? (

          <div
            className="flex items-center justify-center rounded-2xl border border-dashed border-border text-sm text-muted-foreground"
            style={{ height }}
          >
            {emptyMessage}
          </div>

        ) : (

          <div
            className="w-full"
            style={{ height }}
          >

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <AreaChart
                data={data}
                margin={{
                  top: 10,
                  right: 10,
                  left: -15,
                  bottom: 0,
                }}
              >

                <defs>

                  <linearGradient
                    id="chartGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >

                    <stop
                      offset="5%"
                      stopColor="var(--primary)"
                      stopOpacity={0.35}
                    />

                    <stop
                      offset="95%"
                      stopColor="var(--primary)"
                      stopOpacity={0}
                    />

                  </linearGradient>

                </defs>

                <CartesianGrid
                  vertical={false}
                  stroke="var(--border)"
                />

                <XAxis
                  dataKey={xAxisKey}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={12}
                />

                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={12}
                />

                <Tooltip
                  cursor={{
                    stroke: "var(--border)",
                  }}
                  contentStyle={{
                    borderRadius: 16,
                    border: "1px solid var(--border)",
                    background: "var(--card)",
                    color: "var(--foreground)",
                  }}
                />

                <Area
                  type="monotone"
                  dataKey={dataKey}
                  stroke="var(--primary)"
                  strokeWidth={3}
                  fill="url(#chartGradient)"
                  activeDot={{
                    r: 5,
                  }}
                />

              </AreaChart>

            </ResponsiveContainer>

          </div>

        )}

      </CardContent>

    </Card>
  );
}