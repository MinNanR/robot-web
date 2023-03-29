import { createRouter, createWebHashHistory } from "vue-router";

const routes = [{
    path: '/login',
    component: () =>
        import('../components/login/login.vue'),
    meta: {
        title: '登陆'
    }
},
{
    path: '/',
    component: () =>
        import('../components/layout/layout.vue'),
    children: [{
        path: "/",
        component: () =>
            import('../components/index/index.vue'),
        meta: {
            title: "主页"
        }
    }, {
        path: "contribution",
        component: () =>
            import('../components/contribution/index.vue'),
        meta: {
            title: "MIAO"
        }
    }, {
        path: "focus",
        component: () =>
            import('../components/contribution/focus.vue'),
        meta: {
            title: "MIAO"
        }
    }, {
        path: "error",
        component: () =>
            import('../components/contribution/error.vue'),
        meta: {
            title: "MIAO"
        }
    },{
        path: "record",
        component: () => import('../components/record/index.vue'),
        meta: {
            title: "MIAO"
        }
    }
    ]
}
]

const router = createRouter({
    history: createWebHashHistory("robot"),
    routes: routes
})

// router.beforeEach((to, from, next) => {
//     if (to.path == '/unauthorized' || to.path == '/login') {
//         next()
//     } else {
//         const token = localStorage.getItem("robot-token")
//         if (token == null) {
//             next('/login')
//         } else {
//             next()
//         }
//         document.title = to.meta.title || 'MIAO'
//     }
// })

export default router