const fs = require('fs')
const bcrypt = require('bcrypt')
const { setFlagsFromString } = require('v8')

const USERS = []
const SKILLREQUEST = []
const MESSAGES = []

const getDataFromCsv = (ARRAY, file) => {
  const data = fs.readFileSync(`src/data/csv/${file}.csv`, 'utf-8')
  const array = data.split('\r\n')
  const keys = array[0].split(',')
  for (let i = 0; i < keys.length; i++) {
    keys[i] = keys[i].replaceAll(' ', '')
    // keys[i] = keys[i].replaceAll('º', '')
    // keys[i] = keys[i].replaceAll('ó', 'o')
  }

  array.shift()

  array.forEach((element) => {
    let dataValues = element.match(
      /(".*?"|[^",]+|(?<=,|^)([^",]+|".*?")(?=,|$))/g
    )

    if (dataValues) {
      const objet = {}
      dataValues.forEach((value, i) => {
        value = value.replace(/^"|"$/g, '')

        if (keys[i] === 'password') {
          const encriptado = bcrypt.hashSync(value, 10)
          objet[keys[i]] = encriptado
        } else {
          objet[keys[i]] = value
        }
      })

      ARRAY.push(objet)
    }
  })
}

const saveToJsonFile = (ARRAY, file) => {
  fs.writeFileSync(`src/data/json/${file}.json`, JSON.stringify(ARRAY, null, 2))
  console.log(`${file}.json written successfully`)
}

// getDataFromCsv(USERS, 'users')
getDataFromCsv(SKILLREQUEST, 'skillRequest')
// getDataFromCsv(MESSAGES, 'messages')

// saveToJsonFile(USERS, 'users')
saveToJsonFile(SKILLREQUEST, 'skillRequest')
// saveToJsonFile(MESSAGES, 'messages')
