import Vuetify from 'vuetify'
import { mount } from '@vue/test-utils'
import AppBar from '~/components/beforeLoggedIn/AppBar.vue'
import localVue from '~/test/localVue'

describe('components/AppBar.vue', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  const mountAppBar = (callback) => {
    if (callback) { callback() }
    return mount(AppBar, {
      localVue,
      vuetify
    })
  }

  describe('template', () => {
    it('v-toolbar-titleのタイトル', () => {
      const wrapper = mountAppBar()
      const titleCom = wrapper.findComponent({ name: 'v-toolbar-title' })
      expect(titleCom.text()).toMatch(/appTitle/)
    })

    it('v-tool-barのnuxt-linkのtoはindex', () => {
      const wrapper = mountAppBar()
      const titleLink = wrapper.findAllComponents({ name: 'router-link-stub' }).at(0)
      expect(titleLink.props().to).toEqual('/')
    })

    it('app-barのボタン', () => {
      const wrapper = mountAppBar()
      const loginBtn = wrapper.findAllComponents({ name: 'v-btn' }).at(0)
      expect(loginBtn.text()).toMatch(/page.login/)
      const signupBtn = wrapper.findAllComponents({ name: 'v-btn' }).at(1)
      expect(signupBtn.text()).toMatch(/page.signup/)
    })

    it('app-barのボタンのrouter-link', () => {
      const wrapper = mountAppBar()
      const loginLink = wrapper.findAllComponents({ name: 'router-link-stub' }).at(1)
      expect(loginLink.props().to).toEqual('/login')
      const signupLink = wrapper.findAllComponents({ name: 'router-link-stub' }).at(2)
      expect(signupLink.props().to).toEqual('/signup')
    })
  })
})
