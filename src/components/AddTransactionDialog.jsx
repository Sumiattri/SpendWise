import { useState } from 'react';
import {
  expenseCategories,
  incomeCategories,
  paymentMethods,
} from '../data/transactions.js';
import { getLocalMonth } from '../utils/calculations.js';
import Dialog from './Dialog.jsx';
import Icon from './Icon.jsx';

export default function AddTransactionDialog({ month, onClose, onSave }) {
  const today = new Date();
  const initialDate =
    month === getLocalMonth(today)
      ? `${month}-${String(today.getDate()).padStart(2, '0')}`
      : `${month}-01`;
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState(expenseCategories[0].name);
  const [error, setError] = useState('');
  const categories =
    type === 'expense'
      ? expenseCategories.map((item) => item.name)
      : incomeCategories;

  function changeType(nextType) {
    setType(nextType);
    setCategory(
      nextType === 'expense' ? expenseCategories[0].name : incomeCategories[0],
    );
  }

  function handleSubmit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const title = String(form.get('title'));
    const amount = form.get('amount');
    const date = String(form.get('date'));
    const paymentMethod = String(form.get('paymentMethod'));
    if (!title.trim()) {
      setError('Enter a name for this transaction.');
      return;
    }
    const value = Number(amount);
    if (!Number.isFinite(value) || value <= 0 || value > 9999999.99) {
      setError('Enter an amount between $0.01 and $9,999,999.99.');
      return;
    }
    if (
      !date ||
      !categories.includes(category) ||
      !paymentMethods.includes(paymentMethod)
    ) {
      setError('Choose a date, category, and payment method.');
      return;
    }
    onSave({
      id: crypto.randomUUID(),
      title: title.trim(),
      amount: Math.round(value * 100) / 100,
      category,
      date,
      type,
      paymentMethod,
    });
  }

  return (
    <Dialog
      title="Add a transaction"
      description="A small detail. A clearer picture of your money."
      onClose={onClose}
    >
      <form className="transaction-form" onSubmit={handleSubmit}>
        <div
          className="form-type-toggle"
          role="group"
          aria-label="Transaction type"
        >
          <button
            type="button"
            className={type === 'expense' ? 'selected' : ''}
            aria-pressed={type === 'expense'}
            onClick={() => changeType('expense')}
          >
            <Icon name="arrowUp" size={17} />
            Expense
          </button>
          <button
            type="button"
            className={type === 'income' ? 'selected' : ''}
            aria-pressed={type === 'income'}
            onClick={() => changeType('income')}
          >
            <Icon name="arrowDown" size={17} />
            Income
          </button>
        </div>
        <label>
          Transaction name
          <input
            name="title"
            autoFocus
            required
            maxLength={80}
            placeholder="e.g. Weekly groceries"
          />
        </label>
        <div className="form-row">
          <label>
            Amount (USD)
            <div className="amount-input">
              <span>$</span>
              <input
                name="amount"
                type="number"
                min="0.01"
                max="9999999.99"
                step="0.01"
                inputMode="decimal"
                required
                placeholder="0.00"
              />
            </div>
          </label>
          <label>
            Date
            <input
              name="date"
              type="date"
              min="2000-01-01"
              max="2099-12-31"
              required
              defaultValue={initialDate}
            />
          </label>
        </div>
        <div className="form-row">
          <label>
            Category
            <select
              name="category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              {categories.map((name) => (
                <option key={name}>{name}</option>
              ))}
            </select>
          </label>
          <label>
            Payment method
            <select name="paymentMethod" defaultValue="Debit card">
              {paymentMethods.map((method) => (
                <option key={method}>{method}</option>
              ))}
            </select>
          </label>
        </div>
        {error && (
          <p role="alert" className="form-error">
            {error}
          </p>
        )}
        <p className="form-note">
          Demo workspace · Changes last until you reload the page.
        </p>
        <div className="dialog-actions">
          <button
            className="button button-secondary"
            type="button"
            onClick={onClose}
          >
            Cancel
          </button>
          <button className="button button-primary" type="submit">
            <Icon name="plus" size={17} />
            Add transaction
          </button>
        </div>
      </form>
    </Dialog>
  );
}
