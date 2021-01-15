<template>
<div>
  <div v-if="!ifConnected">
    <h2 class="font-weight-lighter text-white display-4 text-center">Connexion</h2>
    
    <div class="text-center">
    <form @submit.prevent="loginUser()">
        <input v-model= "email" paceholder= "Email">
        <br><br>
        <input type = "password" v-model = "password" paceholder= "Password">
        <br><br>
        <button class=" btn btn-info" type="submit"> Se connecter </button>
    </form>
    </div>
  <!--    
  <p>{{ifConnected}} </p>
  -->
  </div>
    <div v-else>
      <h4 class="text-white text-center font-weight-lighter display-3">Bienvenue {{user.email}}</h4>
      <br><br>
      <div class="alert alert-success text-center container" role="alert">
        <h5 class="alert-heading">Rendez-vous sur la page Favoris</h5>
        <p>Pour accéder aux nouvelles fonctionnalités</p>
      </div>
      
    </div>
    
    
</div>



</template>

<script>
module.exports = {
  props: {
    
    user: { type: Object},
    ifConnected: {type : Boolean}
    
  },

  data () {
      return {
      email:'',
      password: '',
      
    
  }
  },
  methods: {
    /*await axios.post('api/login', {
              email : this.email,
              password : this.password,
              
          })*/

      async loginUser(){
          
          this.$emit('login', {
          email: this.email,
          password: this.password
      }) 
      },
    

    find(articleId){
      const article = this.panier.articles.find(a => a.id === articleId)
      return article

    },

    addToPanier (articleId){
      this.$emit('add-to-panier', articleId)
    },

    removeFromPanier(articleId){
      this.$emit('remove-from-panier', articleId)
    },

    addArticle () {
      this.$emit('add-article', this.newArticle)
    },
    deleteArticle (articleId) {
      this.$emit('delete-article', articleId)
    },
    editArticle (article) {
      this.editingArticle.id = article.id
      this.editingArticle.name = article.name
      this.editingArticle.description = article.description
      this.editingArticle.image = article.image
      this.editingArticle.price = article.price
    },
    sendEditArticle () {
      this.$emit('update-article', this.editingArticle)
      this.abortEditArticle()
    },
    abortEditArticle () {
      this.editingArticle = {
        id: -1,
        name: '',
        description: '',
        image: '',
        price: 0
      }
    }
  }
}
</script>

