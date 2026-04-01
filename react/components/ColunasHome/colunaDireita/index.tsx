import { useMemo, useState } from 'react'
import estilos from './ColunaDireita.modules.css'
import postsData from '../../../data'


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

function buildSearchIndex(post: Post): string {
  const parts: string[] = []

  parts.push(post.titulo)
  if (post.resumo) parts.push(post.resumo)
  if (post.categoria) parts.push(post.categoria)

  if (Array.isArray(post.palavrasChave)) {
    parts.push(post.palavrasChave.join(' '))
  }

  if (Array.isArray(post.conteudo)) {
    for (const item of post.conteudo) {
      const tipo = String((item as any)?.tipo ?? '')
      parts.push(tipo)

      if (tipo === 'paragrafo' || tipo === 'subtitulo') {
        parts.push(String((item as any)?.texto ?? ''))
      } else if (tipo === 'lista') {
        const itens = (item as any)?.itens
        if (Array.isArray(itens)) {
          parts.push(itens.map(String).join(' '))
        }
      } else if (tipo === 'link') {
        parts.push(String((item as any)?.texto ?? ''))
      }
    }
  }

  return normalizeText(parts.filter(Boolean).join(' '))
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

function formatDate(date?: string): string {
  if (!date) return ''

  const parsed = new Date(date)
  if (Number.isNaN(parsed.getTime())) return ''

  return parsed.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

type PostListCardProps = {
  post: Post
  estilos: Record<string, string>
}

function PostListCard({ post, estilos }: PostListCardProps) {
  const image = getMainImage(post)
  const postUrl = `/blog/${post.slug ?? post.id}`
  const formattedDate = formatDate(post.dataPublicacao)

  return (
    <a href={postUrl} className={estilos.postListCard}>
      {image ? (
        <img
          src={image.url}
          alt={image.alt || post.titulo}
          className={estilos.postListImage}
        />
      ) : (
        <div className={estilos.postListImageFallback} />
      )}

      <div className={estilos.postListContent}>
        <h3 className={estilos.postListTitle}>{post.titulo}</h3>
        {formattedDate ? (
          <p className={estilos.postListDate}>{formattedDate}</p>
        ) : null}
      </div>
    </a>
  )
}

export default function ColunaDireita() {
  const [query, setQuery] = useState('')

  const posts = useMemo(() => coercePosts(postsData as unknown), [])

  const searchResults = useMemo(() => {
    const normalizedQuery = normalizeText(query.trim())

    if (!normalizedQuery) return []

    const tokens = normalizedQuery.split(/\s+/).filter(Boolean)
    if (!tokens.length) return []

    return posts
      .map((post) => ({
        post,
        index: buildSearchIndex(post),
      }))
      .filter(({ index }) => tokens.every((token) => index.includes(token)))
      .map(({ post }) => post)
      .slice(0, 6)
  }, [posts, query])

  const recentPosts = useMemo(() => {
    return [...posts]
      .sort((a, b) => getDateValue(b) - getDateValue(a))
      .slice(0, 3)
  }, [posts])

  const trendPosts = useMemo(() => {
    return [...posts]
      .filter((post) => post.tendencia === true)
      .sort((a, b) => {
        const aPriority =
          typeof a.prioridadeTendencia === 'number'
            ? a.prioridadeTendencia
            : Number.MAX_SAFE_INTEGER
        const bPriority =
          typeof b.prioridadeTendencia === 'number'
            ? b.prioridadeTendencia
            : Number.MAX_SAFE_INTEGER

        if (aPriority !== bPriority) return aPriority - bPriority

        return getDateValue(b) - getDateValue(a)
      })
      .slice(0, 3)
  }, [posts])

  return (
    <div className={estilos.colunaDireita}>
      <img
        className={estilos.imagemColunaDireita}
        src="https://stermaxhealth.vtexassets.com/assets/vtex.file-manager-graphql/images/d5930914-b61f-40eb-8e50-644b8be03154___345859cb181f89d1a485dc00d654a1af.png"
        alt="Imagem StermaxHealth"
        loading="eager"
      />

      <div className={estilos.textoColunaDireita}>
      <p>
        O <strong>blog Stermax Health</strong> é um canal de conteúdo voltado a
        <strong> consultórios, clínicas e profissionais da saúde</strong>, com foco
        em <strong>biossegurança</strong>, boas práticas e informações relevantes
        para a rotina de atendimento.
      </p>

      <p>
        Aqui, você encontra conteúdos sobre protocolos, orientações e tendências
        que contribuem para a realização de procedimentos com mais segurança,
        responsabilidade e conformidade com os padrões exigidos no ambiente clínico.
      </p>

      <p>
        Nosso objetivo é apoiar profissionais que valorizam excelência,
        credibilidade e cuidado em cada etapa do atendimento, promovendo saúde,
        confiança e segurança no dia a dia do consultório.
      </p>
    </div>

      <div className={estilos.campoPesquisa}>
        <div className={estilos.searchBox}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pesquisar posts"
            className={estilos.searchInput}
          />

          <div className={estilos.searchActions}>
            {query ? (
              <button
                type="button"
                className={estilos.clearButton}
                onClick={() => setQuery('')}
                aria-label="Limpar pesquisa"
              >
                ×
              </button>
            ) : null}

           <span className={estilos.searchIcon} aria-hidden="true">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                cx="11"
                cy="11"
                r="7"
                stroke="#6e6e6e"
                strokeWidth="2"
              />
              <path
                d="M20 20L16.65 16.65"
                stroke="#3f3f3f"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </span>
          </div>
        </div>

        {query.trim() ? (
          <div className={estilos.searchResults}>
            {searchResults.length ? (
              searchResults.map((post) => {
                const image = getMainImage(post)
                const preview = truncateText(getPreview(post), 90)
                const postUrl = `/blog/${post.slug ?? post.id}`

                return (
                  <a
                    key={post.id}
                    href={postUrl}
                    className={estilos.searchResultCard}
                  >
                    {image ? (
                      <img
                        src={image.url}
                        alt={image.alt || post.titulo}
                        className={estilos.searchResultImage}
                      />
                    ) : (
                      <div className={estilos.searchResultImageFallback} />
                    )}

                    <div className={estilos.searchResultContent}>
                      <h3 className={estilos.searchResultTitle}>{post.titulo}</h3>
                      {preview ? (
                        <p className={estilos.searchResultExcerpt}>{preview}</p>
                      ) : null}
                    </div>
                  </a>
                )
              })
            ) : (
              <div className={estilos.searchEmpty}>
                Nenhum post encontrado para “{query}”.
              </div>
            )}
          </div>
        ) : null}
      </div>

      <div className={estilos.postsRecentesTendencia}>
        <h2>POSTAGENS RECENTES</h2>
        <div className={estilos.postList}>
          {recentPosts.map((post) => (
            <PostListCard key={post.id} post={post} estilos={estilos} />
          ))}
        </div>

        <h2>POSTS TENDÊNCIA</h2>
        <div className={estilos.postList}>
          {trendPosts.map((post) => (
            <PostListCard key={`trend-${post.id}`} post={post} estilos={estilos} />
          ))}
        </div>
      </div>
    </div>
  )
}
