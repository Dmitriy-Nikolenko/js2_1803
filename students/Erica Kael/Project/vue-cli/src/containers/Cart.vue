<template>
    <div class="cart-block">
        <div class="d-flex">
        <strong class="d-block">Всего товаров</strong> <div id="quantity">{{this.total}}</div>
        </div>
        <hr>
        <item :type="'cart'" v-for="item of items" :key="item.id_product" :item="item" @remove="removeFromCart"/>
        <hr>
        <div class="d-flex">
        <strong class="d-block">Общая ст-ть:</strong> <div id="price">{{this.sum}}</div>
        </div>
    </div>
</template>

<script>
import item from '../components/Item.vue';

export default {
    data() {
        return {
            items: [],
            url: '/api/cart',
            sum: 0,
            total: 0
        }
    },
    components: { item },
    methods: {
        addToCart(item) {
            let id = item.id_product
            let find = this.items.find (product => product.id_product === id)
            if (find) {
                this.$parent.putData(`/api/cart/${find.id_product}`, {delta: 1})
                .then(stat => {
                    if (stat.status) {
                        find.quantity++
                        this.checkTotalAndSum ()
                    }
                })
            } else {
                let newItem = Object.assign({}, item, {quantity: 1})
                this.$parent.postData(this.url, newItem).then(d => {
                    if (d.status) {
                        this.items.push (newItem)
                        this.checkTotalAndSum ()
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
                        this.checkTotalAndSum ()
                    }
                })
            } else {
                this.$parent.deleteData(`/api/cart/${find.id_product}`)
                .then(stat => {
                    if (stat.status) {
                        this.items.splice (this.items.indexOf(find), 1)
                        this.checkTotalAndSum ()
                    }
                })
            }
        },
        checkTotalAndSum () {
            let qua = 0
            let pr = 0
            this.items.forEach (item => {
                qua += item.quantity
                pr += item.price * item.quantity
                })
            this.total = qua
            this.sum = pr
        }
    },
    mounted() {
        this.$parent.getData(this.url)
        .then(data => {
            this.items = data.contents
            this.checkTotalAndSum ()
        })
    }
    
}
</script>
