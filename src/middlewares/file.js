const multer = require('multer')
const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary')

const storage = (folderName) =>
  new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: folderName,
      allowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      transformation: [
        { width: 800, height: 800, crop: 'limit' }, // Ajusta las dimensiones de la imagen
        { quality: 'auto' }, // Usa la mejor calidad automáticamente
        { fetch_format: 'auto' } // Usa el mejor formato automáticamente, como WebP si el navegador lo permite
      ]
      // transformation: [
      //   { width: 300, height: 300, crop: 'thumb', gravity: 'face' }, // Miniatura centrada en la cara (ideal para perfiles)
      //   { quality: 'auto:low' }, // Baja calidad para miniaturas
      //   { fetch_format: 'auto' }
      // ]
    }
  })
const upload = (folderName) =>
  multer({
    storage: storage(folderName),
    limits: { fieldSize: 10 * 1024 * 1024 }
  })

module.exports = { upload }
