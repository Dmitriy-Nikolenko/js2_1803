<template>
  <div :class="type.match(/catalog|temp/i) ? 'product-item' : 'cart-item'">
    <template v-if="type === 'catalog'">
      <img :src="imgCompute" :alt="item.product_name" />
      <div class="desc">
        <h1>{{ item.product_name }}</h1>
        <p>{{ item.price }}</p>
        <button
          class="buy-btn"
          @click="$root.$children[0].$refs.cart.addProduct(item)"
        >
          Купить
        </button>
      </div>
    </template>

    <template v-if="type === 'cart'">
      <img :src="imgCompute" :alt="item.product_name" />
      <div class="product-desc">
        <p class="product-title">{{ item.product_name }}</p>
        <p class="product-quantity">{{ item.quantity }}</p>
        <p class="product-single-price">{{ item.price }}</p>
      </div>
      <div class="right-block">
        <button class="del-btn" @click="$emit('delete', item)">&times;</button>
      </div>
    </template>

    <template v-if="type === 'temp'">
      <img :src="imgCompute" />
      <div class="desc">
        <label>
          <input
            type="text"
            placeholder="Item name"
            v-model="newProduct.product_name"
            class="input w-100"
          />
        </label>
        <label>
          <input
            type="number"
            step="100"
            placeholder="Item price"
            v-model.number="newProduct.price"
            class="input w-100"
          />
        </label>
        <button class="buy-btn" name="buy-btn" @click="createNew(newProduct)">
          Добавить
        </button>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  data() {
    return {
      newProduct: {
        product_name: "",
        price: 0,
      },
    };
  },
  props: {
    type: {
      type: String,
      default: "catalog",
    },
    item: {
      type: Object,
    },
  },
  computed: {
    imgCompute() {
      return `https://placehold.it/${
        this.type === "catalog" ? "300x200" : "100x150"
      }`;
    },
  },
  methods: {
    createNew() {
      let obj = {
        product_name: this.newProduct.product_name,
        price: this.newProduct.price,
      };
      this.$emit("createItem", obj);
      this.newProduct.product_name = "";
      this.newProduct.price = null;
    },
  },
};
</script>
