import { useMemo, useState } from 'react';
import { expenseCategories } from '../data/transactions.js';
import { formatCurrency, formatDate } from '../utils/calculations.js';
import Icon from './Icon.jsx';

function downloadCsv(transactions, month) {
  const escapeCell = (value) => {
    let text = String(value);
    if (/^[\s]*[=+\-@]/.test(text)) text = `'${text}`;
    return `"${text.replaceAll('"', '""')}"`;
  };
  const rows = [
    [
      'Transaction',
      'Category',
      'Date',
      'Payment method',
      'Amount (USD)',
      'Type',
    ],
    ...transactions.map((transaction) => [
      transaction.title,
      transaction.category,
      transaction.date,
      transaction.paymentMethod,
      transaction.amount.toFixed(2),
      transaction.type,
    ]),
  ];
  const csv = rows.map((row) => row.map(escapeCell).join(',')).join('\r\n');
  const url = URL.createObjectURL(
    new Blob(['\uFEFF', csv], { type: 'text/csv;charset=utf-8;' }),
  );
  const link = document.createElement('a');
  link.href = url;
  link.download = `spendwise-${month}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function TransactionTable({
  transactions,
  month,
  compact,
  onAdd,
  onExport,
}) {
  const [type, setType] = useState('all');
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const categories = [
    ...new Set(
      transactions
        .filter((transaction) => type === 'all' || transaction.type === type)
        .map((transaction) => transaction.category),
    ),
  ].sort();
  const filtered = useMemo(
    () =>
      transactions
        .filter(
          (transaction) =>
            (type === 'all' || transaction.type === type) &&
            (category === 'all' || transaction.category === category) &&
            `${transaction.title} ${transaction.category} ${transaction.paymentMethod}`
              .toLowerCase()
              .includes(search.trim().toLowerCase()),
        )
        .sort((a, b) => b.date.localeCompare(a.date)),
    [transactions, type, category, search],
  );
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const visible = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );
  const hasFilters = type !== 'all' || category !== 'all' || search !== '';

  function resetFilters() {
    setType('all');
    setCategory('all');
    setSearch('');
    setPage(1);
  }

  return (
    <section
      className={`panel transaction-panel ${compact ? 'compact' : ''}`}
      id="transactions"
      aria-labelledby="transactions-heading"
    >
      <div className="panel-heading">
        <div>
          <h2 id="transactions-heading">
            Recent transactions{' '}
            <span className="count-badge">{transactions.length}</span>
          </h2>
          <p>The little details behind the bigger picture.</p>
        </div>
        <button
          className="button button-secondary export-button"
          disabled={!filtered.length}
          onClick={() => {
            downloadCsv(filtered, month);
            onExport(filtered.length);
          }}
        >
          <Icon name="download" size={16} />
          Export CSV
        </button>
      </div>
      <div className="transaction-toolbar">
        <div
          className="type-tabs"
          role="group"
          aria-label="Filter by transaction type"
        >
          {[
            ['all', 'All transactions'],
            ['expense', 'Expenses'],
            ['income', 'Income'],
          ].map(([value, label]) => (
            <button
              key={value}
              className={type === value ? 'selected' : ''}
              aria-pressed={type === value}
              onClick={() => {
                setType(value);
                setCategory('all');
                setPage(1);
              }}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="table-filters">
          <label className="search-field">
            <Icon name="search" size={16} />
            <span className="sr-only">Search transactions</span>
            <input
              type="search"
              placeholder="Search transactions..."
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
            />
          </label>
          <label className="category-select">
            <Icon name="filter" size={15} />
            <span className="sr-only">Filter by category</span>
            <select
              value={category}
              onChange={(event) => {
                setCategory(event.target.value);
                setPage(1);
              }}
            >
              <option value="all">All categories</option>
              {categories.map((name) => (
                <option key={name}>{name}</option>
              ))}
            </select>
            <Icon name="chevron" size={13} />
          </label>
        </div>
      </div>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th scope="col">Transaction</th>
              <th scope="col">Category</th>
              <th scope="col">
                Date <span className="date-order">↓</span>
              </th>
              <th scope="col">Payment method</th>
              <th scope="col">Amount</th>
              <th scope="col">Type</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((transaction) => {
              const categoryInfo = expenseCategories.find(
                (item) => item.name === transaction.category,
              );
              const isIncome = transaction.type === 'income';
              return (
                <tr key={transaction.id}>
                  <td>
                    <div className="transaction-name">
                      <span
                        className={`transaction-icon ${isIncome ? 'income-icon' : ''}`}
                        style={
                          categoryInfo
                            ? { '--category-color': categoryInfo.color }
                            : undefined
                        }
                      >
                        <Icon
                          name={isIncome ? 'briefcase' : categoryInfo?.icon}
                          size={18}
                        />
                      </span>
                      <strong>{transaction.title}</strong>
                    </div>
                  </td>
                  <td>
                    <span className="table-category">
                      {transaction.category}
                    </span>
                  </td>
                  <td className="table-date">{formatDate(transaction.date)}</td>
                  <td>
                    <span className="payment-method">
                      <Icon
                        name={
                          transaction.paymentMethod === 'Bank transfer'
                            ? 'bank'
                            : transaction.paymentMethod === 'Cash'
                              ? 'cash'
                              : 'card'
                        }
                        size={15}
                      />
                      {transaction.paymentMethod}
                    </span>
                  </td>
                  <td
                    className={`amount-cell ${isIncome ? 'income-amount' : ''}`}
                  >
                    {isIncome ? '+' : '−'}
                    {formatCurrency(transaction.amount)}
                  </td>
                  <td>
                    <span className={`type-badge ${transaction.type}`}>
                      <span />
                      {isIncome ? 'Income' : 'Expense'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {!visible.length && (
        <div className="empty-transactions">
          <span className="empty-icon">
            <Icon name="search" size={24} />
          </span>
          <h3>
            {transactions.length
              ? 'No matching transactions'
              : 'A fresh start for this month'}
          </h3>
          <p>
            {transactions.length
              ? 'Try another search or clear your filters.'
              : 'Add your first transaction to see your money at a glance.'}
          </p>
          <button
            className="button button-secondary"
            onClick={hasFilters ? resetFilters : onAdd}
          >
            {hasFilters ? 'Clear filters' : 'Add a transaction'}
          </button>
        </div>
      )}
      <div className="table-footer">
        <span role="status">
          {filtered.length
            ? `Showing ${(currentPage - 1) * pageSize + 1}–${Math.min(currentPage * pageSize, filtered.length)} of ${filtered.length} transactions`
            : '0 transactions'}
          {hasFilters && (
            <button className="clear-filters" onClick={resetFilters}>
              Clear filters
            </button>
          )}
        </span>
        <div className="pagination">
          <button
            aria-label="Previous page"
            disabled={currentPage === 1}
            onClick={() => setPage(currentPage - 1)}
          >
            <Icon name="chevronRight" size={15} className="rotate" />
          </button>
          {Array.from({ length: pageCount }, (_, index) => index + 1).map(
            (number) => (
              <button
                key={number}
                className={number === currentPage ? 'current-page' : ''}
                aria-label={`Page ${number}`}
                aria-current={number === currentPage ? 'page' : undefined}
                onClick={() => setPage(number)}
              >
                {number}
              </button>
            ),
          )}
          <button
            aria-label="Next page"
            disabled={currentPage === pageCount}
            onClick={() => setPage(currentPage + 1)}
          >
            <Icon name="chevronRight" size={15} />
          </button>
        </div>
      </div>
    </section>
  );
}
