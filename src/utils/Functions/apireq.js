const fs = require('fs')
const fetchUsers = async (json) => {
  try {
    const response = await fetch('https://randomuser.me/api/?results=101')
    const data = await response.json()

    json ? writeJson(data) : writeCsv(data)
  } catch (error) {
    console.error('Error fetching users:', error)
  }
}

const writeJson = (data) => {
  const usersData = data.results.map((info) => ({
    name: `${info.name.first} ${info.name.last}`,
    profilePicture: info.picture.large
  }))

  fs.writeFileSync('userData.json', JSON.stringify(usersData, null, 2))
  console.log('User profiles saved!')
}

const writeCsv = (data) => {
  const csvHeaders = 'name, profilePicture\n'
  const csvRows = data.results
    .map(
      (info) => `${info.name.first} ${info.name.last} ,${info.picture.large}`
    )
    .join('\n')
  const csvData = csvHeaders + csvRows

  fs.writeFileSync('usersData.csv', csvData)

  console.log('Archivo CSV creado: usersData.csv')
}

fetchUsers()
module.exports = fetchUsers
