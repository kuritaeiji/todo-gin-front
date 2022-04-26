<template>
  <v-container fluid fill-height class="d-flex flex-nowrap align-start overflow-x-auto">
    <list-card
      v-for="list of lists"
      :key="`list-card-${list.id}`"
      :list="list"
      class="list-card"
      :data-list-id="list.id"
      @mousedown="mouseDown"
    >
      <card-create-form :list-id="list.id" />
    </list-card>
    <list-create-form />
  </v-container>
</template>

<script>
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'
import ListCard from '~/components/list/Card.vue'
import ListCreateForm from '~/components/list/CreateForm.vue'
import ListCardPlaceholder from '~/components/list/CardPlaceholder.vue'
import CardCreateForm from '~/components/card/CreateForm.vue'

const defaultDragParam = { id: null, index: null }
const startScrollPx = 100
const scrollSpeed = 10

export default {
  components: { ListCard, ListCreateForm, CardCreateForm },
  layout ({ app }) {
    return app.$auth.loggedIn ? 'default' : 'toppage'
  },
  middleware: ['getLists'],
  data () {
    return {
      dragging: false,
      draggingList: null,
      dragElement: '',
      element: '',
      elementRect: '',
      placeholder: '',
      isFirstMouseMove: false,
      initialPageX: 0,
      initialPageY: 0,
      moveX: 0,
      moveY: 0,
      dragParam: { ...defaultDragParam },
      headerHeight: 0,
      containerElement: ''
    }
  },
  head () {
    return {
      title: this.$t('page.index')
    }
  },
  computed: {
    ...mapGetters('list', ['lists', 'listIndexWithDestroy', 'listIndex']),
    dragElementCenterX () {
      return this.elementRect.left + this.moveX + (this.elementRect.width / 2)
    },
    dragElementCenterY () {
      return this.elementRect.top + this.moveY + (this.elementRect.height / 2)
    },
    isChangedDraggedListIndex () {
      return this.listIndex(this.draggingList.id) !== this.dragParam.index
    }
  },
  mounted () {
    this.headerHeight = document.getElementsByTagName('header')[0].clientHeight
    this.containerElement = document.getElementsByClassName('container')[0]
    window.addEventListener('mousemove', this.mouseMove)
    window.addEventListener('mouseup', this.mouseUp)
  },
  beforeDestroy () {
    window.removeEventListener('mousemove', this.mouseMove)
    window.removeEventListener('mouseup', this.mouseUp)
  },
  methods: {
    ...mapActions('list', ['moveList']),
    mouseDown (event, list) {
      this.dragging = true
      this.element = event.currentTarget
      this.elementRect = this.element.getBoundingClientRect()
      this.isFirstMouseMove = true
      this.initialPageX = event.pageX
      this.initialPageY = event.pageY
      this.dragParam.id = list.id
      this.draggingList = list
    },
    mouseMove (event) {
      if (this.dragging) {
        if (this.isFirstMouseMove) {
          this._setPlaceholder()
          this.containerElement.insertBefore(this.placeholder, this.element.nextSibling)
          this._setDragElement()
          this._makeElementInvisible()
          this.isFirstMouseMove = false
        }

        this._moveDragElement(event)

        this._scrollRight()
        this._scrollLeft()

        this._moveListTemplate()
      }
    },
    async mouseUp () {
      if (!this.dragging) {
        return
      }

      if (this.dragParam.id !== null && this.dragParam.index !== null && this.isChangedDraggedListIndex) {
        await this.moveList(this.dragParam)
      }

      this.dragging = false
      this.element.classList.add('d-flex')
      this.element.classList.remove('drag-element-none')
      this.placeholder.remove()
      this.dragElement.remove()
      this.dragParam = { ...defaultDragParam }
    },
    _setPlaceholder () {
      const Class = Vue.extend(ListCardPlaceholder)
      const instance = new Class({
        propsData: { height: this.elementRect.height }
      }).$mount()
      this.placeholder = instance.$el
    },
    _setDragElement () {
      this.dragElement = this.element.cloneNode(true)
      // 複製したノードはlist-cardを外す ドラッグしている要素以外を見つけ出す為
      this.dragElement.classList.remove('list-card')
      this.containerElement.appendChild(this.dragElement)
      this.dragElement.style.position = 'absolute'
      this.dragElement.style.zIndex = 100
      this.dragElement.style.top = this.elementRect.top + 'px'
      this.dragElement.style.left = this.elementRect.left + 'px'
    },
    _makeElementInvisible () {
      this.element.classList.remove('d-flex')
      this.element.classList.add('drag-element-none')
    },
    _moveDragElement (event) {
      // 最初の位置 + 動いた距離
      this.moveX = event.pageX - this.initialPageX
      this.moveY = event.pageY - this.initialPageY
      this.dragElement.style.left = this.elementRect.left + this.moveX + 'px'
      this.dragElement.style.top = this.elementRect.top + this.moveY - this.headerHeight + 'px'
    },
    _scrollRight () {
      const containerActualWidth = window.scrollX + this.containerElement.clientWidth
      const diffWidthRight = containerActualWidth - this.dragElementCenterX
      if (diffWidthRight < startScrollPx) {
        this.containerElement.scrollLeft += (startScrollPx - diffWidthRight) / scrollSpeed
      }
    },
    _scrollLeft () {
      const diffWidth = this.dragElementCenterX - window.scrollX
      if (diffWidth < startScrollPx) {
        this.containerElement.scrollLeft -= (startScrollPx - diffWidth) / scrollSpeed
      }
    },
    _moveListTemplate () {
      const lists = [...document.getElementsByClassName('list-card')].filter(list => !list.classList.contains('drag-element-none'))
      const self = this

      lists.forEach((list) => {
        const rect = list.getBoundingClientRect()
        const centerX = rect.left + (rect.width / 2)
        const offsetX = this.dragElementCenterX - centerX

        if (Math.abs(offsetX) < (self.elementRect.width / 2)) {
          self.placeholder.remove()
          self._setPlaceholder()

          const listID = Number(list.dataset.listId)
          if (offsetX < 0) {
            // 左から右入れ替えるリストの後にプレースホルダーを置く
            self.containerElement.insertBefore(self.placeholder, list.nextSibling)
            Vue.set(this.dragParam, 'index', this.listIndexWithDestroy(listID, this.dragParam.id) + 1)
          }
          if (offsetX > 0) {
            // 右から左に入れ替えるリストの後にプレースホルダーを置く
            self.containerElement.insertBefore(self.placeholder, list)
            Vue.set(this.dragParam, 'index', this.listIndexWithDestroy(listID, this.dragParam.id))
          }
        }
      })
    },
    _setDragParamIndex () {
      // containerの子要素のうち、placeholderのindexがlistの移動先になる。ただしdispay:noneの状態のリストは子要素から削除する
      this.dragParam.index = [...this.containerElement.children].filter(child => !child.classList.contains('drag-element-none')).findIndex(child => child.classList.contains('list-card-placeholder'))
    }
  }
}
</script>
