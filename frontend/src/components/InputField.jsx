export default function InputField({ id, label, className = '', ...props }) {
  return (
    <div className={`auth-field ${className}`.trim()}>
      <label htmlFor={id}>{label}</label>
      <input id={id} className="auth-input" {...props} />
    </div>
  )
}
