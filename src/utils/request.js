import axios from 'axios'
import config from './config.js'
import app from '../main.js'
import router from '../router/index.js'
console.log(config.baseUrl)

const request = axios.create({
    baseURL: config.baseUrl,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        "Access-Control-Allow-Origin": "*"
    },
    // transformRequest: [
    //     (data) => {
    //         return JSON.stringify(data)
    //     }
    // ]
})

request.interceptors.request.use(
    config => {
        let token = localStorage.getItem('robot-token')
        config.headers.authorization = token
        return config;
    },
    error => {
        return Promise.reject(error)
    }
)

request.interceptors.response.use(
    response => {
        // console.log(router)
        if (response.status === 200) {
            console.log(response.headers["Set-Cookie"])
            let data = response.data
            if (data.code === '000') {
                if (response.headers['newtoken'] != null) {
                    localStorage.setItem("robot-token", `Bearer ${response.headers.newtoken}`);
                }
                return { data: data.data, message: data.message }
            } else {
                return Promise.reject(data.message)
            }
        } else {
            return Promise.reject()
        }
    },
    error => {
        console.log(app)
        if (error.response != null) {
            if (error.response.status != null) {
                if (error.response.status === 401) {
                    localStorage.removeItem("robot-token")
                    alert("登录信息过期")
                    router.push("/login")
                } else if (error.response.status === 403) {
                    localStorage.removeItem("robot-token")
                    // alert("无权限")
                    router.push('/login')
                }
                return Promise.reject(error.response.message)
            } else {
                return Promise.reject(error)
            }
        } else {
            return Promise.reject(error)
        }
    }
)

export default request