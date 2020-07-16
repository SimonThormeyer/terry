import create from 'zustand'

const [useStore, ] = create((set, get) => {

  return {
    loadingProject: false,

    functions: {
      dotHasLoaded() {
        set({loadingProject: false})
      },
      startLoading() {
          set({loadingProject: true})
      }
    }
  }
})

export default useStore