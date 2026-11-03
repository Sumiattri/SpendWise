# SpendWise

A personal finance dashboard built with React, JavaScript, Vite, and plain CSS. Includes 8 deterministic sample transactions: 5 in November 2026 and 3 in October 2026. All sample amounts are whole multiples of 10.

## Run locally

Use Node.js 22.12+ (or a newer supported Node.js release).

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. The dashboard starts on the current calendar month. Choose **November 2026** or **October 2026** to explore the sample records; other months display an empty state.

```sh
npm run build
npm run preview
```

## Project structure

```text
src/
  components/       Sidebar, summary cards, chart, category bars, table, dialogs
  data/
    transactions.js Fixed sample records, categories, and payment methods
  utils/
    calculations.js Financial calculations and date/currency formatting
  App.jsx           Dashboard state, month selection, and component composition
  App.css           Styling, responsive layouts, and accessibility states
  main.jsx          React entry point
public/
  fonts/            Locally served fonts and their licenses
  favicon.svg       Application icon
```

## Using the dashboard

- Change the month to update the summaries, chart, categories, and table together.
- Switch the expense chart between cumulative and daily spending. Hover or focus a day for its value.
- Search transactions, filter by type or category, and page through the results.
- Export CSV downloads all matching records for the selected month, including records on other pages.
- Add an income or expense with the **Add transaction** button. The dashboard switches to the entry’s month.
- Use **Settings** to toggle compact transaction rows.

Amounts use USD. This is a browser-only sample workspace: transactions and preferences are stored in React state and reset when the page reloads. It does not connect to a bank or require API keys. All fonts and icons are served locally.
