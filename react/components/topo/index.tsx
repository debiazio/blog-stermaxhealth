import React, { useEffect, useLayoutEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import estilos from "./Topo.modules.css"

type Item = { label: string; href: string }

const submenu: Item[] = [
  { label: "Todos os posts", href: "/blog" },
  { label: "Voltar para a loja", href: "https://www.stermaxhealth.com.br" },
  { label: "Biossegurança", href: "/blog/biosseguranca" },
]

const menu: Item[] = [
  { label: "BIOSSEGURANÇA", href: "/blog/biosseguranca" },
]

function isExternalLink(href: string) {
  return /^https?:\/\//i.test(href)
}

export default function Topo() {
  const homeRef = useRef<HTMLAnchorElement | null>(null)
  const dropdownRef = useRef<HTMLDivElement | null>(null)
  const drawerRef = useRef<HTMLDivElement | null>(null)

  // Desktop dropdown (HOME)
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [pos, setPos] = useState({ top: 0, left: 0, width: 260 })

  // Mobile drawer
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [mobileHomeOpen, setMobileHomeOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => setMounted(true), [])

  // detecta mobile por media query
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)")
    const apply = () => setIsMobile(mq.matches)
    apply()

    // @ts-ignore
    if (mq.addEventListener) mq.addEventListener("change", apply)
    else mq.addListener(apply)

    return () => {
      // @ts-ignore
      if (mq.removeEventListener) mq.removeEventListener("change", apply)
      else mq.removeListener(apply)
    }
  }, [])

  // trava scroll quando drawer abre
  useEffect(() => {
    if (!isMobile) return

    const prev = document.body.style.overflow
    if (drawerOpen) document.body.style.overflow = "hidden"

    return () => {
      document.body.style.overflow = prev
    }
  }, [drawerOpen, isMobile])

  // posição do dropdown (desktop)
  const updatePosition = () => {
    const el = homeRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    setPos({
      top: r.bottom + window.scrollY,
      left: r.left + window.scrollX,
      width: 260,
    })
  }

  useLayoutEffect(() => {
    if (!open || isMobile) return
    updatePosition()

    const onResize = () => updatePosition()
    const onScroll = () => updatePosition()

    window.addEventListener("resize", onResize)
    window.addEventListener("scroll", onScroll, true)

    return () => {
      window.removeEventListener("resize", onResize)
      window.removeEventListener("scroll", onScroll, true)
    }
  }, [open, isMobile])

  // fecha dropdown desktop ao clicar fora + ESC
  useEffect(() => {
    if (!open || isMobile) return

    const onDown = (e: MouseEvent) => {
      const target = e.target as Node
      if (homeRef.current?.contains(target)) return
      if (dropdownRef.current?.contains(target)) return
      setOpen(false)
    }

    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }

    document.addEventListener("mousedown", onDown)
    document.addEventListener("keydown", onEsc)
    return () => {
      document.removeEventListener("mousedown", onDown)
      document.removeEventListener("keydown", onEsc)
    }
  }, [open, isMobile])

  // fecha drawer mobile ao clicar fora + ESC
  useEffect(() => {
    if (!drawerOpen || !isMobile) return

    const onDown = (e: MouseEvent) => {
      const target = e.target as Node
      if (drawerRef.current?.contains(target)) return
      setDrawerOpen(false)
      setMobileHomeOpen(false)
    }

    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDrawerOpen(false)
        setMobileHomeOpen(false)
      }
    }

    document.addEventListener("mousedown", onDown)
    document.addEventListener("keydown", onEsc)
    return () => {
      document.removeEventListener("mousedown", onDown)
      document.removeEventListener("keydown", onEsc)
    }
  }, [drawerOpen, isMobile])

  const closeDrawer = () => {
    setDrawerOpen(false)
    setMobileHomeOpen(false)
  }

  return (
    <header className={estilos.header}>
      <nav className={estilos.nav}>
        <button
          type="button"
          className={estilos.hamburger}
          aria-label="Abrir menu"
          aria-expanded={drawerOpen}
          onClick={() => setDrawerOpen(true)}
        >
          <span className={estilos.hamburgerBar} />
          <span className={estilos.hamburgerBar} />
          <span className={estilos.hamburgerBar} />
        </button>

        <ul className={estilos.menu}>
          <li className={estilos.item}>
            <a
              ref={homeRef}
              className={estilos.linkHome}
              href="/blog"
              onMouseEnter={() => !isMobile && setOpen(true)}
              onMouseLeave={() => {
                if (isMobile) return
                setTimeout(() => {
                  const drop = dropdownRef.current
                  if (drop && drop.matches(":hover")) return
                  setOpen(false)
                }, 120)
              }}
              onClick={() => {
                if (!isMobile) {
                  setOpen((v) => !v)
                }
              }}
            >
              HOME <span className={estilos.chevron}>▾</span>
            </a>
          </li>

          {menu.map((item) => (
            <li key={item.href} className={estilos.item}>
              <a className={estilos.link} href={item.href}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {mounted && open && !isMobile &&
        createPortal(
          <div
            ref={dropdownRef}
            className={estilos.dropdown}
            style={
              {
                ["--dd-top" as any]: `${pos.top}px`,
                ["--dd-left" as any]: `${pos.left}px`,
                ["--dd-width" as any]: `${pos.width}px`,
              } as React.CSSProperties
            }
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
          >
            {submenu.map((it) => (
              <a
                key={it.href}
                className={estilos.dropdownLink}
                href={it.href}
                {...(isExternalLink(it.href)
                  ? { target: "_blank", rel: "noreferrer" }
                  : {})}
              >
                {it.label}
              </a>
            ))}
          </div>,
          document.body
        )
      }

      {mounted && drawerOpen && isMobile &&
        createPortal(
          <div className={estilos.drawerOverlay}>
            <div className={estilos.drawer} ref={drawerRef}>
              <div className={estilos.drawerHeader}>
                <button
                  type="button"
                  className={estilos.drawerClose}
                  aria-label="Fechar menu"
                  onClick={closeDrawer}
                >
                  ✕
                </button>
              </div>

              <div className={estilos.drawerContent}>
                <button
                  type="button"
                  className={estilos.drawerItemButton}
                  aria-expanded={mobileHomeOpen}
                  onClick={() => setMobileHomeOpen((v) => !v)}
                >
                  HOME <span className={estilos.chevron}>▾</span>
                </button>

                {mobileHomeOpen && (
                  <div className={estilos.drawerSubmenu}>
                    {submenu.map((it) => (
                      <a
                        key={it.href}
                        className={estilos.drawerSubLink}
                        href={it.href}
                        onClick={closeDrawer}
                        {...(isExternalLink(it.href)
                          ? { target: "_blank", rel: "noreferrer" }
                          : {})}
                      >
                        {it.label}
                      </a>
                    ))}
                  </div>
                )}

                {menu.map((it) => (
                  <a
                    key={it.href}
                    className={estilos.drawerLink}
                    href={it.href}
                    onClick={closeDrawer}
                  >
                    {it.label}
                  </a>
                ))}
              </div>
            </div>
          </div>,
          document.body
        )
      }
    </header>
  )
}
