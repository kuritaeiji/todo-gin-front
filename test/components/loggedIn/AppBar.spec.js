import Vuetify from 'vuetify'
import { mount } from '@vue/test-utils'
import localVue from '~/test/localVue'
import AppBar from '~/components/LoggedIn/AppBar.vue'

describe('component/LoggedInAppBar.vue', () => {
  let vuetify
  beforeEach(() => {
    vuetify = new Vuetify()
  })

  const mountAppBar = (options) => {
    return mount(AppBar, {
      localVue,
      vuetify,
      stubs: ['app-bar', 'ui-app-bar-btn'],
      ...options
    })
  }

  describe('template', () => {
    it('ログアウトボタン', () => {
      const mock = jest.fn()
      const wrapper = mountAppBar({
        methods: {
          logout: mock
        }
      })
      const logoutBtn = wrapper.findAll('ui-app-bar-btn-stub').at(0)
      expect(logoutBtn.text()).toEqual('btn.logout')
      logoutBtn.vm.$emit('click')
      expect(mock).toHaveBeenCalled()
    })

    it('退会ボタン', () => {
      const mock = jest.fn()
      const wrapper = mountAppBar({
        methods: {
          withdraw: mock
        }
      })
      const withdrawBtn = wrapper.findAll('ui-app-bar-btn-stub').at(1)
      expect(withdrawBtn.text()).toEqual('btn.withdraw')
      withdrawBtn.vm.$emit('click')
      expect(mock).toHaveBeenCalled()
    })
  })

  describe('script', () => {
    describe('methods', () => {
      it('logoutメソッド', () => {
        const mock = jest.fn()
        const wrapper = mountAppBar({
          mocks: {
            $auth: {
              logout: mock
            }
          }
        })
        wrapper.vm.logout()
        expect(mock).toHaveBeenCalledWith(wrapper.vm)
      })
    })
  })
})
