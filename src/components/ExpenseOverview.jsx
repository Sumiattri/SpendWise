import { useState } from 'react';
import {
  calculateExpenseSpending,
  formatCurrency,
  formatMonth,
  getDailySpending,
  getPercentChange,
} from '../utils/calculations.js';
import Icon from './Icon.jsx';

export default function ExpenseOverview({
  transactions,
  previousTransactions,
  month,
}) {
  const [view, setView] = useState('cumulative');
  const [activeDay, setActiveDay] = useState(null);
  const total = calculateExpenseSpending(transactions);
  const previousTotal = calculateExpenseSpending(previousTransactions);
  const change = getPercentChange(total, previousTotal);
  const daily = getDailySpending(transactions, month);
  let runningTotal = 0;
  const points = daily.map((entry) => {
    runningTotal = Math.round((runningTotal + entry.amount) * 100) / 100;
    return {
      ...entry,
      value: view === 'cumulative' ? runningTotal : entry.amount,
    };
  });
  const maxValue = Math.max(...points.map((point) => point.value), 1);
  const magnitude = 10 ** Math.floor(Math.log10(maxValue / 4));
  const axisMax = Math.ceil(maxValue / 4 / magnitude) * magnitude * 4;
  const width = 660;
  const height = 220;
  const left = 48;
  const top = 15;
  const bottom = 184;
  const right = width - 15;
  const x = (day) => left + ((day - 1) / (daily.length - 1)) * (right - left);
  const y = (value) => bottom - (value / axisMax) * (bottom - top);
  const line = points
    .map(
      (point, index) =>
        `${index === 0 ? 'M' : 'L'}${x(point.day)},${y(point.value)}`,
    )
    .join(' ');
  const area = `${line} L${right},${bottom} L${left},${bottom} Z`;
  const hovered = activeDay === null ? null : points[activeDay];
  const tooltipX = hovered
    ? Math.max(left, Math.min(x(hovered.day) - 74, right - 148))
    : 0;
  const tickDays = [1, 5, 10, 15, 20, 25, daily.length];
  const topDay = daily.reduce(
    (highest, day) => (day.amount > highest.amount ? day : highest),
    daily[0],
  );

  return (
    <section
      className="panel expense-overview"
      aria-labelledby="expense-heading"
    >
      <div className="panel-heading">
        <div>
          <h2 id="expense-heading">Expense overview</h2>
          <p>Your spending, in perspective.</p>
        </div>
        <label className="chart-select">
          <span className="sr-only">Chart view</span>
          <select
            value={view}
            onChange={(event) => {
              setView(event.target.value);
              setActiveDay(null);
            }}
          >
            <option value="cumulative">Cumulative</option>
            <option value="daily">Daily spending</option>
          </select>
          <Icon name="chevron" size={14} />
        </label>
      </div>
      <div className="chart-headline">
        <div>
          <strong>{formatCurrency(total)}</strong>
          <span>spent in {formatMonth(month).split(' ')[0]}</span>
        </div>
        <span className="chart-legend">
          <i />
          {view === 'cumulative' ? 'Cumulative spending' : 'Daily spending'}
        </span>
      </div>
      <div className="chart-comparison">
        {change === null ? (
          <span>No spending recorded in the previous month</span>
        ) : (
          <>
            <span className={`change-pill ${change <= 0 ? 'decrease' : ''}`}>
              <Icon name={change > 0 ? 'arrowUp' : 'arrowDown'} size={12} />
              {Math.abs(change).toFixed(1)}%
            </span>
            <span>vs. previous month</span>
          </>
        )}
      </div>
      <div className="chart-wrap" onMouseLeave={() => setActiveDay(null)}>
        <svg
          className="spending-chart"
          viewBox={`0 0 ${width} ${height}`}
          role="group"
          aria-label={`${view === 'cumulative' ? 'Cumulative' : 'Daily'} expenses for ${formatMonth(month)}`}
        >
          <defs>
            <linearGradient id="spending-fill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#4c9279" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#4c9279" stopOpacity="0.015" />
            </linearGradient>
          </defs>
          {[0, 1, 2, 3, 4].map((tick) => {
            const value = (axisMax * tick) / 4;
            return (
              <g key={tick}>
                <line
                  x1={left}
                  x2={right}
                  y1={y(value)}
                  y2={y(value)}
                  stroke="#e9eeeb"
                  strokeDasharray={tick ? '3 4' : undefined}
                />
                <text
                  x={left - 12}
                  y={y(value) + 4}
                  textAnchor="end"
                  className="chart-label"
                >
                  {value >= 1000
                    ? `$${(value / 1000).toLocaleString('en-US', { maximumFractionDigits: 1 })}k`
                    : `$${value.toLocaleString('en-US', { maximumFractionDigits: 2 })}`}
                </text>
              </g>
            );
          })}
          {total > 0 && view === 'cumulative' && (
            <>
              <path d={area} fill="url(#spending-fill)" />
              <path
                d={line}
                fill="none"
                stroke="#408569"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              <circle
                cx={right}
                cy={y(total)}
                r="4"
                fill="#408569"
                stroke="white"
                strokeWidth="2"
              />
            </>
          )}
          {total > 0 &&
            view === 'daily' &&
            points.map((point) => (
              <rect
                key={point.day}
                x={x(point.day) - 5}
                y={y(point.value)}
                width="10"
                height={bottom - y(point.value)}
                rx="3"
                fill="#70a58e"
              />
            ))}
          {tickDays.map((day) => (
            <text
              key={day}
              x={x(day)}
              y={height - 9}
              textAnchor={
                day === 1 ? 'start' : day === daily.length ? 'end' : 'middle'
              }
              className="chart-label"
            >
              {String(day).padStart(2, '0')}
              {day === 1 ? ` ${formatMonth(month, 'short').split(' ')[0]}` : ''}
            </text>
          ))}
          {points.map((point, index) => (
            <rect
              key={point.day}
              x={x(point.day) - 9}
              y={top}
              width="18"
              height={bottom - top}
              fill="transparent"
              tabIndex="0"
              role="img"
              aria-label={`${formatMonth(month)} ${point.day}: ${formatCurrency(point.amount)} spent, ${formatCurrency(point.value)} ${view}`}
              onMouseEnter={() => setActiveDay(index)}
              onFocus={() => setActiveDay(index)}
              onBlur={() => setActiveDay(null)}
            >
              <title>{`${formatMonth(month, 'short').split(' ')[0]} ${point.day}: ${formatCurrency(point.amount)} spent`}</title>
            </rect>
          ))}
          {hovered && total > 0 && (
            <g pointerEvents="none">
              <line
                x1={x(hovered.day)}
                x2={x(hovered.day)}
                y1={top}
                y2={bottom}
                stroke="#90b4a3"
                strokeDasharray="3 3"
              />
              <circle
                cx={x(hovered.day)}
                cy={y(hovered.value)}
                r="4"
                fill="#28765b"
                stroke="white"
                strokeWidth="2"
              />
              <rect
                x={tooltipX}
                y={top}
                width="148"
                height="51"
                rx="7"
                fill="#263b35"
              />
              <text x={tooltipX + 12} y={top + 19} fill="#c3d5cc" fontSize="10">
                {formatMonth(month, 'short').split(' ')[0]} {hovered.day} ·{' '}
                {view === 'cumulative' ? 'Total to date' : 'Daily spending'}
              </text>
              <text
                x={tooltipX + 12}
                y={top + 38}
                fill="white"
                fontSize="14"
                fontWeight="600"
              >
                {formatCurrency(hovered.value)}
              </text>
            </g>
          )}
          {total === 0 && (
            <text
              x={(left + right) / 2}
              y="95"
              textAnchor="middle"
              className="chart-empty"
            >
              No expenses recorded this month
            </text>
          )}
        </svg>
      </div>
      <div className="chart-footer">
        <span>
          <span className="footer-dot" />
          Daily average <strong>{formatCurrency(total / daily.length)}</strong>
        </span>
        <span>
          Highest spending day{' '}
          <strong>
            {total > 0
              ? `${formatMonth(month, 'short').split(' ')[0]} ${topDay.day}`
              : '—'}
          </strong>
        </span>
      </div>
    </section>
  );
}
