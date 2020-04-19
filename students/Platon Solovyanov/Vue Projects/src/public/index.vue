<template>
  <div>
    <header>
      <div class="logo">E-shop</div>
      <div class="cart">
        <form action="#" class="search-form">
          <input type="text" class="search-field" />
          <button class="btn-search">
            <i class="fas fa-search"></i>
          </button>
        </form>
        <button class="btn-cart" @click="showCart = !showCart">Cart</button>
        <cart ref="cart" v-show="showCart" />
      </div>
    </header>
    <main>
      <catalog ref="catalog" />
    </main>
  </div>
</template>

<script>
//
//add packeges (import) подключаем всякие jquery
import catalog from "./containers/Catalog.vue";
import cart from "./containers/Cart.vue";
export default {
  components: {
    catalog,
    cart,
  },
  data() {
    return {
      showCart: false,
    };
  },

  methods: {
    getData(url) {
      return fetch(url).then((data) => data.json());
    },
    postData(url, obj) {
      return fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(obj),
      }).then((data) => data.json());
    },
    putData(url, obj) {
      return fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(obj),
      }).then((data) => data.json());
    },
    deleteData(url, obj) {
      return fetch(url, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(obj),
      }).then((data) => data.json());
    },
  },
};
</script>

<style>
.cart {
  text-align: right;
}
</style>
