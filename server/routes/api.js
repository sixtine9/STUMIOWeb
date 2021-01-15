const express = require('express')
const router = express.Router()
/*const articles = require('../data/articles.js')*/

class Panier {
  constructor () {
    this.createdAt = new Date()
    this.updatedAt = new Date()
    this.articles = []
  }
}

const bcrypt = require('bcrypt')
const { Client } = require('pg')

const client = new Client({
 user: 'postgres',
 host: 'localhost',
 password: 'maya1999',
 database: 'TP5'
})

client.connect()












/*Route POST permet de vérifier si un utilisateur avec cet email n’existe pas déjà dans la table users*/
/*router.post('/register', async (req, res) => {
  const email = (req.body.email)
  const password = (req.body.password)
 
    const sql = "SELECT * FROM users WHERE email=$1 AND password=$2"
    const result = await client.query({
      text: sql,
      values: [email, password] // ici name et description ne sont pas concaténées à notre requête
    })


    if (result.rows.length > 0){
      res.status(400).json({ 
        message: 'bad request' 
      })
      return 
    }

    const hash = await bcrypt.hash(password, 10)
    
    await client.query({
      text : "INSERT INTO users(email, password) VALUES ($1,$2)",
      values : [email, hash]

    })

    res.send('yeahhhhhh')
  
  })*/


router.post('/register', async (req, res) => {
  const email = req.body.email
  const password = req.body.password

  const result = await client.query({
    text: 'SELECT * FROM users WHERE email=$1',
    values: [email]
  })

  if (result.rows.length > 0) {
    res.status(401).json({
      message: 'user already exists'
    })
    return
  }
  // si on a pas trouvé l'utilisateur
  // alors on le crée

  const hash = await bcrypt.hash(password, 10)

  await client.query({
    text: `INSERT INTO users(email, password)
    VALUES ($1, $2)
    `,
    values: [email, hash]
  })
  res.send('ok')
})


router.get('/me', async (req, res) => {
  if (typeof req.session.userId === 'undefined') {
    res.status(401).json({ message: 'not connected' })
    return
  }

  const result = await client.query({
    text: 'SELECT id, email FROM users WHERE id=$1',
    values: [req.session.userId]
  })

  res.json(result.rows[0])
})

  /*Page de connexion Login EXO 3*/ 
  router.post('/login', async (req, res) => {
    const email = req.body.email
    const password = req.body.password
  
    const result = await client.query({
      text: 'SELECT * FROM users WHERE email=$1',
      values: [email]
    })
  
    if (result.rows.length === 0) {
      res.status(401).json({
        message: 'user doesnt exist'
      })
      return
    }
    // si on a pas trouvé l'utilisateur
    // alors on le crée
    const user = result.rows[0]
  
    if (await bcrypt.compare(password, user.password)) {
      // alors connecter l'utilisateur
      req.session.userId = user.id
      res.json({
        id: user.id,
        email: user.email
      })
    } else {
      res.status(401).json({
        message: 'bad password'
      })
      return
    }
  })




  /*router.post('/login', async (req, res) => {
    const email = (req.body.email)
    const password = (req.body.password)
   
      const sql = "SELECT * FROM users WHERE email=$1"
      const result = await client.query({
        text: sql,
        values: [email] // ici name et description ne sont pas concaténées à notre requête
      })
  
  
      if (result.rows.length === 0){
        res.status(401).json({ 
          message: 'User doesnt exist' 
        })
        return 
      }
  
      const user = result.rows[0]
      
      if (await bcrypt.compare(password, user.password)) {
        // allors co utilisateur
        req.session.userId = user.id
        res.json({
          id : user.id,
          email : user.email
        })
          
      } else {
        res.status(401).json({ 
          message: 'bad password' 
        })
        return
      }

      res.send('ok')
      
      
    
    })*/



/*Seuls utilisateurs connectés peuvent payer : EXO 5 */ 

router.post('/panier/reserver', (req, res) => {
  if (typeof req.session.userId === 'number'){
    res.send('OK')
  } else {
    res.status(401).json ({message : 'vous netes pas connecté '})
  }
   

 
})






/**
 * Dans ce fichier, vous trouverez des exemples de requêtes GET, POST, PUT et DELETE
 * Ces requêtes concernent l'ajout ou la suppression d'articles sur le site
 * Votre objectif est, en apprenant des exemples de ce fichier, de créer l'API pour le panier de l'utilisateur
 *
 * Notre site ne contient pas d'authentification, ce qui n'est pas DU TOUT recommandé.
 * De même, les informations sont réinitialisées à chaque redémarrage du serveur, car nous n'avons pas de système de base de données pour faire persister les données
 */

/**
 * Notre mécanisme de sauvegarde des paniers des utilisateurs sera de simplement leur attribuer un panier grâce à req.session, sans authentification particulière
 */
router.use((req, res, next) => {
  // l'utilisateur n'est pas reconnu, lui attribuer un panier dans req.session
  if (typeof req.session.panier === 'undefined') {
    req.session.panier = new Panier()
  }
  next()
})

/* Ex 2 : 1)
 * Cette route doit retourner le panier de l'utilisateur, grâce à req.session
 */
router.get('/panier', (req, res) => {
  res.json(req.session.panier)
  
})

/* Ex 2 : 2)
 * Cette route doit ajouter un article au panier, puis retourner le panier modifié à l'utilisateur
 * Le body doit contenir l'id de l'article, ainsi que la quantité voulue
 */
router.post('/panier', async(req, res) => {
  const id = parseInt(req.body.id)
  const quantity = parseInt(req.body.quantity)
  
  const result = await client.query({
    text: 'SELECT * FROM places WHERE id = $1',
    values: [id]
  })
  const article = result.rows[0]
  console.log('id :',id)
  if (!article) {
    res.status(404).json({ message: 'article ' + id + ' does not exist' })
    return
  }

  if( quantity < 0){
    res.status(501).json({ message: 'quantity doit etre positif' })
    return
  }

  const articleaj = req.session.panier.article
  if (articleaj) {
    res.status(400).json({ message: 'bad request' })
    return
  }
  const articlenew = {
    id: id,
    quantity: quantity
  }
  req.session.panier.articles.push(articlenew)

  res.json(articlenew)
})



/*
 * Cette route doit permettre de confirmer un panier, en recevant le nom et prénom de l'utilisateur
 * Le panier est ensuite supprimé grâce à req.session.destroy()
 */
router.post('/panier/pay', (req, res) => {
  const prenom = parseInt(req.body.prenom)
  const nom = parseInt(req.body.nom)
  
  req.session.destroy(req.session.panier)
  res.json({ message: 'merci {{prenom}} {{nom}} pour votre achat !' })
})





/* Ex 2 : 3)
 * Cette route doit permettre de changer la quantité d'un article dans le panier
 * Le body doit contenir la quantité voulue
 */
router.put('/panier/:articleId', (req, res) => {
  const articleId = parseInt(req.params.articleId)
  const quantity = parseInt(req.body.quantity)


  //refuse un article qui n'a pas été ajouté au panier
  const articleadd = req.session.panier.articles.find(a => a.id === articleId)
  console.log(articleadd)
  if (!articleadd) {
    res.status(400).json({ message: 'bad request' })
    return
  }

  //si quantité < ou = à 0 
  if( quantity < 0 || quantity === 0){
    res.status(400).json({ message: 'bad request' })
    return
  }

  //change quantité 
  const newquantity = {
    quantity: quantity
  }
  articleadd.quantity = newquantity
  res.json(newquantity)
  



  
})

/* Ex 2 : 4)
 * Cette route doit supprimer un article dans le panier
 */


router.delete('/panier/:articleId', (req, res) => {
  let id = req.params.articleId;
  id = parseInt(id);

  if(isNaN(id) || id <= 0){
    res.status(400).json({ message: 'bad request' })
    return;
  } 

  //refuse un article qui n'a pas été ajouté au panier
  if (req.session.panier.articles.find((a) => a.id === id) === undefined)
  {
  
  
    res.status(400).json({ message: 'bad request' })
    return;
  }

  req.session.panier.articles.splice(req.session.panier.articles.indexOf(req.session.panier.articles.find((a) => a.id === id)),1);
  res.json({message : "Article " + id + " supprime"});
  


})



/**
 * Cette route envoie l'intégralité des articles du site
 */
router.get('/articles', async (req, res) => {
  const result = await client.query({
    text: 'SELECT * FROM places'
  })
  res.json(result.rows)
})

/**
 * Cette route crée un article.
 * WARNING: dans un vrai site, elle devrait être authentifiée et valider que l'utilisateur est bien autorisé
 * NOTE: lorsqu'on redémarre le serveur, l'article ajouté disparait
 *   Si on voulait persister l'information, on utiliserait une BDD (mysql, etc.)
 */
router.post('/article', async (req, res) => {
  const name = req.body.name
  const type = req.body.type
  const image = req.body.image
  const localisation = req.body.localisation
  const price = req.body.price
  

  // vérification de la validité des données d'entrée
  if (typeof name !== 'string' || name === '' ||
      typeof type !== 'string' || type === '' ||
      typeof image !== 'string' || image === ''||
      typeof localisation !== 'string' || localisation === ''||
      typeof price !== 'string' || price === ''
      ){

    res.status(400).json({ message: 'bad request' })
    return
  }

  const result = await client.query({
    text: `INSERT INTO places(name, type, image, localisation, price)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
    `,
    values: [name, type, image, localisation, price]
  })
  const id = result.rows[0].id

  // on envoie l'article ajouté à l'utilisateur
  res.json({
    id: id,
    name: name,
    type: type,
    image: image,
    localisation: localisation,
    price: price
  })
})




/**
 * Cette fonction fait en sorte de valider que l'article demandé par l'utilisateur
 * est valide. Elle est appliquée aux routes:
 * - GET /article/:articleId
 * - PUT /article/:articleId
 * - DELETE /article/:articleId
 * Comme ces trois routes ont un comportement similaire, on regroupe leurs fonctionnalités communes dans un middleware
 */

async function parseArticle (req, res, next) {
  const articleId = parseInt(req.params.articleId)

  // si articleId n'est pas un nombre (NaN = Not A Number), alors on s'arrête
  if (isNaN(articleId)) {
    res.status(400).json({ message: 'articleId should be a number' })
    return
  }
  // on affecte req.articleId pour l'exploiter dans toutes les routes qui en ont besoin
  req.articleId = articleId

  const result = await client.query({
    text: 'SELECT * FROM places WHERE id=$1',
    values: [articleId]
  })
  // const article = articles.find(a => a.id === req.articleId)
  if (!result.rows.length) {
    res.status(404).json({ message: 'article ' + articleId + ' does not exist' })
    return
  }
  // on affecte req.article pour l'exploiter dans toutes les routes qui en ont besoin
  req.article = result.rows[0]
  next()
}


router.route('/article/:articleId')
  /**
   * Cette route envoie un article particulier
   */
  .get(parseArticle, (req, res) => {
    // req.article existe grâce au middleware parseArticle
    res.json(req.article)
  })

  /**
   * Cette route modifie un article.
   * WARNING: dans un vrai site, elle devrait être authentifiée et valider que l'utilisateur est bien autorisé
   * NOTE: lorsqu'on redémarre le serveur, la modification de l'article disparait
   *   Si on voulait persister l'information, on utiliserait une BDD (mysql, etc.)
   */
  .put(parseArticle, async (req, res) => {
    const name = req.body.name
    const type = req.body.type
    const localisation = req.body.localisation
    const image = req.body.image
    const price = req.body.price

    await client.query({
      text: `UPDATE places
              SET name=$1,
              image=$2,
              type=$3,
              localisation=$4,
              price=$5
            WHERE id=$6
            `,
      values: [name, image, type, localisation, price, req.articleId]
    })
    
    res.send()
  })

  

  .delete(parseArticle, async (req, res) => {
    await client.query({
      text: 'DELETE FROM places WHERE id=$1',
      values: [req.articleId]
    })
    res.send()
  })

module.exports = router 
