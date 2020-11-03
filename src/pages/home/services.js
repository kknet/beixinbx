/**
 * Created by liyigang on 2/11/2020.
 */
import httpInstance from "../../utils/http";

export function LoginGetToken(data, options={}) {
  return httpInstance.post('/app/wechat/loginOrRegist', data, options)
}

// 获取openid 唯一标识符
export function requestGetOpenId(data, options={}) {
  return httpInstance.post(`/app/wechat/getUserInfoByCode?code=${data.code}`, data, options)
}
