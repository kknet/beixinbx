/**
 * Created by liyigang on 2/11/2020.
 */
import httpInstance from "../../utils/http";

export function uploadImage(data, options={}) {
  return httpInstance.post('/app/wechat/loginOrRegist', data, options)
}

export function createOrder(data, options={}) {
  return httpInstance.post('/app/insurance/createInsurance', data, options)
}
