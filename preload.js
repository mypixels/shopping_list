window.addEventListener('DOMContentLoaded', () => {
  const options = {
    defaultPath: app.getPath('documents') + '/shopping_list.txt'
  }
  dialog.showSaveDialog(null, options, (path) => {
    console.log(path);
  })
})