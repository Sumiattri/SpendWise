import Icon from './Icon.jsx';

export default function SummaryCard({
  title,
  value,
  icon,
  variant = '',
  detail,
  note,
}) {
  return (
    <article className={`summary-card ${variant}`}>
      <div className="summary-top">
        <span>{title}</span>
        <span className="summary-icon">
          <Icon name={icon} size={19} />
        </span>
      </div>
      <strong className="summary-value">{value}</strong>
      <div className="summary-foot">
        <span className="summary-detail">{detail}</span>
        <span>{note}</span>
      </div>
    </article>
  );
}
