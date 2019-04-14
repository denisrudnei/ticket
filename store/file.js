export const state = () => ({
  files: [],
  filePreview: []
})

export const getters = {
  getFiles(state) {
    return state.files
  },
  getFilePreview(state) {
    return state.filePreview
  }
}

export const mutations = {
  setFiles(state, files) {
    state.files = files
  },
  setFilePreview(state, filePreview) {
    state.filePreview = filePreview
  },
  addFile(state, file) {
    state.files.push(file)
  },
  removeFile(state, file) {
    state.files = state.files.filter(f => {
      return f.name !== file.name
    })
  },
  addFilePreview(state, filePreview) {
    state.filePreview.push(filePreview)
  }
}
