import Vuetify from 'vuetify'
import { mount } from '@vue/test-utils'
import page from '~/pages/index.vue'
import localVue from '~/test/localVue'

describe('index.vue', () => {
  let vuetify
  let mock

  beforeEach(() => {
    vuetify = new Vuetify()
    mock = jest.fn()
  })

  const mountPage = (options = {}) => {
    return mount(page, {
      localVue,
      vuetify,
      stubs: ['validation'],
      ...options
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

      describe('ログインメソッド', () => {
        let wrapper
        beforeEach(() => {
          wrapper = mountPage({
            methods: {
              login: mock
            }
          })
        })

        it('ボタンクリックすると発火', () => {
          wrapper.findComponent({ name: 'v-btn' }).vm.$emit('click')
          expect(mock).toHaveBeenCalled()
        })

        it('メールフォームでエンターキーを押すと発火', () => {
          wrapper.find('input[type="email"]').trigger('keyup.enter')
          expect(mock).toHaveBeenCalled()
        })

        it('パスワードフォームでエンターキーを押すと発火', () => {
          wrapper.find('input[type="password"]').trigger('keyup.enter')
          expect(mock).toHaveBeenCalled()
        })
      })

      it('パスワードフィールドのアイコンをクリックするとtoggleIsShowPasswordが呼ばれる', () => {
        const wrapper = mountPage({
          methods: {
            toggleIsShowPassword: mock
          }
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

    describe('methods', () => {
      it('login', () => {
        const $auth = { login: mock }
        const wrapper = mountPage({ mocks: { $auth } })
        wrapper.vm.login()

        expect(mock).toHaveBeenCalledWith(wrapper.vm.auth)
      })

      it('toggleIsShowPassword', () => {
        const wrapper = mountPage()
        wrapper.vm.toggleIsShowPassword()
        expect(wrapper.vm.isShowPassword).toEqual(true)
        wrapper.vm.toggleIsShowPassword()
        expect(wrapper.vm.isShowPassword).toEqual(false)
      })
    })
  })
})
