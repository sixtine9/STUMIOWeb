const Accueil =  window.httpVueLoader('./components/Accueil.vue')
const Histoire = window.httpVueLoader('./components/Histoire.vue')
const Home = window.httpVueLoader('./components/Home.vue')

const Panier = window.httpVueLoader('./components/Panier.vue')
const Register = window.httpVueLoader('./components/Register.vue')
const Login = window.httpVueLoader('./components/Login.vue')


const routes = [
  { path: '/', component: Accueil },
  {path: '/histoire', component: Histoire  },
  { path: '/bars', component: Home },
  
  { path: '/panier', component: Panier },
  { path: '/register', component: Register},
  { path: '/login', component: Login},
]

const router = new VueRouter({
  routes
})

var app = new Vue({
  router,
  el: '#app',
  data: {
    articles: [],
    panier: {
      createdAt: null,
      updatedAt: null,
      articles: []
    },
    ifConnected: false,
    user: {}
  },
  async mounted () {
    const res = await axios.get('/api/articles')
    this.articles = res.data
    const res2 = await axios.get('/api/panier')
    this.panier = res2.data
    try{
      const res3 = await axios.get('/api/me')
      this.user = res3.data
      this.ifConnected = true
    }
    catch (err) {
      if (err.response?.status === 401) {
        this.ifConnected = false
      } else {
        console.log('error', err)
      }
    }
    
  },
  methods: {
    async reserver(){
      await axios.post('/api/panier/reserver')
      //this.panier.articles = []
    },

    async login (user) {
      const res = await axios.post('/api/login', user)
      this.user = res.data
      this.ifConnected = true
      console.log(this.ifConnected)
          
    },

    async addToPanier(articleId) {
      const res = await axios.post('/api/panier', {id : articleId, quantity : 1})
      this.panier.articles.push(res.data)
    },


    async removeFromPanier(articleId) {
      await axios.delete('/api/panier/' + articleId)
      const index = this.panier.articles.findIndex(a => a.id === articleId)
      this.panier.articles.splice(index, 1)
      console.log(articleId)
    },


    async addArticle (article) {
      const res = await axios.post('/api/article', article)
      this.articles.push(res.data)
    },
    async updateArticle (newArticle) {
      await axios.put('/api/article/' + newArticle.id, newArticle)
      const article = this.articles.find(a => a.id === newArticle.id)
      article.name = newArticle.name
      article.type = newArticle.type
      article.image = newArticle.image
      article.localisation = newArticle.localisation
      article.price = newArticle.price
    },
    async deleteArticle (articleId) {
      await axios.delete('/api/article/' + articleId)
      const index = this.articles.findIndex(a => a.id === articleId)
      this.articles.splice(index, 1)
    }
  }
})
