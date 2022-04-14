import Vuetify from 'vuetify'
import { mount } from '@vue/test-utils'
import localVue from '~/test/localVue'
import ListCard from '~/components/list/Card.vue'

describe('components/Card.vue', () => {
  let vuetify
  beforeEach(() => {
    vuetify = new Vuetify()
  })

  const list = { title: 'list title', id: 1, index: 0 }
  const mountCard = (optinos) => {
    return mount(ListCard, {
      localVue,
      vuetify,
      propsData: { list },
      ...optinos
    })
  }

  describe('template', () => {
    it('リストのタイトルが表示される', () => {
      const wrapper = mountCard()
      expect(wrapper.findComponent({ name: 'v-card-title' }).text()).toEqual(list.title)
    })
  })

  describe('script', () => {
    it('listpropsを受け取る', () => {
      const wrapper = mountCard()
      expect(wrapper.props().list).toEqual(list)
    })
  })
})
