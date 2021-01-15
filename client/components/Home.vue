 

<template>
  <div>
    <h2 class="coup text-white font-weight-lighter text-right">Nos coups de coeur du 3ème arrondissement</h2>
    
    <article v-for="article in articles" :key="article.id">
      <div class="article-img">
        <div :style="{ backgroundImage: 'url(' + article.image + ')' }">

          <div class="article-content" v-if="editingArticle.id !== article.id">
        <div class="article-title">
          <h2 >{{ article.name }} <br> <div class="article-ins"> {{article.type}} <br> {{article.localisation}} <br>{{ article.price }} </div></h2>
          <div class="forca">
          <button class="btn " v-if="find(article.id)" @click="removeFromPanier(article.id)"> <img src="icons8-aimer-50-4.png"></button>
          <button class="btn" v-else @click="addToPanier(article.id)"> <img src="icons8-aimer-50-3.png"></button>
         <br><br>
          <button class="btn btn-outline-danger" @click="deleteArticle(article.id)">Supprimer</button>
          
          <br><br>
         
          <button class="btn btn-outline-light" @click="editArticle(article)">Modifier</button>
      
          </div>
        </div>
        </div>
        <div class="article-content" v-else>
        <div class="article-title">
          <h2><input type="text" v-model="editingArticle.name"> - <input type="text" v-model="editingArticle.price"></h2>
         <input type="text" v-model="editingArticle.type">
        <input type="text" v-model="editingArticle.localisation">
        <input type="text" v-model="editingArticle.image" placeholder="Lien vers l'image">
        <div>
            <button class="btn btn-outline-warning" @click="sendEditArticle()">Valider</button>
            <button class="btn btn-outline-warning" @click="abortEditArticle()">Annuler</button>
          </div>
        </div>
        
      </div>

      </div> 
      
    
      
    
    </article>

    
    <div class="cart ">
    <form @submit.prevent="addArticle" class="text-center container ajouter form-group ">
      <h2 class=" text-white font-weight-lighter">Une nouvelle adresse à nous conseiller ? </h2>

      <input  class="form-control " type="text" v-model="newArticle.name" placeholder="Nom ?" required> <br>
      <input   class="form-control "  type="text" v-model="newArticle.type" placeholder="Type de cuisine ?" required> <br>
      
      <input   class="form-control " type="number" v-model="newArticle.localisation" placeholder="Arrondissement ?" required><br>

      <select class="form-control " type="text" v-model="newArticle.price">
          <option disabled value="">Choisir un prix</option>
          <option>‎€</option>
          <option>‎€-‎€‎€</option>
          <option>‎€‎€</option>
          <option>‎€‎€-‎€‎€‎€</option>
          <option>‎€‎€‎€</option>
        </select>
      
      <input  class="form-control "  type="text" v-model="newArticle.image" placeholder="Lien vers une image"> <br><br>
      <button type="submit" class="btn btn-outline-primary" >Ajouter</button>

    </form>
    </div>
    
  </div>
</template>

<script>
module.exports = {
  props: {
    articles: { type: Array, default: [] },
    panier: { type: Object }
  },
  data () {
    return {
      newArticle: {
        name: '',
        image: '',
        type: '',
        localisation: '',
        price:''
      },
      editingArticle: {
        id: -1,
        name: '',
        image: '',
        type: '',
        localisation: '',
        price:''
      }
    }
  },
  methods: {

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
      this.abortEditArticle()
    },
    deleteArticle (articleId) {
      this.$emit('delete-article', articleId)
    },
    editArticle (article) {
      this.editingArticle.id = article.id
      this.editingArticle.name = article.name
      this.editingArticle.image = article.image
      this.editingArticle.type = article.type
      this.editingArticle.localisation = article.localisation
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
        image: '',
        type: '',
        localisation: '',
        price:''
      }
    }
  }
}
</script>
