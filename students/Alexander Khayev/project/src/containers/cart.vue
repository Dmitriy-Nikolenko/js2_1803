<template>
  <div class="cart-block">
    <div class="d-flex">
      <strong class="d-block">Total items: {{totalItems}} </strong>
    </div>
    <hr>
    <h3 v-if="cartItems.length === 0">Нет данных</h3>
    <cartItem v-else v-for="item in cartItems" :key="item.id_product" :item="item" @delete="_deleteFromCart"/>
    <hr>
    <div class="d-flex">
      <strong class="d-block">Total price: ${{totalPrice}}</strong>
    </div>
  </div>
</template>

<script>

  export default {
    name: "cart",
    components: {
      'cartItem': () => import('../components/cartItem.vue'),
    },
    data() {
      return {
        cartItems: [],
      }
    },
    computed: {
      totalItems() {
        return this.cartItems.reduce((start, current) => start + current.quantity, 0)
      },
      totalPrice() {
        return this.cartItems.reduce((start, current) => start + current.price * current.quantity, 0)
      },
    },
    mounted() {
      this._initData();
    },
    methods: {
      _initData() {
        this.$parent.getData("/api/basket.json")
          .then(data => {
            this.cartItems = data.contents;
          })
      },
      _deleteFromCart(cartItem) {
        let find = this._findItem(cartItem.id_product)
        if (undefined === find) {
          throw Error('Нельзя удалить неудаляемое')
        }
        if (find.quantity > 1) {
          this.$parent.putData(`/api/changecart.json/${cartItem.id_product}`, {delta: -1})
            .then(res => {
              if (1 === res.result) {
                cartItem.quantity--;
              }
            })
        } else {
          this.$parent.deleteData(`/api/delbasket.json/${cartItem.id_product}`)
            .then(res => {
              if (1 === res.result) {
                this.cartItems.splice(this.cartItems.indexOf(cartItem), 1);
              } else {
                throw Error('Error delete item');
              }
            })
        }
      },
      addToCart(catalogItem) {
        let find = this._findItem(catalogItem.id_product);
        if (find === undefined) {
          let newObj = this._createFromCatalogItem(catalogItem)
          this.$parent.postData("/api/tobasket.json", newObj)
            .then(r => {
              if (1 === r.result) {
                this.cartItems.push(newObj);// JSON.parse(JSON.stringify(prod)); // must be created NEW OBJECT!)
              }
            })
        } else {
          this.$parent.putData(`/api/changecart.json/${find.id_product}`, {delta: 1})
            .then(r => {
                if (1 === r.result) {
                  ++find.quantity;
                }
              }
            )
        }
      },
      _findItem(id) {
        return this.cartItems.find(product => +product.id_product === +id);
      },
      _createFromCatalogItem(catalogItem) {
        return Object.assign({}, catalogItem, {quantity: 1});
        // let obj = JSON.parse(JSON.stringify(catalogItem));
        // obj.quantity = 1;
        // return obj;
      },
    }
  }
</script>

<style>
</style>
