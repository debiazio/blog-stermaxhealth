import estilos from './ColunaEsquerda.modules.css'
import PostsBrowser from '../../PostsBrowser'

export default function ColunaEsquerda() {
  return (
    <div className={estilos.colunaEsquerda}>
      <PostsBrowser />

    </div>
  )
}
