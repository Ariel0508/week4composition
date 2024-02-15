const { createApp, ref, onMounted } = Vue
import Pagination from './components/pagination.js'
import pModal from './components/pModal.js'
import dModal from './components/dModal.js'

const app = createApp({
    setup() {
        const products = ref([])
        const tempProduct = ref({
            imageUrl: [],
        })
        const pagination = ref({})
        const productRef = ref(null)
        const delModalRef = ref(null)
        const status = ref(false)
        const url = 'https://vue3-course-api.hexschool.io/v2'
        const path = 'rubby-api'

        // 1.確認是否登入
        const checkLogin = () => {
            axios
                .post(`${url}/api/user/check`)
                .then(() => {
                    getData()
                })
                .catch((err) => {
                    console.dir(err)
                    window.location = 'login.html'
                })
        }

        // 2.取得產品資料
        const getData = (page = 1) => {
            axios
                .get(`${url}/api/${path}/admin/products?page=${page}`)
                .then((res) => {
                    products.value = res.data.products
                    pagination.value = res.data.pagination
                })
                .catch((err) => {
                    alert(err.response.data.message)
                    window.location = 'login.html'
                })
        }

        // 3.查看產品細節
        const openModal = (isNew, product) => {
            // isNew === 'new' 新增產品
            if (isNew === 'new') {
                tempProduct.value = {
                    imageUrl: [],
                }
                status.value = true
                productRef.value.oModal()
            }
            // isNew === 'edit' 編輯產品
            else if (isNew === 'edit') {
                tempProduct.value = { ...product }
                status.value = false
                productRef.value.oModal()
            }
            // isNew === 'delete' 刪除產品
            else if (isNew === 'delete') {
                tempProduct.value = { ...product }
                delModalRef.value.oModal()
            }
        }
        onMounted(() => {
            // Retrieve Token
            const token = document.cookie.replace(/(?:(?:^|.*;\s*)rubbyToken\s*=\s*([^;]*).*$)|^.*$/, '$1')
            axios.defaults.headers.common['Authorization'] = token
            checkLogin()
        })
        return {
            products,
            tempProduct,
            openModal,
            status,
            pagination,
            getData,
            delModalRef,
            productRef,
        }
    },
})

// 分頁元件
app.component('pagination', Pagination)

// 4.新增、編輯產品元件
app.component('productModal', pModal)

// 5.刪除產品
app.component('delProductModal', dModal)

app.mount('#app')
