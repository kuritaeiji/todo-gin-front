import Vue from 'vue'
import Vuetify from 'vuetify'
import { Store } from 'vuex'
import { mount } from '@vue/test-utils'
import localVue from '~/test/localVue'
import ListCreateForm from '~/components/list/CreateForm.vue'
import ListForm from '~/components/list/Form.vue'
import ListCardCreateBtn from '~/components/ui/ListCardCreateBtn.vue'

describe('components/ListCreateForm.vue', () => {
  let vuetify
  let mock
  let actionMock
  beforeEach(() => {
    vuetify = new Vuetify()
    mock = jest.fn()
    actionMock = jest.fn()
  })

  const listsLength = () => 10
  const createStore = (createList) => {
    if (!createList) { createList = actionMock }
    return new Store({
      modules: {
        list: {
          namespaced: true,
          actions: {
            createList
          },
          getters: {
            listsLength
          }
        }
      }
    })
  }

  const stubs = {
    'list-form': true,
    'list-card-create-btn': true
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
      const wrapper = mountForm({ stubs, store: createStore() })
      const addListBtn = wrapper.findAllComponents({ name: 'v-btn' }).at(0)
      await wrapper.setData({ isShow: true })
      expect(addListBtn.isVisible()).toEqual(false)
      await wrapper.setData({ isShow: false })
      expect(addListBtn.isVisible()).toEqual(true)
    })

    it('リスト追加ボタンをクリックするとtoggleIsShowメソッドが呼び出される', () => {
      const wrapper = mountForm({ stubs, store: createStore(), methods: { toggleIsShow: mock } })
      const addListBtn = wrapper.findAllComponents({ name: 'v-btn' }).at(0)
      addListBtn.vm.$emit('click')
      expect(mock).toHaveBeenCalled()
    })

    it('フォームの表示・非表示', async () => {
      const wrapper = mountForm({ stubs, store: createStore() })
      const form = wrapper.findComponent({ name: 'v-card' })
      await wrapper.setData({ isShow: true })
      expect(form.isVisible()).toEqual(true)
      await wrapper.setData({ isShow: false })
      expect(form.isVisible()).toEqual(false)
    })

    describe('list-form', () => {
      it('propsとしてtitleを渡す', async () => {
        const newList = { title: 'title' }
        const wrapper = mountForm({ store: createStore() })
        await wrapper.setData({ newList })
        expect(wrapper.findComponent(ListForm).props().title).toEqual(newList.title)
      })

      it('update:titleがemitされるとnewListのtitleが更新される', () => {
        const wrapper = mountForm({ store: createStore() })
        const title = 'title'
        wrapper.findComponent(ListForm).vm.$emit('update:title', title)
        expect(wrapper.vm.$data.newList.title).toEqual(title)
      })

      it('submitがemitされるとcreateListTemplateメソッドが呼び出される', () => {
        const wrapper = mountForm({ store: createStore(), methods: { createListTemplate: mock } })
        wrapper.findComponent(ListForm).vm.$emit('submit')
        expect(mock).toHaveBeenCalled()
      })

      it('cancelがemitされるとcancelCreateListメソッドが呼び出される', () => {
        const wrapper = mountForm({ store: createStore(), methods: { cancelCreateList: mock } })
        wrapper.findComponent(ListForm).vm.$emit('cancel')
        expect(mock).toHaveBeenCalled()
      })
    })

    describe('list-card-create-btnコンポーネント', () => {
      it('createイベントが発火するとcreateListTemplateが呼び出される', () => {
        const wrapper = mountForm({ methods: { createListTemplate: mock }, store: createStore() })
        wrapper.findComponent(ListCardCreateBtn).vm.$emit('create')
        expect(mock).toHaveBeenCalled()
      })

      it('cencelイベントが発火するとcancelCreateListメソッドが呼び出される', () => {
        const wrapper = mountForm({ methods: { cancelCreateList: mock }, store: createStore() })
        wrapper.findComponent(ListCardCreateBtn).vm.$emit('cancel')
        expect(mock).toHaveBeenCalled()
      })
    })
  })

  describe('script', () => {
    describe('data', () => {
      it('newListデータのindexの初期値はstoreのlistsLengthでtitleはから文字列', () => {
        const wrapper = mountForm({ stubs, store: createStore() })
        expect(wrapper.vm.$data.newList).toEqual({ title: '', index: listsLength() })
      })
    })

    describe('computed', () => {
      it('listsLengthはstoreのgetterのlistsLength', () => {
        const wrapper = mountForm({ stubs, store: createStore() })
        expect(wrapper.vm.listsLength).toEqual(listsLength())
      })
    })

    describe('watch', () => {
      it('storeのlistsLengthが変わるとnewListデータのindexもそれに追随する', async () => {
        const wrapper = mountForm({
          stubs,
          store: createStore(),
          data () {
            return { listsLengthData: listsLength() }
          },
          computed: {
            listsLength: {
              get () {
                return this.listsLengthData
              },
              set (val) {
                this.listsLengthData = val
              }
            }
          }
        })
        const newListsLength = 1000
        await wrapper.setData({ listsLengthData: newListsLength })
        expect(wrapper.vm.$data.newList.index).toEqual(newListsLength)
      })
    })

    describe('methods', () => {
      it('toggleIsShow', async () => {
        const wrapper = mountForm({ stubs, store: createStore() })
        await wrapper.setData({ isShow: false })
        wrapper.vm.toggleIsShow()
        expect(wrapper.vm.$data.isShow).toEqual(true)
        wrapper.vm.toggleIsShow()
        expect(wrapper.vm.$data.isShow).toEqual(false)
      })

      describe('createListTemplate', () => {
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
            const wrapper = mountForm({ stubs: { 'v-form': form(false) }, store: createStore(mock) })
            wrapper.vm.createListTemplate()
            expect(mock).not.toHaveBeenCalled()
          })
        })

        describe('フォームのバリデーションがtrueの場合', () => {
          it('createListアクションを呼び出す', () => {
            const wrapper = mountForm({ stubs: { 'v-form': form(true) }, store: createStore(mock) })
            wrapper.vm.createListTemplate()
            expect(mock).toHaveBeenCalled()
          })

          it('createListアクションが正常に終了した場合、newListを初期化する', async () => {
            const createList = () => Promise.resolve()
            const wrapper = mountForm({ stubs: { 'v-form': form(true), ...stubs }, store: createStore(createList) })
            await wrapper.setData({ newList: { title: 'new title', index: 0 } })
            await wrapper.vm.createListTemplate()
            expect(wrapper.vm.$data.newList.title).toEqual('')
          })

          it('createListでエラーが返る場合$handler.standardAxiosErrorを呼び出す', async () => {
            const error = 'error'
            const createList = () => { return Promise.reject(error) }
            const wrapper = mountForm({
              stubs: { ...stubs, 'v-form': form(true) },
              store: createStore(createList),
              mocks: {
                $handler: { standardAxiosError: mock }
              }
            })
            await wrapper.vm.createListTemplate()
            expect(mock).toHaveBeenCalledWith(error)
          })
        })
      })

      describe('cancelCreateList', () => {
        it('newListデータを初期化する', async () => {
          const wrapper = mountForm({ stubs, store: createStore() })
          await wrapper.setData({ newList: { title: 'new title', index: 0 } })
          wrapper.vm.cancelCreateList()
          expect(wrapper.vm.$data.newList.title).toEqual('')
        })

        it('isShowをfalseにする', async () => {
          const wrapper = mountForm({ stubs, store: createStore() })
          await wrapper.setData({ isShow: true })
          wrapper.vm.cancelCreateList()
          expect(wrapper.vm.$data.isShow).toEqual(false)
        })
      })
    })
  })
})
