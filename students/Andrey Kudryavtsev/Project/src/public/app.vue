<template>
    <div>
        <header>
            <div class="logo">E-shop</div>
            <div class="cart">
                <search />
                <button class="btn-cart" @click="cart_show = !cart_show">Cart</button>
                <cart v-show="cart_show" ref="cartRef" />
            </div>
        </header>
        <main>
            <catalog ref="catalogRef" />
        </main>
    </div>
</template>

<script>
import catalog from './containers/Catalog.vue'
import cart from './containers/Cart.vue'
import search from './components/search.vue'
export default {
    components: { catalog, cart, search },
    data(){
        return{
            cart_show: false
        }
    },
    methods: {
        getData(url) {
            return fetch(url).then(dataReceived => dataReceived.json())
        },
        postData(url, item) {
            return fetch(url, {
                method: 'POST',
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(item)
            }).then(d => d.json())
            console.log(d)
        },
        putData(url, delta) {
            return fetch(url, {
                method: 'PUT',
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(delta)
            }).then(d => d.json())
        },
        deleteData(url) {
            return fetch(url, {
                method: 'DELETE',
                headers: {"Content-Type": "application/json"},
            }).then(d => d.json())
        }
    }
}
</script>

<style>

</style>