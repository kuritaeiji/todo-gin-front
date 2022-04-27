import Vuetify from 'vuetify'
import { mount } from '@vue/test-utils'
import localVue from '~/test/localVue'
import CardCard from '~/components/card/Card.vue'

describe('components/Card.vue', () => {
  let vuetify
  // let mock
  beforeEach(() => {
    vuetify = new Vuetify()
    // mock = jest.fn()
  })

  const defaultCard = { id: 1, title: 'card1' }
  const mountCardCard = (options) => {
    return mount(CardCard, {
      vuetify,
      localVue,
      propsData: { card: defaultCard },
      ...options
    })
  }

  describe('template', () => {
    it('cardのtitleを表示する', () => {
      const wrapper = mountCardCard()
      expect(wrapper.findComponent({ name: 'v-card-title' }).text()).toEqual(defaultCard.title)
    })
  })

  describe('script', () => {
    it('cardPropsを受け取る', async () => {
      const wrapper = mountCardCard()
      const newCard = { id: 100, title: 'new card' }
      await wrapper.setProps({ card: newCard })
      expect(wrapper.props().card).toEqual(newCard)
    })
  })
})
