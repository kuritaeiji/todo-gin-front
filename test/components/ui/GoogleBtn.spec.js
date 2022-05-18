import Vuetify from 'vuetify'
import { mount } from '@vue/test-utils'
import localVue from '~/test/localVue'
import UiGoogleBtn from '~/components/ui/GoogleBtn.vue'

describe('components/ui/GoogleBtn.vue', () => {
  let vuetify
  let mock
  beforeEach(() => {
    vuetify = new Vuetify()
    mock = jest.fn()
  })
  const mountGoogleBtn = (options) => {
    return mount(UiGoogleBtn, {
      vuetify,
      localVue,
      ...options
    })
  }

  describe('template', () => {
    it('ボタンをクリックするとrequestAuthEndpointメソッドを呼び出す', () => {
      const wrapper = mountGoogleBtn({ methods: { requestAuthEndpoint: mock } })
      wrapper.findComponent({ name: 'v-btn' }).vm.$emit('click')
      expect(mock).toHaveBeenCalled()
    })
  })

  describe('script', () => {
    describe('props', () => {
      it('loginProps', async () => {
        const wrapper = mountGoogleBtn()
        expect(wrapper.props().login).toEqual(false)
        await wrapper.setProps({ login: true })
        expect(wrapper.props().login).toEqual(true)
      })
    })

    describe('computed', () => {
      describe('btnText', () => {
        it('loginPropsがtrueの時、「ログイン」文字列を返す', () => {
          expect(UiGoogleBtn.computed.btnText.call({ login: true })).toEqual('ログイン')
        })

        it('loginPropsがfalseの時、「会員登録」文字列を返す', () => {
          expect(UiGoogleBtn.computed.btnText.call({ login: false })).toEqual('会員登録')
        })
      })
    })

    describe('methods', () => {
      describe('requestAuthEndpoint', () => {
        it('apiと通信する', () => {
          const axiosMock = { $get: mock }
          const wrapper = mountGoogleBtn({ mocks: { $axios: axiosMock } })
          wrapper.vm.requestAuthEndpoint()
          expect(mock).toHaveBeenCalledWith('/google')
        })

        it('apiとの通信が成功する場合、apiから返されたurlにリダイレクトする', async () => {
          const url = 'https://google.api.com'
          const axiosStub = { $get: () => Promise.resolve({ url }) }
          delete window.location
          window.location = Object.defineProperties({}, { assign: { configurable: true, value: mock } })
          const wrapper = mountGoogleBtn({ mocks: { $axios: axiosStub } })
          await wrapper.vm.requestAuthEndpoint()
          expect(mock).toHaveBeenCalledWith(url)
        })

        it('apiとの通信が失敗する場合、$handler.standardAxiosError()メソッドを呼び出す', async () => {
          const error = 'error'
          const axiosStub = { $get: () => Promise.reject(error) }
          const handlerMock = { standardAxiosError: mock }
          const wrapper = mountGoogleBtn({ mocks: { $axios: axiosStub, $handler: handlerMock } })
          await wrapper.vm.requestAuthEndpoint()
          expect(mock).toHaveBeenCalledWith(error)
        })
      })
    })
  })
})
