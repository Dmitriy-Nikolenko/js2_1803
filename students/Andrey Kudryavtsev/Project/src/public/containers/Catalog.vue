<template>
    <div class="products">
        <item v-for="item of showItem" :key="item.id_product" :item="item" @add="addToCart"/>
        <item :type="'temp'" @create="createNewItem" />
    </div>
</template>

<script>
import item from '../components/Item.vue'
export default {
    components: { item },
    data() {
        return {
            items: [],
            url: '/api/catalog',
            showItem: []
        }
    },
    methods: {
        addToCart(item){
            this.$parent.$refs.cartRef.addToCart(item)
        },
        setShowItems(search){
            this.showItem = this.items.filter(item => search == "" || item.product_name.toLowerCase().includes(search))
        },
        createNewItem(payload) {
            let name = payload.product_name
            let price = payload.price
            this.$parent.postData(this.url, payload)
                .then(d => {
                    if(d._id) {
                        this.items.push({
                            product_name: name,
                            price: price,
                            id_product: d._id
                        })
                    }
                })
        }
    },
    mounted() {
        this.$parent.getData(this.url)
        .then(data => {
            this.items = data
            this.showItem = data
        })
    }
}
</script>
