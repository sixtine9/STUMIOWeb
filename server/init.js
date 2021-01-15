const articles = require('./data/articles.js')
const { Client } = require('pg')

const client = new Client({
 user: 'postgres',
 host: 'localhost',
 password: 'maya1999',
 database: 'TP5'
})

client.connect()

async function run () {
  for (const article of articles) {
    await client.query({
      text: `INSERT INTO places(name, image, type, localisation, price)
      VALUES ($1, $2, $3, $4, $5)`,
      values: [article.name, article.image, article.type, article.localisation, article.price]
    })
  }
  console.log('importation terminée')
  client.end()
}

run()