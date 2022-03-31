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
    it('app-bar-titleのタイトル', () => {
      const wrapper = mountAppBar()
      const titleCom = wrapper.findComponent({ name: 'v-app-bar-title' })
      expect(titleCom.text()).toMatch(/appTitle/)
    })

    it('app-barのボタン', () => {
      const wrapper = mountAppBar()
      const loginBtn = wrapper.findAllComponents({ name: 'v-btn' }).at(0)
      expect(loginBtn.text()).toMatch(/page.index/)
      const signupBtn = wrapper.findAllComponents({ name: 'v-btn' }).at(1)
      expect(signupBtn.text()).toMatch(/page.signup/)
    })

    it('app-barのボタンのrouter-link', () => {
      const wrapper = mountAppBar()
      const loginLink = wrapper.findAllComponents({ name: 'router-link-stub' }).at(0)
      expect(loginLink.props().to).toEqual('/')
      const signupLink = wrapper.findAllComponents({ name: 'router-link-stub' }).at(1)
      expect(signupLink.props().to).toEqual('/signup')
    })
  })
})
