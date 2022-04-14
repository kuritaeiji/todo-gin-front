import Vuetify from 'vuetify'
import { mount } from '@vue/test-utils'
import { Store } from 'vuex'
import index from '~/pages/index.vue'
import localVue from '~/test/localVue'
import ListCard from '~/components/list/Card.vue'

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

  const stubs = {
    'list-card': true,
    'list-create-form': true
  }

  const mountIndex = (options) => {
    return mount(index, {
      localVue,
      vuetify,
      store,
      ...options
    })
  }

  describe('template', () => {
    it('リストカードにリストpropsを渡す', () => {
      const wrapper = mountIndex({ stubs: ['list-create-form'] })
      const listCards = wrapper.findAllComponents(ListCard)
      expect(listCards.length).toEqual(2)
      expect(listCards.at(0).props().list).toEqual(defaultLists[0])
      expect(listCards.at(1).props().list).toEqual(defaultLists[1])
    })
  })

  describe('script', () => {
    it('title', () => {
      const wrapper = mountIndex(stubs)
      expect(wrapper.vm.$metaInfo.title).toEqual('page.index')
    })
  })
})
