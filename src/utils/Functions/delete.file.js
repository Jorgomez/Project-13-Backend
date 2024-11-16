const cloudinary = require('cloudinary').v2

const deleteFile = (imgUrl) => {
  const imgSplited = imgUrl.split('/')
  const projetFolder = imgSplited.at(-3)
  const folderName = imgSplited.at(-2)
  const fieldName = imgSplited.at(-1).split('.')
  let public_id = `${projetFolder}/${folderName}/${fieldName[0]}`
  cloudinary.uploader.destroy(public_id, () => {
    console.log('img destroyed')
  })
}

module.exports = { deleteFile }
