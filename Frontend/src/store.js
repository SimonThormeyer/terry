import create from 'zustand'

const [useStore,] = create((set, get) => {

  return {
    loadingProject: false,
    appRef: undefined,

    functions: {
      dotHasLoaded() {
        set({ loadingProject: false })
      },
      startLoading() {
        set({ loadingProject: true })
      },
      setAppRef(appRef) {
        set({ appRef: appRef })
      },
      
    }
  }
})

export default useStore