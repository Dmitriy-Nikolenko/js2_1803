<template>
  <div class="products">
    <editItem @createNewProduct="createNewProduct"></editItem>
    <catalogItem :item="item" v-for="item in showItems" :key="item.id_product" @addtocart="_addToCart"/>
  </div>
</template>

<script>
  export default {
    name: "catalog",
    props: {
      value: {
        type: String,
        default: ""
      },
      type: {
        type: String,
      }
    },
    components: {
      catalogItem: () => import('../components/catalogItem.vue'),
      editItem: () => import('../components/editItem.vue'),
    },
    data() {
      return {
        items: [],
      }
    },
    mounted() {
      this.$parent.getData("/api/catalog.json")
        .then(data => {
          this.items = data;
        })
    },
    methods: {
      _addToCart(item, event) {
        this.$parent.$refs.cart.addToCart(item);
      },
      createNewProduct(prod) {
        this.$parent.postData("/api/addtocatalog.json", prod)
          .then(data => {
            this.items = data;
          })
        .catch(er => {
          this.$parent.showDialog('Ошибка создания товара');
        })
      },
    },
    computed: {
      showItems() {
        return this.items.filter(item => item.product_name.toLowerCase().includes(this.value));
      }
    },
  }
</script>

<style>
</style>
