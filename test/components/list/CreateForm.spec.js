import Vue from 'vue'
import Vuetify from 'vuetify'
import { Store } from 'vuex'
import { mount } from '@vue/test-utils'
import localVue from '~/test/localVue'
import ListCreateForm from '~/components/list/CreateForm.vue'
import ListForm from '~/components/list/Form.vue'

describe('components/ListCreateForm.vue', () => {
  let vuetify
  let mock
  beforeEach(() => {
    vuetify = new Vuetify()
    mock = jest.fn()
  })

  const stubs = {
    'list-form': true
  }

  const mountForm = (options) => {
    return mount(ListCreateForm, {
      vuetify,
      localVue,
      ...options
    })
  }

  describe('template', () => {
    it('リストを追加ボタンの表示・非表示', async () => {
      const wrapper = mountForm({ stubs })
      const addListBtn = wrapper.findAllComponents({ name: 'v-btn' }).at(0)
      await wrapper.setData({ isShow: true })
      expect(addListBtn.isVisible()).toEqual(false)
      await wrapper.setData({ isShow: false })
      expect(addListBtn.isVisible()).toEqual(true)
    })

    it('リスト追加ボタンをクリックするとopenFormメソッドが呼び出される', () => {
      const wrapper = mountForm({ stubs, methods: { openForm: mock } })
      const addListBtn = wrapper.findAllComponents({ name: 'v-btn' }).at(0)
      addListBtn.vm.$emit('click')
      expect(mock).toHaveBeenCalled()
    })

    it('フォームの表示・非表示', async () => {
      const wrapper = mountForm({ stubs })
      const form = wrapper.findComponent({ name: 'v-card' })
      await wrapper.setData({ isShow: true })
      expect(form.isVisible()).toEqual(true)
      await wrapper.setData({ isShow: false })
      expect(form.isVisible()).toEqual(false)
    })

    describe('list-form', () => {
      it('propsとしてtitleを渡す', async () => {
        const newList = { title: 'title' }
        const wrapper = mountForm()
        await wrapper.setData({ newList })
        expect(wrapper.findComponent(ListForm).props().title).toEqual(newList.title)
      })

      it('update:titleがemitされるとnewListのtitleが更新される', () => {
        const wrapper = mountForm()
        const title = 'title'
        wrapper.findComponent(ListForm).vm.$emit('update:title', title)
        expect(wrapper.vm.$data.newList.title).toEqual(title)
      })

      it('submitがemitされるとcreateListTemplateメソッドが呼び出される', () => {
        const wrapper = mountForm({ methods: { createListTemplate: mock } })
        wrapper.findComponent(ListForm).vm.$emit('submit')
        expect(mock).toHaveBeenCalled()
      })
    })

    it('フォームのリストを追加ボタンをクリックするとcreateListTemplateが呼び出される', () => {
      const wrapper = mountForm({ stubs, methods: { createListTemplate: mock } })
      wrapper.findAllComponents({ name: 'v-btn' }).at(1).vm.$emit('click')
      expect(mock).toHaveBeenCalled()
    })

    it('バツボタンをクリックするとcloseFormメソッドが呼び出される', () => {
      const wrapper = mountForm({ stubs, methods: { closeForm: mock } })
      wrapper.findAllComponents({ name: 'v-btn' }).at(2).vm.$emit('click')
      expect(mock).toHaveBeenCalled()
    })
  })

  describe('script', () => {
    describe('methods', () => {
      it('openForm', () => {
        const wrapper = mountForm({ stubs })
        wrapper.vm.openForm()
        expect(wrapper.vm.$data.isShow).toEqual(true)
      })

      it('closeForm', async () => {
        const wrapper = mountForm({ stubs })
        await wrapper.setData({ isShow: true })
        wrapper.vm.closeForm()
        expect(wrapper.vm.$data.isShow).toEqual(false)
      })

      describe('createListTemplate', () => {
        const store = (action) => {
          return new Store({
            modules: {
              list: {
                namespaced: true,
                actions: {
                  createList: action
                }
              }
            }
          })
        }

        const form = (validationResult) => {
          return Vue.component('VForm', {
            methods: {
              validate () {
                return validationResult
              }
            },
            template: '<div />'
          })
        }

        describe('フォームのバリデーションがfalseの場合', () => {
          it('createListメソッドが呼び出されない', () => {
            const wrapper = mountForm({ stubs: { 'v-form': form(false) }, store: store(mock) })
            wrapper.vm.createListTemplate()
            expect(mock).not.toHaveBeenCalled()
          })
        })

        describe('フォームのバリデーションがtrueの場合', () => {
          it('createListアクションを呼び出す', () => {
            const wrapper = mountForm({ stubs: { 'v-form': form(true) }, store: store(mock) })
            wrapper.vm.createListTemplate()
            expect(mock).toHaveBeenCalled()
          })

          it('createListでエラーが返る場合$handler.standardAxiosErrorを呼び出す', async () => {
            const error = 'error'
            const createList = () => { return Promise.reject(error) }
            const wrapper = mountForm({
              stubs: { ...stubs, 'v-form': form(true) },
              store: store(createList),
              mocks: {
                $handler: { standardAxiosError: mock }
              }
            })
            await wrapper.vm.createListTemplate()
            expect(mock).toHaveBeenCalledWith(error)
          })
        })
      })
    })
  })
})
