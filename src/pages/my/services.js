/**
 * Created by liyigang on 2/11/2020.
 */
import httpInstance from "../../utils/http";

export function requestGetMyAllInsurance(data, options={}) {
  return httpInstance.post('/app/insurance/getMyOrder', data, options)
}

export function requestGetMyInsuranceDetailById(data, options={}) {
  return httpInstance.post('/app/insurance/getInsuranceDetail', data, options)
}

export function requestGetMyInsuranceList(data, options={}) {
  return httpInstance.post('/app/insurance/getOrderList', data, options)
}
