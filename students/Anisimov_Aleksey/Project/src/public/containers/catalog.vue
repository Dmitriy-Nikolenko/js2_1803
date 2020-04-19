<template>
    <div class="product center">
        <item v-for="item of filteredItems" :key="item.id_product" :item='item' type=catalog />
        <item type=temp @create="createNewItem"/>
    </div>
</template>

<script>

export default {
    components: {
        item: () => import('../components/item')
    },
    data() {
        return {
            items: [],
            searchStr: '',
            filteredItems: [],
            url: '/api/catalog',
        }
    },
    methods: {
        addToCart(item) {
            this.$parent.$refs.cartRef.addToCart(item)
        },
        createNewItem(payload) {
            console.log(payload)
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
        },
        filterGoods(string) {
            let regexp = new RegExp(string, 'i') // создали регулярку
            this.filteredItems = this.items.filter(good => regexp.test(good.product_name)) // отфильтровали и записали, следом сразу рендер
        }
    },
    mounted() {
        this.$parent.getData(this.url)
            .then(data => {this.items = data})
            .then(() => {this.filteredItems = this.items})
    }
}
</script>