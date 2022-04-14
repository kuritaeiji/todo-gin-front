import Vuetify from 'vuetify'
import { mount } from '@vue/test-utils'
import { Store } from 'vuex'
import index from '~/pages/index.vue'
import localVue from '~/test/localVue'

describe('pages/index.vue', () => {
  let vuetify
  beforeEach(() => {
    vuetify = new Vuetify()
  })

  const defaultLists = [{ id: 1, title: 'list1', index: 0 }, { id: 2, title: 'list2', index: 1 }]
  const store = new Store({
    modules: {
      list: {
        namespaced: true,
        getters: {
          lists: () => defaultLists
        }
      }
    }
  })

  const mountIndex = (options) => {
    return mount(index, {
      localVue,
      vuetify,
      store,
      ...options
    })
  }

  describe('template', () => {
    it('リストを一覧表示する', () => {
      const wrapper = mountIndex()
      const vCardTitles = wrapper.findAllComponents({ name: 'v-card-title' })
      expect(vCardTitles.length).toEqual(2)

      const listTitle1 = vCardTitles.at(0)
      expect(listTitle1.text()).toEqual(defaultLists[0].title)
      const listTitle2 = vCardTitles.at(1)
      expect(listTitle2.text()).toEqual(defaultLists[1].title)
    })
  })

  describe('script', () => {
    it('title', () => {
      const wrapper = mountIndex()
      expect(wrapper.vm.$metaInfo.title).toEqual('page.index')
    })
  })
})
