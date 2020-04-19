<template>
    <div class="cart-block">
        <div class="d-flex">
            <strong class="d-block">Всего товаров</strong> <div id="quantity">{{ getTotal }}</div>
        </div>
        <hr>
        <div class="cart-items">
            <item v-for="item of items" :key="item.id_product" :item="item" :type="'cart'" @remove="removeFromCart"/>
        </div>
        <hr>
        <div class="d-flex">
            <strong class="d-block">Общая ст-ть:</strong> <div id="price">{{ getSum }}</div>
        </div>
    </div>
</template>

<script>
import item from '../components/Item.vue'
export default {
    components: { item },
    data() {
        return {
            items: [],
            total: 0,
            sum: 0,
            url: '/api/cart'
        }
    },
    methods: {
        addToCart(item) {
            let id = item.id_product
            let find = this.items.find (product => product.id_product === id)
            if (find) {
                this.$parent.putData(`/api/cart/${find.id_product}`, {delta: 1})
                .then(stat => {
                    if (stat.status) {
                        find.quantity++
                    }
                })
            } else {
                let newItem = Object.assign({}, item, {quantity: 1})
                this.$parent.postData(this.url, newItem).then(d => {
                    if (d.status) {
                        this.items.push (newItem)
                    }
                })
            }
        },
        removeFromCart(item) {
            let id = item.id_product
            let find = this.items.find (product => product.id_product === id)
            if (find.quantity > 1) {
                this.$parent.putData(`/api/cart/${find.id_product}`, {delta: -1})
                .then(stat => {
                    if (stat.status) {
                        find.quantity--
                    }
                })
            } else {
                this.$parent.deleteData(`/api/cart/${find.id_product}`)
                .then(stat => {
                    if (stat.status) {
                        this.items.splice (this.items.indexOf(find), 1)
                    }
                })
            }
        }
    },
    computed: {
        getTotal(){
            return this.items.reduce((total, item)=> total +=  +item.quantity, 0)
        },
        getSum(){
            return this.items.reduce((sum, item)=> sum += +item.price * +item.quantity, 0)
        }
    },
    mounted() {
        this.$parent.getData(this.url)
        .then(data => {
            this.items = data.contents
            this.total = data.countGoods
            this.sum = data.amount
        })
    }
}
</script>
