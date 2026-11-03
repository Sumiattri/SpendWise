import { formatCurrency, getCategoryBreakdown } from '../utils/calculations.js';
import Icon from './Icon.jsx';

export default function CategoryBreakdown({ transactions }) {
  const categories = getCategoryBreakdown(transactions);

  return (
    <section
      className="panel category-panel"
      id="categories"
      aria-labelledby="category-heading"
    >
      <div className="panel-heading">
        <div>
          <h2 id="category-heading">Spending by category</h2>
          <p>A closer look at where it goes.</p>
        </div>
        <span className="quiet-icon">
          <Icon name="categories" size={19} />
        </span>
      </div>
      <div className="category-list">
        {categories.map((category) => (
          <div
            key={category.name}
            className="category-row"
            style={{ '--category-color': category.color }}
          >
            <span className="category-icon">
              <Icon name={category.icon} size={17} />
            </span>
            <div className="category-info">
              <div className="category-label">
                <span>{category.name}</span>
                <strong>{formatCurrency(category.amount)}</strong>
              </div>
              <div className="category-progress-row">
                <div
                  className="category-progress"
                  role="progressbar"
                  aria-label={category.name}
                  aria-valuenow={Number(category.percentage.toFixed(1))}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <span style={{ width: `${category.percentage}%` }} />
                </div>
                <span className="category-percent">
                  {category.percentage.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="category-foot">
        <span className="footer-dot" />
        Expenses only · All payment methods
      </div>
    </section>
  );
}
