export default async ({ store }) => {
  await store.dispatch('list/getLists')
}
