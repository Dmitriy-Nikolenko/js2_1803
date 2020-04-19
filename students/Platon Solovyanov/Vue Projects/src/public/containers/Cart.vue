<template>
  <div class="cart-block" v-show="showCart">
    <div class="d-flex">
      <strong class="d-block">Всего товаров</strong>
      <div id="quantity">{{ getCount }}</div>
    </div>
    <hr />
    <div class="cart-items">
      <item
        v-for="item of items"
        :key="item.id_product"
        :type="'cart'"
        :item="item"
        @delete="deleteProduct"
      />
    </div>
    <hr />
    <div class="d-flex">
      <strong class="d-block">Общая ст-ть:</strong>
      <div id="price">{{ getSum }}</div>
    </div>
  </div>
</template>

<script>
import item from "../components/Item.vue";
export default {
  components: { item: item },
  data() {
    return {
      items: [],
      count: null,
      sum: null,
      showCart: false,
      name: "cart",
      url: "/api/cart"
      // url:
      //   "https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses/getBasket.json"
    };
  },
  methods: {
    addProduct(product) {
      let id = product.id_product;
      let find = this.items.find(product => product.id_product === id);
      if (find) {
        find.quantity++;
        this.$parent.putData(this.url, find).then(data => {
          if (data.result !== 1) {
            find.quantity--;
          }
        });
      } else {
        let obj = Object.assign({}, product, { quantity: 1 });
        this.$parent.postData(this.url, obj).then(data => {
          if (data.result === 1) {
            this.items.push(obj);
          }
        });
      }
    },
    deleteProduct(product) {
      let id = product.id_product;
      let find = this.items.find(product => product.id_product === id);
      if (find.quantity > 1) {
        find.quantity--;
        this.$parent.putData(this.url, find).then(data => {
          if (data.result !== 1) {
            find.quantity++;
          }
        });
      } else {
        this.$parent.deleteData(this.url, find).then(data => {
          if (data.result === 1) {
            this.items.splice(this.items.indexOf(find), 1);
          }
        });
      }
    }
  },
  computed: {
    getSum() {
      return this.items.reduce(
        (sum, item) => (sum += +item.price * +item.quantity),
        0
      );
    },
    getCount() {
      return this.items.reduce((count, item) => (count += +item.quantity), 0);
    }
  },
  mounted() {
    this.$parent
      .getData(this.url)
      .then(result => {
        this.items = result.contents;
        this.sum = result.amount;
        this.count = result.countGoods;
      })
      .catch(err => {
        console.log(err);
      });
  }
};
</script>
