<template>
  <div>
    <h2 class="font-weight-lighter display-4 text-white text-center">Mes Favoris</h2>
     <div class="col text-center ">
       <div class="alert alert-info container" role="alert" v-if="!ifConnected">
         <h5 class="alert-heading">Connectez-vous</h5>
          <p > Pour accéder à plus de fonctionnalités <p>
       </div>
    </div>
    <article  v-for= "article in panier.articles" :key= "article.id">
      <div class=" rese">
    <div class="col text-center">
    <button class="btn btn-outline btn-lg  close"  data-dismiss="modal" aria-label="Close" data-toggle="button" aria-pressed="false" @click="reserver(); isHidden = !isHidden" v-if="ifConnected">Réserver</button>
    
    </div>
    </div>
   
  
    <div v-if="resa == true && !isHidden" class="rese">
    <form class="text-center container ajouter form-group ">
      <h2 class="font-weight-lighter text-white text-center">{{ find(article.id).name }}</h2>
      <input  class="form-control " type="number"  placeholder="Nombre de personnes ?" required>
      <input  class="form-control " type="text"  placeholder="Date ? (jj/mm/yyyy)" required>
      <input  class="form-control " type="text"  placeholder="Heure ? (h:m)" required>
      <br>
      <input   class="form-control "  type="text-area"  placeholder="Allergies ?" required>
      <br>
      <button type="submit" class="btn btn-outline-warning" v-on:click="say('Merci, Votre réservation a bien été prise en compte')">Valider</button>
      <br><br>
      <img src ="icons8-bouton-accueil-50.png">
    </form>
  </div>






    
      <!--
      <div class="article_panier">
        <h2>{{article.id}} : {{article.quantity}}</h2>
      </div>
      <label>
        <input type="number" v-model="article.quantity" v-on:change="updateQuantity(article.id, article.quantity)">
      </label>
      -->
      <div class="article-img">
        <div :style="{ backgroundImage: 'url(' + find(article.id).image +')' }">
        <div class="article-title text-center">
        <h2>{{ find(article.id).name }} <br>  <div class="article-ins"> {{find (article.id).type}} <br>{{ find (article.id).localisation }}  <br> {{ find(article.id).price }} </div></h2>
        </div>
      </div>
      </div>

      
      

      


    </article>
    
    
  </div>
</template>

<script>
module.exports = {
  props: {
    ifConnected:{type: Boolean},
    articles: { type: Array, default: [] },
    panier: { type: Object }
  },
  data () {
    return {
      resa: false,
      isHidden: true
    }
  },
  async mounted () {
  },
  methods: {
    find(articleId){
      const article = this.articles.find(a => a.id === articleId)
      return article

    },
    reserver(){
      this.$emit('reserver')
      this.resa = true
    },
    updateQuantity(articleId, quantity){
      this.$emit('update-quantity', quantity)
    },
  
    say: function (message) {
      alert(message)
    }
  
  }
}
</script>

<style scoped>
</style>
