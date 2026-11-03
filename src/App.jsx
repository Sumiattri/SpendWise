import { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar.jsx';
import SummaryCard from './components/SummaryCard.jsx';
import ExpenseOverview from './components/ExpenseOverview.jsx';
import CategoryBreakdown from './components/CategoryBreakdown.jsx';
import TransactionTable from './components/TransactionTable.jsx';
import AddTransactionDialog from './components/AddTransactionDialog.jsx';
import Dialog from './components/Dialog.jsx';
import Icon from './components/Icon.jsx';
import { sampleTransactions } from './data/transactions.js';
import {
  calculateTotalExpenses,
  calculateTotalIncome,
  calculateNetBalance,
  formatCurrency,
  formatMonth,
  getAvailableMonths,
  getLocalMonth,
  getMonthlyTransactions,
  getPreviousMonth,
} from './utils/calculations.js';

export default function App() {
  const [transactions, setTransactions] = useState(sampleTransactions);
  const [month, setMonth] = useState(getLocalMonth);
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dialog, setDialog] = useState(null);
  const [compact, setCompact] = useState(false);
  const [toast, setToast] = useState('');
  const currentMonth = getLocalMonth();
  const monthlyTransactions = getMonthlyTransactions(transactions, month);
  const previousTransactions = getMonthlyTransactions(
    transactions,
    getPreviousMonth(month),
  );
  const expenseCount = monthlyTransactions.filter(
    (transaction) => transaction.type === 'expense',
  ).length;
  const incomeCount = monthlyTransactions.length - expenseCount;
  const availableMonths = getAvailableMonths(transactions, currentMonth);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(''), 4500);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    function closeSidebar(event) {
      if (event.key === 'Escape') setSidebarOpen(false);
    }
    window.addEventListener('keydown', closeSidebar);
    return () => window.removeEventListener('keydown', closeSidebar);
  }, []);

  function navigate(section) {
    setActiveSection(section);
    setSidebarOpen(false);
  }

  function openSettings() {
    setSidebarOpen(false);
    setDialog('settings');
  }

  function saveTransaction(transaction) {
    setTransactions((previous) => [...previous, transaction]);
    setMonth(transaction.date.slice(0, 7));
    setDialog(null);
    setToast('Transaction added. Your overview is up to date.');
  }

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Sidebar
        activeSection={activeSection}
        onNavigate={navigate}
        onSettings={openSettings}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="main-shell">
        <header className="topbar">
          <div className="breadcrumbs">
            <button
              className="icon-button mobile-menu"
              aria-label="Open navigation"
              aria-expanded={sidebarOpen}
              onClick={() => setSidebarOpen(true)}
            >
              <Icon name="menu" />
            </button>
            <span>My workspace</span>
            <Icon name="chevronRight" size={13} />
            <strong>Overview</strong>
          </div>
          <div className="workspace-label">
            <span className="status-dot" />
            Personal workspace
            <span className="topbar-divider" />
            <span className="mini-avatar">JD</span>
          </div>
        </header>
        <main id="main-content">
          <section className="page-heading" id="overview">
            <div>
              <div className="eyebrow">A LITTLE MORE CLARITY, EVERY DAY</div>
              <h1>
                Overview<span className="heading-dot">.</span>
              </h1>
              <p>Welcome back, Jamie. Let’s make sense of your spending.</p>
            </div>
            <div className="header-actions">
              <label className="month-select">
                <Icon name="calendar" size={17} />
                <span className="sr-only">Select month</span>
                <select
                  value={month}
                  onChange={(event) => setMonth(event.target.value)}
                >
                  {availableMonths.map((item) => (
                    <option key={item} value={item}>
                      {formatMonth(item)}
                    </option>
                  ))}
                </select>
                <Icon name="chevron" size={14} />
              </label>
              <button
                className="button button-primary"
                onClick={() => setDialog('add')}
              >
                <Icon name="plus" size={18} />
                Add transaction
              </button>
            </div>
          </section>
          <section
            className="summary-grid"
            aria-label={`Summary for ${formatMonth(month)}`}
          >
            <SummaryCard
              title="Total Expenses"
              value={formatCurrency(
                calculateTotalExpenses(monthlyTransactions),
              )}
              icon="arrowUp"
              variant="expenses-summary"
              detail={`${expenseCount} expense${expenseCount === 1 ? '' : 's'}`}
              note="this month"
            />
            <SummaryCard
              title="Total Income"
              value={formatCurrency(calculateTotalIncome(monthlyTransactions))}
              icon="arrowDown"
              variant="income-summary"
              detail={`${incomeCount} income ${incomeCount === 1 ? 'entry' : 'entries'}`}
              note="this month"
            />
            <SummaryCard
              title="Net Balance"
              value={formatCurrency(calculateNetBalance(monthlyTransactions))}
              icon="wallet"
              variant="balance-summary"
              detail="Income minus expenses"
              note=""
            />
            <SummaryCard
              title="Transactions"
              value={String(monthlyTransactions.length).padStart(2, '0')}
              icon="receipt"
              variant="count-summary"
              detail={`${expenseCount} expenses`}
              note={`· ${incomeCount} income`}
            />
          </section>
          <div className="insights-grid">
            <ExpenseOverview
              key={month}
              transactions={monthlyTransactions}
              previousTransactions={previousTransactions}
              month={month}
            />
            <CategoryBreakdown transactions={monthlyTransactions} />
          </div>
          <TransactionTable
            key={month}
            transactions={monthlyTransactions}
            month={month}
            compact={compact}
            onAdd={() => setDialog('add')}
            onExport={(count) =>
              setToast(
                `Exported ${count} transaction${count === 1 ? '' : 's'} to CSV.`,
              )
            }
          />
          <footer className="page-footer">
            <span>
              <span className="footer-brand">SpendWise</span> A little more
              mindful with your money.
            </span>
            <span>
              <span className="sample-dot" />
              Sample workspace · USD
            </span>
          </footer>
        </main>
      </div>
      {dialog === 'add' && (
        <AddTransactionDialog
          month={month}
          onClose={() => setDialog(null)}
          onSave={saveTransaction}
        />
      )}
      {dialog === 'settings' && (
        <Dialog
          title="Workspace settings"
          description="A few details to make this space feel like yours."
          onClose={() => setDialog(null)}
        >
          <div className="settings-content">
            <div className="setting-line">
              <div>
                <strong>Compact transactions</strong>
                <p>Fit more detail into your transaction table.</p>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={compact}
                  onChange={(event) => setCompact(event.target.checked)}
                  aria-label="Compact transactions"
                />
                <span />
              </label>
            </div>
            <div className="setting-line">
              <div>
                <strong>Currency</strong>
                <p>All amounts in this workspace use US dollars.</p>
              </div>
              <span className="setting-value">USD $</span>
            </div>
            <div className="setting-line">
              <div>
                <strong>Sample workspace</strong>
                <p>
                  Explore with sample data. New transactions and preferences
                  reset when you reload.
                </p>
              </div>
              <span className="setting-value">Demo</span>
            </div>
          </div>
          <div className="dialog-actions">
            <button
              className="button button-primary"
              onClick={() => setDialog(null)}
            >
              Done
              <Icon name="check" size={17} />
            </button>
          </div>
        </Dialog>
      )}
      {toast && (
        <div className="toast" role="status">
          <span className="toast-check">
            <Icon name="check" size={16} />
          </span>
          {toast}
          <button
            className="icon-button"
            onClick={() => setToast('')}
            aria-label="Dismiss notification"
          >
            <Icon name="close" size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
