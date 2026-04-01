import React, { useMemo, useState } from 'react'
import postsData from '../../data'
import styles from './postBrowser.modules.css'

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
  dataPublicacao?: string
  tendencia?: boolean
  prioridadeTendencia?: number
}

const POSTS_PER_PAGE = 7

function coercePosts(json: unknown): Post[] {
  if (!Array.isArray(json)) return []

  const out: Post[] = []

  for (let i = 0; i < json.length; i++) {
    const p = json[i] as Partial<Post> | null | undefined
    if (!p) continue

    const titulo = typeof p.titulo === 'string' ? p.titulo.trim() : ''
    if (!titulo) continue

    const id =
      typeof p.id === 'string' && p.id.trim() ? p.id.trim() : String(i + 1)

    out.push({
      id,
      slug: typeof p.slug === 'string' ? p.slug : undefined,
      categoria: typeof p.categoria === 'string' ? p.categoria : undefined,
      titulo,
      resumo: typeof p.resumo === 'string' ? p.resumo : undefined,
      palavrasChave: Array.isArray(p.palavrasChave)
        ? p.palavrasChave.filter((k): k is string => typeof k === 'string')
        : undefined,
      imagens: Array.isArray(p.imagens) ? (p.imagens as PostImagem[]) : undefined,
      conteudo: Array.isArray(p.conteudo)
        ? (p.conteudo as ConteudoItem[])
        : undefined,
      dataPublicacao:
        typeof p.dataPublicacao === 'string' ? p.dataPublicacao : undefined,
      tendencia: typeof p.tendencia === 'boolean' ? p.tendencia : false,
      prioridadeTendencia:
        typeof p.prioridadeTendencia === 'number'
          ? p.prioridadeTendencia
          : undefined,
    })
  }

  return out
}

function getPreview(post: Post): string {
  if (post.resumo) return post.resumo

  const firstParagraph = post.conteudo?.find(
    (item) =>
      (item as any)?.tipo === 'paragrafo' &&
      typeof (item as any)?.texto === 'string'
  ) as { texto?: string } | undefined

  return firstParagraph?.texto ? String(firstParagraph.texto) : ''
}

function getMainImage(post: Post): PostImagem | null {
  if (Array.isArray(post.imagens) && post.imagens.length) {
    return post.imagens[0]
  }

  const contentImage = post.conteudo?.find(
    (item) =>
      (item as any)?.tipo === 'imagem' &&
      typeof (item as any)?.url === 'string'
  ) as
    | {
        url?: string
        alt?: string
        legenda?: string
      }
    | undefined

  if (contentImage?.url) {
    return {
      url: String(contentImage.url),
      alt:
        typeof contentImage.alt === 'string'
          ? contentImage.alt
          : post.titulo,
      legenda:
        typeof contentImage.legenda === 'string'
          ? contentImage.legenda
          : undefined,
    }
  }

  return null
}

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength).trim()}...`
}

function getDateValue(post: Post): number {
  if (!post.dataPublicacao) return 0

  const parsed = new Date(post.dataPublicacao).getTime()
  return Number.isNaN(parsed) ? 0 : parsed
}

const PostsBrowser: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1)

  const orderedPosts = useMemo(() => {
    const posts = coercePosts(postsData as unknown)

    return [...posts].sort((a, b) => getDateValue(b) - getDateValue(a))
  }, [])

  const totalPages = Math.max(1, Math.ceil(orderedPosts.length / POSTS_PER_PAGE))

  const safeCurrentPage = Math.min(currentPage, totalPages)
  const startIndex = (safeCurrentPage - 1) * POSTS_PER_PAGE
  const endIndex = startIndex + POSTS_PER_PAGE

  const visiblePosts = orderedPosts.slice(startIndex, endIndex)

  if (!orderedPosts.length) {
    return (
      <section className={styles.wrapper}>
        <div className={styles.empty}>
          Nenhum post encontrado em <code>react/data/posts</code>.
        </div>
      </section>
    )
  }

  return (
    <section className={styles.wrapper}>
      <div className={styles.postsFeed}>
        {visiblePosts.map((post) => {
          const preview = truncateText(getPreview(post), 180)
          const image = getMainImage(post)
          const postUrl = `/blog/${post.slug ?? post.id}`

          return (
            <article key={post.id} className={styles.feedCard}>
              <div className={styles.feedMedia}>
                {image ? (
                  <a href={postUrl} className={styles.feedImageLink}>
                    <img
                      className={styles.feedImage}
                      src={image.url}
                      alt={image.alt || post.titulo}
                    />
                  </a>
                ) : null}

                {post.categoria ? (
                  <span className={styles.feedCategory}>{post.categoria}</span>
                ) : null}
              </div>

              <div className={styles.feedContent}>
                <h2 className={styles.feedTitle}>
                  <a href={postUrl} className={styles.feedTitleLink}>
                    {post.titulo}
                  </a>
                </h2>

                {preview ? (
                  <p className={styles.feedExcerpt}>{preview}</p>
                ) : null}

                <a href={postUrl} className={styles.feedReadMore}>
                  Ler mais
                </a>
              </div>
            </article>
          )
        })}
      </div>

      {totalPages > 1 ? (
        <div className={styles.pagination}>
          <button
            type="button"
            className={styles.paginationButton}
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            disabled={safeCurrentPage === 1}
          >
            Anterior
          </button>

          <div className={styles.paginationNumbers}>
            {Array.from({ length: totalPages }, (_, index) => {
              const page = index + 1
              const isActive = page === safeCurrentPage

              return (
                <button
                  key={page}
                  type="button"
                  className={`${styles.paginationNumber} ${isActive ? styles.paginationNumberActive : ''}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              )
            })}
          </div>

          <button
            type="button"
            className={styles.paginationButton}
            onClick={() =>
              setCurrentPage((page) => Math.min(totalPages, page + 1))
            }
            disabled={safeCurrentPage === totalPages}
          >
            Próxima
          </button>
        </div>
      ) : null}
    </section>
  )
}

export default PostsBrowser
