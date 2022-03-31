import Vuetify from 'vuetify'
import { mount } from '@vue/test-utils'
import page from '~/pages/index.vue'
import localVue from '~/test/localVue'

describe('index.vue', () => {
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  const mountPage = (callback) => {
    if (callback) { callback() }
    return mount(page, {
      localVue,
      vuetify
    })
  }

  describe('template', () => {
    describe('フォームの操作', () => {
      it('emailのデータが反映される', () => {
        const email = 'test email'
        const wrapper = mountPage()
        wrapper.find('input[type="email"]').setValue(email)
        expect(wrapper.vm.auth.email).toEqual(email)
      })

      it('passwordのデータが反映される', () => {
        const password = 'test password'
        const wrapper = mountPage()
        wrapper.find('input[type="password"]').setValue(password)
        expect(wrapper.vm.auth.password).toEqual(password)
      })

      it('ボタンクリックでログインメソッドが呼ばれる', () => {
        const mock = jest.fn()
        const wrapper = mountPage(() => {
          page.methods.login = mock
        })
        wrapper.find('.v-btn.primary').trigger('click')
        expect(mock).toHaveBeenCalled()
      })

      it('パスワードフィールドのアイコンをクリックするとtoggleIsShowPasswordが呼ばれる', () => {
        const mock = jest.fn()
        const wrapper = mountPage(() => {
          page.methods.toggleIsShowPassword = mock
        })
        const passField = wrapper.findAllComponents({ name: 'v-text-field' }).at(1)
        passField.vm.$emit('click:append')
        expect(mock).toHaveBeenCalled()
      })
    })
  })

  describe('script', () => {
    it('title', () => {
      const wrapper = mountPage()
      expect(wrapper.vm.$metaInfo.title).toEqual('page.index')
    })

    describe('computed', () => {
      it('passwordField', () => {
        const self = { isShowPassword: true }
        expect(page.computed.passwordField.call(self)).toEqual({ icon: 'mdi-eye', type: 'text' })
        self.isShowPassword = false
        expect(page.computed.passwordField.call(self)).toEqual({ icon: 'mdi-eye-off', type: 'password' })
      })
    })
  })
})
