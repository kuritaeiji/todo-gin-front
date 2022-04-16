<template>
  <v-container fluid class="d-flex flex-wrap">
    <list-card
      v-for="list of lists"
      :key="`list-card-${list.id}`"
      :list="list"
      class="list-card"
      :data-listid="list.id"
      @mousedown="mouseDown"
    />
    <list-create-form />
  </v-container>
</template>

<script>
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'
import ListCard from '~/components/list/Card.vue'
import ListCreateForm from '~/components/list/CreateForm.vue'
import ListCardPlaceholder from '~/components/list/CardPlaceholder.vue'

const defaultDragParam = { fromListID: null, toListID: null }

export default {
  components: { ListCard, ListCreateForm },
  layout ({ app }) {
    return app.$auth.loggedIn ? 'default' : 'toppage'
  },
  middleware: ['auth', 'getLists'],
  data () {
    return {
      dragging: false,
      dragElement: '',
      element: '',
      placeholder: '',
      elementLeft: 0,
      elementTop: 0,
      elementHeight: 0,
      elementWidth: 0,
      isFirstMouseMove: false,
      pageX: 0,
      pageY: 0,
      headerHeight: 0,
      containerNode: '',
      dragParam: { ...defaultDragParam }
    }
  },
  head () {
    return {
      title: this.$t('page.index')
    }
  },
  computed: {
    ...mapGetters('list', ['lists', 'listIndex'])
  },
  mounted () {
    this.headerHeight = document.getElementsByTagName('header')[0].getBoundingClientRect().height
    this.containerNode = document.getElementsByClassName('container')[0]
    window.addEventListener('mousemove', this.mouseMove)
    window.addEventListener('mouseup', this.mouseUp)

    // スクロールバー
    document.addEventListener('scroll', () => {
      const left = document.querySelector('.container.overflow-x-auto').scrollLeft
      document.querySelector('.scrollbar').scrollTo(left, 0)
    })
  },
  beforeDestroy () {
    window.removeEventListener('mousemove', this.mouseMove)
    window.removeEventListener('mouseup', this.mouseUp)
  },
  methods: {
    ...mapActions('list', ['replaceList']),
    mouseDown (event, list) {
      this.dragging = true
      this.element = event.target
      this.elementLeft = this.element.getBoundingClientRect().left
      this.elementTop = this.element.getBoundingClientRect().top
      this.elementHeight = this.element.getBoundingClientRect().height
      this.elementWidth = this.element.getBoundingClientRect().width
      this.isFirstMouseMove = true
      this.pageX = event.pageX
      this.pageY = event.pageY
      this.dragParam.fromListID = list.id
    },
    mouseMove (event) {
      if (this.dragging) {
        if (this.isFirstMouseMove) {
          const Class = Vue.extend(ListCardPlaceholder)
          const instance = new Class({
            propsData: { height: this.elementHeight }
          }).$mount()
          this.placeholder = instance.$el
          this.containerNode.insertBefore(this.placeholder, this.element.nextSibling)

          this.dragElement = this.element.cloneNode(true)
          this.element.classList.remove('d-flex')
          this.element.classList.add('drag-element-none')
          // 複製したノードはlist-cardを外す ドラッグしている要素以外を見つけ出す為
          this.dragElement.classList.remove('list-card')
          this.containerNode.appendChild(this.dragElement)
          this.dragElement.style.position = 'absolute'
          this.dragElement.style.zIndex = 100
          this.dragElement.style.height = 'auto'
          this.dragElement.style.top = this.elementTop + 'px'
          this.dragElement.style.left = this.elementLeft + 'px'

          this.isFirstMouseMove = false
        }

        const moveX = event.pageX - this.pageX
        const moveY = event.pageY - this.pageY
        this.dragElement.style.left = this.elementLeft + moveX + 'px'
        this.dragElement.style.top = this.elementTop + moveY - this.headerHeight + 'px'

        const dragElementCenterX = this.elementLeft + moveX + (this.elementWidth / 2)
        const dragElementCenterY = this.elementTop + moveY + (this.elementHeight / 2)

        const lists = [...document.getElementsByClassName('list-card')].filter(list => !list.classList.contains('drag-element-none'))

        const self = this
        lists.forEach((list) => {
          const rect = list.getBoundingClientRect()
          const centerX = rect.left + (rect.width / 2)
          const centerY = rect.top + (rect.height / 2)
          const offsetX = dragElementCenterX - centerX
          const offsetY = dragElementCenterY - centerY

          if (Math.abs(offsetX) < (self.elementWidth / 2) && Math.abs(offsetY) < (self.elementHeight / 2)) {
            self.placeholder.remove()
            const Class = Vue.extend(ListCardPlaceholder)
            const instance = new Class({
              propsData: { height: self.elementHeight }
            }).$mount()
            self.placeholder = instance.$el
            if (offsetY > 0) {
              // 下からの場合入れ替えるリストの前にプレースホルダーを置く
              self.containerNode.insertBefore(self.placeholder, list)
            } else {
              // 上からの場合入れ替えるリストの後にプレースホルダーを置く
              self.containerNode.insertBefore(self.placeholder, list.nextSibling)
            }
            self.dragParam.toListID = Number(list.dataset.listid)
          }
        })
      }
    },
    mouseUp () {
      if (this.dragParam.fromListID && this.dragParam.toListID) {
        this.replaceList(this.dragParam)
      }

      this.dragging = false
      this.element.classList.add('d-flex')
      this.element.classList.remove('drag-element-none')
      this.placeholder.remove()
      this.dragElement.remove()
      this.dragParam = { ...defaultDragParam }
    }
  }
}
</script>
