import {
  createApp,
  ref,
  onMounted,
} from "https://unpkg.com/vue@3/dist/vue.esm-browser.js";

let productModal = null;
let delProductModal = null;

const app = createApp({
  setup() {
    const products = ref([]);
    const tempProduct = ref({
      imageUrl: [],
    });
    const pagination = ref({});
    const status = ref(false);
    const url = "https://vue3-course-api.hexschool.io/v2";
    const path = "rubby-api";

    // 1.確認是否登入
    const checkLogin = () => {
      axios
        .post(`${url}/api/user/check`)
        .then(() => {
          getData();
        })
        .catch((err) => {
          console.dir(err);
          window.location = "login.html";
        });
    };

    // 2.取得產品資料
    const getData = (page = 1) => {
      axios
        .get(`${url}/api/${path}/admin/products?page=${page}`)
        .then((res) => {
          products.value = res.data.products;
          pagination.value = res.data.pagination;
        })
        .catch((err) => {
          alert(err.response.data.message);
          window.location = "login.html";
        });
    };

    // 3.查看產品細節
    const openModal = (isNew, product) => {
      // isNew === 'new' 新增產品
      if (isNew === "new") {
        tempProduct.value = {
          imageUrl: [],
        };
        status.value = true;
        productModal.show();
      }
      // isNew === 'edit' 編輯產品
      else if (isNew === "edit") {
        tempProduct.value = { ...product };
        status.value = false;
        productModal.show();
      }
      // isNew === 'delete' 刪除產品
      else if (isNew === "delete") {
        tempProduct.value = { ...product };
        delProductModal.show();
      }
    };
    onMounted(() => {
      // Retrieve Token
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)rubbyToken\s*=\s*([^;]*).*$)|^.*$/,
        "$1"
      );
      axios.defaults.headers.common["Authorization"] = token;
      checkLogin();
    });
    return {
      products,
      tempProduct,
      openModal,
      status,
      pagination,
      getData,
    };
  },
});

// 分頁元件
app.component("pagination", {
  template: "#vue-pagination",
  props: ["pages"],
  setup(props, { emit }) {
    const emitPages = (item) => {
      emit("emit-pages", item);
    };

    return {
      emitPages,
    };
  },
});

// 4.新增、編輯產品元件
app.component("productModal", {
  template: "#productModal",
  props: ["status", "product"],
  setup(props, { emit }) {
    const url = "https://vue3-course-api.hexschool.io/v2";
    const path = "rubby-api";
    const updateProduct = () => {
      // 新增
      let productUrl = `${url}/api/${path}/admin/product`;
      let http = "post";

      // 編輯
      if (!props.status) {
        productUrl = `${url}/api/${path}/admin/product/${props.product.id}`;
        http = "put";
      }
      axios[http](productUrl, { data: props.product })
        .then((res) => {
          alert(res.data.message);
          // 隱藏modal
          productModal.hide();
          // 獲取最新資料
          emit("update");
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    };
    // 產品圖片
    const createImages = () => {
      props.product.imagesUrl = [];
      props.product.imagesUrl.push("");
    };
    onMounted(() => {
      //  modal
      productModal = new bootstrap.Modal("#productModal", {
        keyboard: false,
        // 'static' 時，表示當模態框彈出時，點擊背景區域將不會關閉模態框
        backdrop: "static",
      });
    });

    return {
      updateProduct,
      createImages,
    };
  },
});

// 5.刪除產品
app.component("delProductModal", {
  template: "#delProductModal",
  props: ["item"],
  setup(props, { emit }) {
    const url = "https://vue3-course-api.hexschool.io/v2";
    const path = "rubby-api";
    const delProduct = () => {
      axios
        .delete(`${url}/api/${path}/admin/product/${props.item.id}`)
        .then((res) => {
          // 獲取最新資料
          emit("update");
          // 隱藏modal
          delProductModal.hide();
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    };
    const openModal = () => {
      delProductModal.show();
    };
    onMounted(() => {
      // delete modal
      delProductModal = new bootstrap.Modal("#delProductModal", {
        keyboard: false,
        backdrop: "static",
      });
    });

    return {
      delProduct,
      openModal,
    };
  },
});

// // delete modal
// delProductModal = new bootstrap.Modal('#delProductModal',{keyboard:false})
app.mount("#app");
