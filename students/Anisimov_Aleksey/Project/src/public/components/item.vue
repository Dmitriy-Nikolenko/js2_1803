<template>
    <div :class="type === 'catalog' ? 'product__item' : 'cart__item'">
        <template v-if="type === 'catalog'">
            <img class="product__img" :src="imgComputed" :alt="item.product_name"/>
            <div class="product__desc">
                <p class="product__h2">{{ item.product_name }}</p>
                <p class="product__price">$ {{ item.price }}</p>
            </div>
            <button class="addToCart" @click="$parent.addToCart(item)">Купить</button>
        </template>

        <template v-if="type === 'cart'">
            <img :src="imgComputed" :alt="item.product_name">
                <div class="cart__desc">
                    <p class="cart__title">{{ item.product_name }}</p>
                    <p class="cart__qtt">Qtt: {{ item.quantity }}</p>
                    <p class="cart__price">Price $ {{ item.price }}</p>
                    <!-- <p class="cart__summ">Total $ {{ item.summ }}</p> -->
                </div>
                <button class="cart__action" @click="$emit('remove', item)">&times;</button>
        </template>

        <template v-if="type === 'temp'">
            <img :src="'https://static.trendco.space/img/200x200.png'">
            <div class="desc" style="display: flex; flex-direction: column">
                <label >
                    <input type="text" placeholder="Item name" v-model="newProduct.product_name" class="">
                </label>
                <label >
                    <input type="number" placeholder="Item price" v-model="newProduct.price" class="">
                </label>
                <button class="buy-btn" name="buy-btn" @click="createNew()">Добавить</button>
            </div>
        </template>
    </div>
</template>

<script>

export default {
    data() {
        return {
            newProduct: {
                product_name: '',
                price: 0
            }
        }
    },
    props: {
        type: {
            type: String,
            default: 'catalog'
            //default: () => 'catalog'
        },
        item: {
            type: Object
        },

    },
    methods: {
        // addItem (item) {
        //     this.$emit('add', item)
        // },
        // removeItem(item) {
        //     this.$emit('remove', item)
        // },
        createNew() {
            this.$emit('create', this.newProduct);
            this.newProduct.product_name = ''
            this.newProduct.price = 0
        }
    },
    computed: {
        imgComputed() {
            return `https://static.trendco.space/img/${this.type === 'catalog' ? '200x200.png' : '80x100.png'}`
        }
    }
}
</script>