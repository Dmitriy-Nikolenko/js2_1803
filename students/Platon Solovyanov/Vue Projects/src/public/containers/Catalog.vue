<template>
  <div class="products">
    <item v-for="item of items" :key="item.id_product" :item="item" />
    <item :type="'temp'" @createItem="createNewItem" />
  </div>
</template>

<script>
import item from "../components/Item.vue";
export default {
  components: { item: item },
  data() {
    return {
      items: [],
      url: "/api/catalog",
    };
  },
  methods: {
    createNewItem(item) {
      let id = new Date().getTime();
      let obj = Object.assign({ id_product: id }, item);
      this.$parent.postData(this.url, obj).then((data) => {
        if (data.result === 1) {
          this.items.push(obj);
        }
      });
    },
  },
  mounted() {
    this.$parent
      .getData(this.url)
      .then((result) => {
        this.items = result;
      })
      .catch((err) => {
        console.log(err);
      });
  },
};
</script>
