import React from "react";

interface PieChartItem {
  label: string;
  value: number;
  color: string;
  legendColor: string;
}

interface PieChartCardProps {
  title: string;
  data: PieChartItem[];
  totalLabel?: string;
  formatCurrency: (amount: number) => string;
}

const PieChartCard: React.FC<PieChartCardProps> = ({
  title,
  data,
  totalLabel = "Total",
  formatCurrency,
}) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  const radius = 70;

  const circumference = 2 * Math.PI * radius;

  let accumulatedPercentage = 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 h-full flex flex-col shadow-xs hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="mb-5">
        <h3 className="text-base font-bold text-gray-900">{title}</h3>

        <p className="text-sm text-gray-500 mt-1">
          Breakdown visualization
        </p>
      </div>

      {/* Chart */}
      <div className="flex-1 flex items-center justify-center">
        <svg
          width="220"
          height="220"
          viewBox="0 0 200 200"
          className="transform -rotate-90"
        >
          {total === 0 ? (
            <circle
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="32"
            />
          ) : (
            data.map((item, index) => {
              const percentage = (item.value / total) * 100;

              const dashArray = `${
                (percentage / 100) * circumference
              } ${circumference}`;

              const dashOffset = -(
                (accumulatedPercentage / 100) *
                circumference
              );

              accumulatedPercentage += percentage;

              return (
                <circle
                  key={index}
                  cx="100"
                  cy="100"
                  r={radius}
                  fill="none"
                  stroke={item.color}
                  strokeWidth="32"
                  strokeDasharray={dashArray}
                  strokeDashoffset={dashOffset}
                  strokeLinecap="round"
                  className="transition-all duration-500"
                />
              );
            })
          )}
        </svg>
      </div>

      {/* Legend */}
      <div className="mt-5 space-y-3">
        {data.map((item, index) => {
          const percentage =
            total > 0 ? ((item.value / total) * 100).toFixed(1) : "0";

          return (
            <div
              key={index}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className={`w-3 h-3 rounded-full ${item.legendColor}`}
                />

                <span className="text-sm text-gray-700 truncate">
                  {item.label}
                </span>
              </div>

              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">
                  {percentage}%
                </p>

                <p className="text-xs text-gray-500">
                  {formatCurrency(item.value)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-5 pt-4 border-t border-gray-200 text-center">
        <p className="text-xs text-gray-500">{totalLabel}</p>

        <p className="text-xl font-bold text-gray-900 mt-1">
          {formatCurrency(total)}
        </p>
      </div>
    </div>
  );
};

export default PieChartCard;