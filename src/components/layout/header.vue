<template>
  <div class="header">
    <div style="display: flex;justify-content: space-between;width: 100%">
      <div style="display: flex">
        <div class="brand">民难科技</div>
        <div>
          <el-menu
            :uniqueOpened="true"
            default-active="1"
            @open="handleOpen"
            @close="handleClose"
            background-color="#0e1f3d"
            text-color="#ffffff"
            active-color="#136ff0"
            :router="true"
            mode="horizontal"
            :ellipsis="false"
          >
            <el-menu-item
              v-for="(menu, index) in navList"
              :key="index"
              :index="menu.url"
            >
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
      <div style="color: white">
        <span>你好，{{ username }}</span>
      </div>
    </div>
  </div>
</template>

<script>


export default {
  data() {
    return {
      username: "",
      // navList: [{
      //   url: "/contribution",
      //   name: "MIAO贡记录",
      //   icon: "Flag"
      // }, {
      //   url: "/record",
      //   name: "上传记录",
      //   icon: "Document"
      // },{
      //   url:"/focus",
      //   name:"重点关注",
      //   icon:"Warning"
      // },{
      //   url:"/battle",
      //   name:"战斗分析",
      //   icon:"Histogram"
      // }]
      // navList: [
      //   {
      //     url: "/question",
      //     name: "词条管理",
      //     icon: "Collection",
      //   },
      //   {
      //     url: "/strategy",
      //     name: "消息处理策略",
      //     icon: "Odometer",
      //   },
      //   {
      //     url: "/nick",
      //     name: "查询关键字管理",
      //     icon: "Flag",
      //   },
      //   {
      //     url: "/queryMap",
      //     name: "快捷查询管理",
      //     icon: "SetUp",
      //   },
      //   {
      //     url: "/authManage",
      //     name: "权限管理",
      //     icon: "Lock",
      //   },
      //   {
      //     url: "/user",
      //     name: "用户管理",
      //     icon: "User",
      //   },
      // ],
      navList:[]
    };
  },
  methods: {
    getUserInfo() {
      // this.request
      //   .post("/common/getUserInfo", {})
      //   .then((response) => {
      //     this.username = response.data.username;
      //   })
      //   .catch((error) => {
      //     console.log(error);
      //   });
      let nickName = localStorage.getItem("nickName")
      this.username = nickName
    },
    getMenuList() {
      this.request
        .post("/robot/api/auth/getMenuList", {})
        .then((response) => {
          let data = response.data;
          this.navList = data;
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
    this.getUserInfo();
    this.getMenuList()
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