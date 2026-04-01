import React from 'react'
import Topo from './components/topo'
import BannerTop from './components/bannerTop'
import ColunaEsquerda from './components/ColunasHome/colunaEsquerda'
import ColunaDireita from './components/ColunasHome/colunaDireita'
import TituloHome from './components/tituloHome'
import Footer from './components/footer'
import InstagramBlog from './components/Instagram'


import estilos from './styles/home.css'

import './styles/global.css'

const BlogContent: React.FC = () => {
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
            <ColunaEsquerda />
            <ColunaDireita />
          </div>
        </div>
        <div className={estilos.instagramBlog}>
          < InstagramBlog/>
        </div>

      </main>
      <footer>
        <p>
          <Footer/>
        </p>
      </footer>

    </div>
  )
}

export default BlogContent
