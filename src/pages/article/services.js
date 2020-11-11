/**
 * Created by liyigang on 2/11/2020.
 */
import httpInstance from "../../utils/http";

export function requestGetArticleList(data, options={}) {
  return httpInstance.post('/app/article/getArticleList', data, options)
}

export function requestGetArticleInfoById(data, options={}) {
  return httpInstance.post('/app/article/getArticleDetail', data, options)
}
