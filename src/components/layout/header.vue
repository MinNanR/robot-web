<template>
  <div class="header">
    <div>
      <div style="display: flex">
        <div class="brand">MIAO</div>
        <div>
          <el-menu :uniqueOpened="true" default-active="1" @open="handleOpen" @close="handleClose"
            background-color="#0e1f3d" text-color="#ffffff" active-color="#136ff0" :router="true" mode="horizontal"
            :ellipsis="false">
            <el-menu-item v-for="(menu, index) in navList" :key="index" :index="menu.url">
              <template #title>
                <el-icon>
                  <component :is="menu.icon" />
                </el-icon>
                <span>{{ menu.name }}</span>
              </template>
            </el-menu-item>
          </el-menu>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: "",
      navList: [{
        url: "/contribution",
        name: "MIAO贡记录",
        icon: "Flag"
      }, {
        url: "/record",
        name: "上传记录",
        icon: "Document"
      },{
        url:"/focus",
        name:"重点关注",
        icon:"Warning"
      },{
        url:"/battle",
        name:"战斗分析",
        icon:"Histogram"
      }]
    };
  },
  methods: {
    getUserInfo() {
      this.request
        .post("/common/getUserInfo", {})
        .then((response) => {
          this.username = response.data.username;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
  },
  mounted() {
    // this.getUserInfo();
  },
};
</script>

<style>
.brand {
  font-size: 25px;
  height: 65px;
  line-height: 65px;
  color: #ffffff;
}

.header-right {
  font-size: 18px;
  line-height: 100%;
  color: #ffffff;
}

.header {
  display: flex;
  justify-content: space-between;
}
</style>