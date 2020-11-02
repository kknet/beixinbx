/**
 * Created by liyigang on 2/11/2020.
 */
import httpInstance from "../../utils/http";

export function LoginServe(data, options={}) {
  return httpInstance.post('/app/wechat/loginOrRegist', data, options)
}
