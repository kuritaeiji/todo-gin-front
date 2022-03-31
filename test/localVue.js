import VueMeta from 'vue-meta'
import { createLocalVue } from '@vue/test-utils'

const localVue = createLocalVue()
localVue.use(VueMeta, { keyName: 'head' })
export default localVue
