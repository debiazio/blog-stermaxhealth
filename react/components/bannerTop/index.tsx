import estilos from './BannerTop.modules.css'

export default function BannerTop() {
  return (
    <img
      className={estilos.banner}
      src="https://idealineblog.com.br/wp-content/uploads/2024/07/Idealine3.gif"
      alt="Banner Idealine"
      loading="eager"
    />
  )
}
