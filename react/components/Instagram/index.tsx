import estilos from "./instagram.modules.css"

const posts = [
    {
    imagem:
      "https://stermax.com.br/images_idealine/blog-stermax/instagram/1.webp",
    link: "https://www.instagram.com/p/DWhX_7ejgHN/",
  },
    {
    imagem:
      "https://stermax.com.br/images_idealine/blog-stermax/instagram/2.webp",
    link: "https://www.instagram.com/p/DWZkb8aFANk/",
  },
    {
    imagem:
      "https://stermax.com.br/images_idealine/blog-stermax/instagram/3.webp",
    link: "https://www.instagram.com/p/DWUbdmlDaRa/?img_index=1",
  },
    {
    imagem:
      "https://stermax.com.br/images_idealine/blog-stermax/instagram/4.webp",
    link: "https://www.instagram.com/p/DWFTSadAVmd/",
  },
    {
    imagem:
      "https://stermax.com.br/images_idealine/blog-stermax/instagram/5.webp",
    link: "https://www.instagram.com/p/DWAJseEGjwl/",
  },
    {
    imagem:
      "https://stermax.com.br/images_idealine/blog-stermax/instagram/6.webp",
    link: "https://www.instagram.com/p/DVws7_xDYk4/?img_index=1",
  }
]

export default function InstagramBlog() {
  return (
    <div className={estilos.instagramLinha}>
      <div className={estilos.instagramTitulo}>
        <a
          href="https://www.instagram.com/stermax_health/"
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
