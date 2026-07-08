export default function LoadingButton({ loading, loadingText, children, ...props }) {
  return (
    <button className="auth-button" disabled={loading || props.disabled} {...props}>
      {loading && <span className="auth-spinner" aria-hidden="true" />}
      <span>{loading ? loadingText : children}</span>
    </button>
  )
}
