/**
 * Created by liyigang on 2/11/2020.
 */
import axios from 'axios'
const host = 'http://120.78.84.243:9035'
const baseUrl = '/baoguanjia'
const httpInstance = axios.create({
    baseURL: host + baseUrl,
    timeout: 3000,
    headers: {}
});

export default httpInstance