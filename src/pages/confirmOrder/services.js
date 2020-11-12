/**
 * Created by liyigang on 2/11/2020.
 */
import httpInstance from "../../utils/http";

export function createBxOrder(data, options={}) {
  return httpInstance.post('/app/insurance/createOrder', data, options)
}