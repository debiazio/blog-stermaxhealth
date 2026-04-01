import React, { useMemo } from 'react'
import { useRuntime } from 'vtex.render-runtime'
import Topo from './components/topo'
import BannerTop from './components/bannerTop'
import ColunaDireita from './components/ColunasHome/colunaDireita'
import TituloHome from './components/tituloHome'
import Footer from './components/footer'
import InstagramBlog from './components/Instagram'
import postsData from './data'
import styles from './components/PostsBrowser/postBrowser.modules.css'
import estilos from './styles/home.css'

type PostImagem = {
  url: string
  alt?: string
  legenda?: string
}

type ConteudoItem =
  | { tipo: 'paragrafo'; texto: string }
  | { tipo: 'subtitulo'; texto: string }
  | { tipo: 'imagem'; url: string; alt?: string; legenda?: string }
  | { tipo: 'link'; texto: string; url: string }
  | { tipo: 'lista'; itens: string[] }
  | { tipo: string; [k: string]: unknown }

type Post = {
  id: string
  slug?: string
  categoria?: string
  titulo: string
  resumo?: string
  palavrasChave?: string[]
  imagens?: PostImagem[]
  conteudo?: ConteudoItem[]
}

type PostsJson = { posts: Post[] } | Post[]

function normalizeText(value: string): string {
  try {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
  } catch {
    return value.toLowerCase()
  }
}

function coercePosts(json: unknown): Post[] {
  const raw: unknown =
    Array.isArray(json) ? json : (json as { posts?: unknown })?.posts

  if (!Array.isArray(raw)) return []

  const out: Post[] = []

  for (let i = 0; i < raw.length; i++) {
    const p = raw[i] as Partial<Post> | null | undefined
    const titulo = typeof p?.titulo === 'string' ? p.titulo.trim() : ''

    if (!titulo) continue

    const id =
      typeof p?.id === 'string' && p.id.trim() ? p.id.trim() : String(i + 1)

    out.push({
      id,
      slug: typeof p?.slug === 'string' ? p.slug : undefined,
      categoria: typeof p?.categoria === 'string' ? p.categoria : undefined,
      titulo,
      resumo: typeof p?.resumo === 'string' ? p.resumo : undefined,
      palavrasChave: Array.isArray(p?.palavrasChave)
        ? p!.palavrasChave!.filter((k) => typeof k === 'string')
        : undefined,
      imagens: Array.isArray(p?.imagens)
        ? (p!.imagens as PostImagem[])
        : undefined,
      conteudo: Array.isArray(p?.conteudo)
        ? (p!.conteudo as ConteudoItem[])
        : undefined,
    })
  }

  return out
}

function isSafeUrl(url: string): boolean {
  return /^https?:\/\//i.test(url) || url.startsWith('/')
}

function getPreview(post: Post): string {
  if (post.resumo) return post.resumo

  const firstParagraph = post.conteudo?.find(
    (i) =>
      (i as any)?.tipo === 'paragrafo' && typeof (i as any)?.texto === 'string'
  ) as any

  return firstParagraph?.texto ? String(firstParagraph.texto) : ''
}

function renderPostContent(post: Post) {
  if (!Array.isArray(post.conteudo) || !post.conteudo.length) {
    return (
      <section className={styles.openArea}>
        <p className={styles.emptyOpen}>Este post não tem campo "conteudo".</p>
      </section>
    )
  }

  return (
    <section className={styles.openArea}>
      <div className={styles.content}>
        {post.conteudo.map((item, idx) => {
          const tipo = (item as any)?.tipo

          if (tipo === 'subtitulo') {
            return (
              <h2 key={idx} className={styles.subtitle}>
                {String((item as any).texto || '')}
              </h2>
            )
          }

          if (tipo === 'paragrafo') {
            return (
              <p key={idx} className={styles.paragraph}>
                {String((item as any).texto || '')}
              </p>
            )
          }

          if (tipo === 'lista') {
            const itens = Array.isArray((item as any).itens)
              ? (item as any).itens
              : []

            return (
              <ul key={idx} className={styles.bullets}>
                {itens.map((it: any, i: number) => (
                  <li key={i}>{String(it)}</li>
                ))}
              </ul>
            )
          }

          if (tipo === 'link') {
            const url = String((item as any).url || '#')
            const texto = String((item as any).texto || url)

            return (
              <p key={idx} className={styles.paragraph}>
                <a
                  className={styles.link}
                  href={url}
                  target={
                    isSafeUrl(url) && url.startsWith('http')
                      ? '_blank'
                      : undefined
                  }
                  rel={
                    isSafeUrl(url) && url.startsWith('http')
                      ? 'noreferrer'
                      : undefined
                  }
                >
                  {texto}
                </a>
              </p>
            )
          }

          if (tipo === 'imagem') {
            const url = String((item as any).url || '')
            const alt = String((item as any).alt || '')
            const legenda = String((item as any).legenda || '')

            if (!url) return null

            return (
              <figure key={idx} className={styles.figure}>
                <img className={styles.image} src={url} alt={alt} />
                {legenda ? (
                  <figcaption className={styles.caption}>
                    {legenda}
                  </figcaption>
                ) : null}
              </figure>
            )
          }

          return null
        })}
      </div>
    </section>
  )
}

const BlogPostIdealine: React.FC = () => {
  const runtime = useRuntime()

  const slugParam = (runtime?.route?.params as any)?.slug
  const slug = typeof slugParam === 'string' ? slugParam : ''

  const posts = useMemo(() => coercePosts(postsData as unknown as PostsJson), [])

  const post = useMemo(() => {
    const wantSlug = normalizeText(slug)

    if (!wantSlug) return null

    return posts.find((p) => normalizeText(p.slug ?? p.id) === wantSlug) ?? null
  }, [posts, slug])

  const categoryPosts = useMemo(() => {
    if (!slug || post) return []

    const wantCategory = normalizeText(slug)

    return posts.filter(
      (p) => normalizeText(p.categoria ?? '') === wantCategory
    )
  }, [posts, slug, post])

  let mainContent: React.ReactNode = null

  if (!slug) {
    mainContent = (
      <section className={styles.wrapper}>
        <h2 className={styles.title}>Post</h2>
        <p className={styles.empty}>Slug não informado na rota.</p>
      </section>
    )
  } else if (post) {
    mainContent = (
      <article className={styles.wrapper}>
        <header className={styles.cardTop}>
          <h1 className={styles.cardTitle}>{post.titulo}</h1>
          {post.resumo ? <p className={styles.preview}>{post.resumo}</p> : null}

          {Array.isArray(post.palavrasChave) && post.palavrasChave.length ? (
            <div className={styles.tags}>
              {post.palavrasChave.slice(0, 12).map((k) => (
                <span key={k} className={styles.tag}>
                  {k}
                </span>
              ))}
            </div>
          ) : null}
        </header>

        {renderPostContent(post)}
      </article>
    )
  } else if (categoryPosts.length) {
    mainContent = (
      <section className={styles.wrapper}>
        <div className={styles.headerRow}>
          <h2 className={styles.title}>{slug}</h2>

          <div className={styles.count}>
            <span>{categoryPosts.length}</span>
          </div>
        </div>

        <ul className={styles.list}>
          {categoryPosts.map((p) => {
            const preview = getPreview(p)
            const postUrl = `/blog/${p.slug ?? p.id}`

            return (
              <li key={p.id} className={styles.card}>
                <div className={styles.cardTop}>
                  <div className={styles.cardTitleRow}>
                    <h3 className={styles.cardTitle}>
                      <a href={postUrl}>{p.titulo}</a>
                    </h3>
                  </div>

                  {preview ? <p className={styles.preview}>{preview}</p> : null}

                  {Array.isArray(p.palavrasChave) && p.palavrasChave.length ? (
                    <div className={styles.tags}>
                      {p.palavrasChave.slice(0, 10).map((k) => (
                        <span key={k} className={styles.tag}>
                          {k}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  <div style={{ marginTop: 10 }}>
                    <a href={postUrl}>Ler post</a>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </section>
    )
  } else {
    mainContent = (
      <section className={styles.wrapper}>
        <h2 className={styles.title}>Post ou categoria não encontrados</h2>
        <p className={styles.empty}>
          Não encontrei um post com slug <code>{slug}</code> e também não achei
          uma categoria com esse nome.
        </p>
      </section>
    )
  }

  return (
    <div className={estilos.blogcontent}>
      <header>
        <Topo />
      </header>

      <main className={estilos.main}>
        <BannerTop />

        <div className={estilos.sectionContent}>
          <TituloHome />

          <div className={estilos.colunas}>
            {mainContent}
            <ColunaDireita />
          </div>
        </div>

        <div className={estilos.instagramBlog}>
          <InstagramBlog />
        </div>
      </main>

      <footer>
        <p>
          <Footer />
        </p>
      </footer>
    </div>
  )
}

export default BlogPostIdealine
