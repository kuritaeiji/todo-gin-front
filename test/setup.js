import Vue from 'vue'
import Vuetify from 'vuetify'
import { config, RouterLinkStub } from '@vue/test-utils'

Vue.use(Vuetify)
const i18nMock = key => key
config.mocks.$t = i18nMock
config.stubs['router-link'] = RouterLinkStub
