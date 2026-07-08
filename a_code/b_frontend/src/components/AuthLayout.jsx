import { FiCloud, FiFileText, FiFolder } from 'react-icons/fi'

export default function AuthLayout({ children }) {
  return (
    <main className="auth-layout">
      <section className="auth-visual" aria-label="Drive Corporativo">
        <div className="auth-brand-mark">
          <FiFolder />
        </div>
        <div>
          <p className="auth-kicker">Drive Corporativo</p>
          <h1>Arquivos da equipe, sempre ao alcance.</h1>
          <p className="auth-visual-copy">
            Organize, armazene e acesse documentos da sua equipe em um só lugar.
          </p>
        </div>
        <div className="auth-illustration" aria-hidden="true">
          <div className="auth-cloud">
            <FiCloud />
          </div>
          <div className="auth-file-card primary">
            <FiFileText />
            <span>Contratos</span>
          </div>
          <div className="auth-file-card secondary">
            <FiFolder />
            <span>Projetos</span>
          </div>
        </div>
      </section>
      <section className="auth-form-panel">
        {children}
      </section>
    </main>
  )
}
