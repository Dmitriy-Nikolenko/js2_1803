<template>
    <div class="cart">
        <button @click="showCart()" class="cart__button">Корзина</button>
        <div class="cart__counter">{{ totalCartItems }}</div>
        <div class="cart__empty" v-show="isEmptyCart">Корзина пуста</div>
        <div class="cart__block" v-show="isVisibleCart">
          <p class="cart__p">Всего товаров: {{ totalCartItems }} шт.</p>
          <hr class="cart__hr">
          
          <item v-for="item of this.items" :key='item.id_product' :item='item' type=cart @remove='removeFromCart'/>

          <hr class="cart__hr">
          <!-- <p class="cart__p">Общая стоимость: ${{ totalCartSUmm }}</p> -->
        </div>
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
            isVisibleCart: false,
            isEmptyCart: false,
            url: '/api/cart',
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
            this.hideCart()
        },
        isCartEmpty() {
            if (this.items.length === 0) {
                return true
            }
            return false
        },
        hideCart() {
            if (this.isCartEmpty()) {
                this.isVisibleCart = false
            }
        },
        showCart() {
            if (this.items.length === 0) {
                this.isEmptyCart = !this.isEmptyCart
                this.isVisibleCart = false
            } else {
                this.isVisibleCart = !this.isVisibleCart
                this.isEmptyCart = false
            }
        },
        
        // removeFromCart(el) {
        //     this.items = this.items.filter(item => item.id !== el.id)
        //     this.hideCart()
        // },
        
    },
    computed: {
        totalCartItems() {
            let totalQtt = null
            this.items.forEach(element => {
                totalQtt += element.quantity
            });
            return totalQtt
        },
        totalCartSUmm() {
            let totalSumm = null
            this.items.forEach(element => {
                totalSumm += element.summ
            });
            return totalSumm
        }
    },
    updated() {
        if (!this.isCartEmpty) {
            this.isEmptyCart = false
        }

    }
    
}
</script>