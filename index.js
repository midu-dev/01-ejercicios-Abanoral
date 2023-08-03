const fs = require('node:fs/promises')
const path = require('node:path')

// Ejercicio 2
async function writeFile(filePath, data, callback) {
  try {
    await fs.writeFile(filePath, data) // Escribo en el archivo
    callback() // Llamo al callback
  } catch (error) {
    try {
      const directoryPath = path.dirname(filePath)
      await fs.mkdir(directoryPath, { recursive: true }) // Creo directorios anidados si es necesario
      await fs.writeFile(filePath, data) // Escribo en el archivo recién creado
      callback() // Llamo al callback
    } catch (error) {
      console.log(`Error durante la creación del directorio y fichero: ${error}`)
    }
  }
}

// Ejercicio 3
async function readFileAndCount(word, callback) {
  const filePath = process.argv[2]

  // Si no se especifica el path del archivo como argumento
  if (!filePath) {
    callback(new Error('No se ha especificado el path del archivo'))
    return
  }

  // Si el archivo no existe, debe devolver `0`
  try {
    await fs.stat(filePath) // status - información del archivo
  } catch (error) {
    callback(null, 0)
    return
  }

  // Si no se especifica la palabra a buscar
  if (typeof word !== 'string' || word.trim().length === 0) {
    callback(new Error('No se ha especificado la palabra a buscar'))
    return
  }

  try {
    const fileContent = await fs.readFile(filePath, 'utf-8')
    const wordRegex = new RegExp(`\\b${word}\\b`, 'gi')
    const count = (fileContent.match(wordRegex) || []).length
    callback(null, count)
  } catch (error) {
    callback(error)
  }
}

module.exports = {
  writeFile,
  readFileAndCount
}
