import React, {useState} from 'react'
import ChatPage from './components/ChatPage'
import './App.css'
import './style-sbl.css'

function App() {
  const [currentView, setCurrentView] = useState('sbl')

  return (
    <div className="app">
      <>
        <div className="app-header">
          <div className="container">
            <div className="Header_row__kGP0D">
              <button className="Header_detailMobButton__nHEDv">
                <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" className="MlchtUI-Icon"
                     data-testid="icon-arrow-left-long">
                  <path
                    d="M4.293 11.707a1 1 0 0 0 1.414-1.414L4.414 9H14a1 1 0 1 0 0-2H4.414l1.293-1.293a1 1 0 0 0-1.414-1.414l-3 3-.01.01a.997.997 0 0 0 .01 1.405l3 3Z"></path>
                </svg>
              </button>
              <a data-testid="header_logo" href="/">
                <img
                  src="/img/sber_logo_white.svg"
                  alt="Сбер"
                  className="logo"
                  width="192"
                />
              </a>
              <div className="Header_functionality__OkA4v">
                <nav className="Header_navbar__4DfEY"><span className="" data-testid="menu_button">Меню<svg width="16"
                                                                                                            height="16"
                                                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                                                            className="Header_btnMenuChevron__OXR2_"><path
                  fill-rule="evenodd" clip-rule="evenodd"
                  d="M11.707 6.293a1 1 0 0 1 0 1.414l-3 3a1 1 0 0 1-1.414 0l-3-3a1 1 0 0 1 1.414-1.414L8 8.586l2.293-2.293a1 1 0 0 1 1.414 0Z"></path></svg></span><a
                  className="Header_navItem__OxyFO" data-testid="news_link" href="/news">Новости</a><a
                  className="Header_navItem__OxyFO" data-testid="fest_link" href="/SBFest">Бизнес-Фест</a></nav>
                <div className="Header_buttons__bZZTa">
                  <button data-testid="search_button" type="button"
                          className="MlchtUI-Button MlchtUI-Button_contextTheme_light MlchtUI-Button_theme_secondary MlchtUI-Button_size_small MlchtUI-Button_iconOnly Header_search__YZpmN"
                          aria-disabled="false"><span className="MlchtUI-Button__Fill"></span><span
                    className="MlchtUI-Button__Icon MlchtUI-Button__Icon_Position_Left"><svg width="16" height="16"
                                                                                             xmlns="http://www.w3.org/2000/svg"><path
                    fill-rule="evenodd" clip-rule="evenodd"
                    d="M7 0a7 7 0 1 0 4.192 12.606l3.1 3.101a1 1 0 0 0 1.415-1.414l-3.1-3.1A7 7 0 0 0 7 0ZM2 7a5 5 0 1 1 10 0A5 5 0 0 1 2 7Z"></path></svg></span>
                  </button>
                  <a data-testid="login_button"
                     href="https://id.sber.ru/CSAFront/oidc/authorize.do?response_type=code&amp;client_type=PRIVATE&amp;scope=openid+name+email+mobile&amp;state=3529ac29f559494c868b70a5b7011e8e&amp;client_id=deef02ec-88ff-45be-8a10-d787ff8bf981&amp;redirect_uri=https%3A%2F%2Fsberbusiness.live%2Faccount&amp;nonce=b01fd1eb7b474c3984be13896fa458c3&amp;channel=browser&amp;isCloud=true&amp;logUid=39374001918f4150952373aa94e783d7"
                     className="MlchtUI-Button MlchtUI-Button_contextTheme_light MlchtUI-Button_theme_secondary MlchtUI-Button_size_small MlchtUI-Button_labelIcon Header_user__iTfuV Header_userColored__WGnYe"
                     aria-disabled="false"><span className="MlchtUI-Button__Fill"></span><span
                    className="MlchtUI-Button__Icon MlchtUI-Button__Icon_Position_Left"><svg width="16" height="16"
                                                                                             xmlns="http://www.w3.org/2000/svg"
                                                                                             className="MlchtUI-Icon"
                                                                                             data-testid="icon-userpik"><path
                    fill-rule="evenodd" clip-rule="evenodd"
                    d="M5 6a3 3 0 1 1 6 0 3 3 0 0 1-6 0Zm3 1a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"></path><path
                    fill-rule="evenodd" clip-rule="evenodd"
                    d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0ZM2 8a6 6 0 1 1 10.301 4.183A4.831 4.831 0 0 0 8.261 10H7.74a4.831 4.831 0 0 0-4.041 2.183A5.98 5.98 0 0 1 2 8Zm6.26 4c1.013 0 1.922.537 2.424 1.368A5.975 5.975 0 0 1 8 14a5.975 5.975 0 0 1-2.684-.632A2.831 2.831 0 0 1 7.74 12h.52Z"></path></svg></span><span
                    className="MlchtUI-Button__Label MlchtUI-Button__Label_size_small">Войти</span></a><a
                  data-testid="become-author_button" href="https://sberbusiness.live/become-author"
                  className="MlchtUI-Button MlchtUI-Button_contextTheme_light MlchtUI-Button_theme_primary MlchtUI-Button_size_small MlchtUI-Button_labelIcon"
                  aria-disabled="false"><span className="MlchtUI-Button__Fill"></span><span
                  className="MlchtUI-Button__Label MlchtUI-Button__Label_size_small">Стать героем</span><span
                  className="MlchtUI-Button__Icon MlchtUI-Button__Icon_Position_Right"><svg
                  xmlns="http://www.w3.org/2000/svg" width="16" height="16"><defs><clipPath id="pen_svg__a"><path
                  fill="#fff" fill-opacity="0" d="M0 0h16v16H0z"></path></clipPath></defs><g
                  clip-path="url(#pen_svg__a)"><path
                  fill="#fff" fill-rule="evenodd"
                  d="M2.83 1.83a2.843 2.843 0 0 0 0 4.02L10 13.02l3.98-.04.04-3.98-7.17-7.17a2.843 2.843 0 0 0-4.02 0m1.41 2.61a.85.85 0 0 1 0-1.2c.33-.33.87-.33 1.2 0l6.57 6.58L12 11l-1.18.01zM3 14c-.56 0-1 .44-1 1 0 .55.44 1 1 1h11v-2z"></path></g></svg></span></a>
                </div>
              </div>
              <div className="Header_detailMobButton__nHEDv"></div>
            </div>
          </div>
        </div>
        <img src="/sbl.png" alt="SBL"
             className="sbl-image-fake"
             style={{
               opacity: currentView === 'sbl' ? 1 : 0,
               pointerEvents: currentView === 'sbl' ? 'auto' : 'none',
             }}

             onClick={() => setCurrentView('chat')}/>
        {currentView === 'chat' &&

          <main className="app-main">
            <div className="container">
              <ChatPage/>
            </div>
          </main>}
      </>
    </div>
  )

}

export default App