import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
    {
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
                import('../components/manage/question.vue'),
            meta: {
                title: "词条管理"
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
            path: "record",
            component: () => import('../components/record/index.vue'),
            meta: {
                title: "MIAO"
            }
        }, {
            path: "battle",
            component: () => import('../components/battle/index.vue'),
        }, {
            path: "question",
            component: () => import('../components/manage/question.vue')
        }, {
            path: "strategy",
            component: () => import('../components/manage/strategy.vue')
        }, {
            path: "nick",
            component: () => import('../components/manage/nick.vue')
        }, {
            path: "queryMap",
            component: () => import('../components/manage/queryMap.vue')
        }
        ]
    }
]

const router = createRouter({
    history: createWebHashHistory("robot"),
    routes: routes
})

router.beforeEach((to, from, next) => {
    if (to.path == '/unauthorized' || to.path == '/login') {
        next()
    } else {
        const token = localStorage.getItem("robot-token")
        if (token == null) {
            next('/login')
        } else {
            next()
        }
        document.title = to.meta.title || 'MIAO'
    }
})

export default router