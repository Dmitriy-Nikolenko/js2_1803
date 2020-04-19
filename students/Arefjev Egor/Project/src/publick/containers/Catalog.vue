<template>
    <div class="products">
        <item v-for="item of items" :key="item.id_product" :item="item"/>
        <item :type="'temp'" @create="createNewItem"/>
    </div>
</template>

<script>
    import item from '../components/Item.vue'
    export default {
        components: { item },
        data() {
            return {
                items: [],
                url: '/api/catalog'
                   }
        },
        // methods: {
        // },
        // computed: {
        // },
        mounted() {
            this.$parent.getData(this.url)
                .then(data => {
                    this.items = data
                })
            },
        methods: {

            addToCart(item) {
                this.$parent.$refs.cartRef.addToCart(item)
            },
            createNewItem(payload) {
                this.$parent.postData(this.url, payload)
                    .then(d => {
                        if(d._id) {
                            this.items.push({
                                product_name: payload.name,
                                price: payload.price,
                                id_product: d._id
                            })
                        }
                    })
            }
        }
    }
</script>
