class UploadAdapter {
  constructor(loader, axios) {
    this.loader = loader
    this.axios = axios
  }

  upload() {
    const config = {
      onUploadProgress: progressEvent => {
        this.loader.uploaded = progressEvent.loaded
        this.loader.uploadTotal = progressEvent.total
      }
    }
    const formData = new FormData()
    return this.loader.file.then(
      file =>
        new Promise((resolve, reject) => {
          formData.append('file', file)
          this.axios
            .post('/knowledge/tempFile', formData, config)
            .then(response => {
              resolve({
                default: response.data
              })
            })
            .catch(reject)
        })
    )
  }

  abort() {}
}

export default UploadAdapter
