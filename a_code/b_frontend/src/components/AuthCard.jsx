export default function AuthCard({ title, subtitle, children, onSubmit }) {
  return (
    <form className="auth-card" onSubmit={onSubmit}>
      <div className="auth-card-heading">
        <span className="auth-card-logo">DC</span>
        <div>
          <p>Drive Corporativo</p>
          <h2>{title}</h2>
        </div>
      </div>
      <p className="auth-subtitle">{subtitle}</p>
      {children}
    </form>
  )
}
