import estilos from "./instagram.modules.css"

const posts = [
    {
    imagem:
      "https://stermax.com.br/images_idealine/blog-idealine/instagram/ultimos-dias.webp",
    link: "https://www.instagram.com/p/DWeP1IFDVyu/",
  },
    {
    imagem:
      "https://stermax.com.br/images_idealine/blog-idealine/instagram/perola-5l.webp",
    link: "https://www.instagram.com/p/DWWr6XrE136/",
  },
    {
    imagem:
      "https://stermax.com.br/images_idealine/blog-idealine/instagram/bellinha-5l-denovo.webp",
    link: "https://www.instagram.com/p/DWUbejKiPf0/?img_index=1",
  },
    {
    imagem:
      "https://stermax.com.br/images_idealine/blog-idealine/instagram/idealine-diferente.webp",
    link: "https://www.instagram.com/p/DWPmeeDkgWZ/?img_index=1",
  },
    {
    imagem:
      "https://stermax.com.br/images_idealine/blog-idealine/instagram/esgotado.webp",
    link: "https://www.instagram.com/p/DWPElYQAFmJ/",
  },
    {
    imagem:
      "https://stermax.com.br/images_idealine/blog-idealine/instagram/rose-gold.webp",
    link: "https://www.instagram.com/p/DWG8ehOjcT7/",
  },
    {
    imagem:
      "https://stermax.com.br/images_idealine/blog-idealine/instagram/5litros.webp",
    link: "https://www.instagram.com/p/DWEf6kiiVix/",
  },
    {
    imagem:
      "https://stermax.com.br/images_idealine/blog-idealine/instagram/labelle8l.webp",
    link: "https://www.instagram.com/p/DWCufmZCOXD/",
  },
    {
    imagem:
      "https://stermax.com.br/images_idealine/blog-idealine/instagram/silver-loteespecial.webp",
    link: "https://www.instagram.com/p/DV_Zu2Tjamt/",
  },
    {
    imagem:
      "https://stermax.com.br/images_idealine/blog-idealine/instagram/save-the-date.webp",
    link: "https://www.instagram.com/p/DVw3RYwgBtk/",
  },
  {
    imagem:
      "https://stermax.com.br/images_idealine/blog-idealine/instagram/dvm.webp",
    link: "https://www.instagram.com/p/DVws8n1Fq1U/",
  },
  {
    imagem:
      "https://stermax.com.br/images_idealine/blog-idealine/instagram/1-idealine-blog-instagram.webp",
    link: "https://www.instagram.com/p/DVtzcaqjyef/",
  },
  {
    imagem:
      "https://stermax.com.br/images_idealine/blog-idealine/instagram/2-idealine-blog-instagram.webp",
    link: "https://www.instagram.com/p/DVrOvlwAbXv/",
  },
  {
    imagem:
      "https://stermax.com.br/images_idealine/blog-idealine/instagram/3-idealine-blog-instagram.webp",
    link: "https://www.instagram.com/p/DVnzAqHjDn-/",
  },
  {
    imagem:
      "https://stermax.com.br/images_idealine/blog-idealine/instagram/4-idealine-blog-instagram.webp",
    link: "https://www.instagram.com/p/DVjiVEiFLk2/",
  },
  {
    imagem:
      "https://stermax.com.br/images_idealine/blog-idealine/instagram/5-idealine-blog-instagram.webp",
    link: "https://www.instagram.com/p/DVgc1l6gVoZ/",
  },
  {
    imagem:
      "https://stermax.com.br/images_idealine/blog-idealine/instagram/6-idealine-blog-instagram.webp",
    link: "https://www.instagram.com/p/DVcGkJPCUTC/",
  },
]

export default function InstagramBlog() {
  return (
    <div className={estilos.instagramLinha}>
      <div className={estilos.instagramTitulo}>
        <a
          href="https://www.instagram.com/idealine_autoclaves/"
          target="_blank"
          rel="noreferrer"
        >
          <img
            src="https://mfmgroup.vtexassets.com/assets/vtex.file-manager-graphql/images/8f037d0c-0632-4d9e-92ce-1e5006db075e___7d51a228807c69f801f9289c4f8606c3.png"
            alt="Instagram"
          />
        </a>
      </div>

      <div className={estilos.conteudoInstagram}>
        <div className={estilos.sliderTrack}>
          {[...posts, ...posts].map((post, index) => (
            <a
              key={index}
              href={post.link}
              target="_blank"
              rel="noreferrer"
              className={estilos.linkPost}
            >
              <img
                className={estilos.instagramImagem}
                src={post.imagem}
                alt={`Post do Instagram ${index + 1}`}
              />
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
