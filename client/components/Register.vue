<template>
<div>
    <h2 class="font-weight-lighter text-white display-4 text-center">Inscription</h2>
    <div class="text-center">
    <form @submit.prevent="createUser()">
        <input v-model= "email" paceholder= "Email">
        <br><br>
        <input type = "password" v-model = "password" paceholder= "Password">
        <br><br>
        <button class=" btn btn-success" type="submit"> Créer un compte </button>
    </form>
    </div>
      


    
    
  </div>



</template>

<script>
module.exports = {
  props: {
    users: { type: Object},
    
  },

  data () {
      return {
      email:'',
      password: ''
    
  }
  },
  methods: {

      async createUser(){
          await axios.post('api/register', {
              email : this.email,
              password : this.password,
          })
          this.$router.push('/')
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

