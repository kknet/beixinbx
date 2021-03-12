/**
 * Created by liyigang on 2/11/2020.
 */
import httpInstance from "../../utils/http";

export function requestGetMyAllInsurance(data, options={}) {
  return httpInstance.post('/app/insurance/getMyOrder', data, options)
}

export function requestGetShareOrder(data, options={}) {
  return httpInstance.post('/app/insurance/getSharedOrder', data, options)
}

export function requestGetSharedList(data, options={}) {
  return httpInstance.post('/app/insurance/getSharedList', data, options)
}

export function requestGetMyInsuranceDetailById(data, options={}) {
  return httpInstance.post('/app/insurance/getInsuranceDetail', data, options)
}

export function requestGetMyInsuranceList(data, options={}) {
  return httpInstance.post('/app/insurance/getOrderList', data, options)
}

// 获取客户收益
export function requestGetMyClientData(data, options={}) {
  return httpInstance.post('/app/insurance/getMyClientData', data, options)
}

// 获取我的客户订单
export function requestGetMyClientOrderList(data, options={}) {
  return httpInstance.post('/app/insurance/getMyClientOrderList', data, options)
}


// 删除分享的用户
export function requestDeleteShareRecord(data, options={}) {
  return httpInstance.post('/app/insurance/deleteShareRecord', data, options)
}

// 生成续费订单
export function createRenewOrder(data, options={}) {
  return httpInstance.post('/app/insurance/createRenewOrder', data, options)
}

// 保单报告
export function getReportService(data, options={}) {
  return httpInstance.post('/app/insurance/report', data, options)
}

// 修改备注
export function editRemark(data, options={}) {
	return httpInstance.post('/app/insurance/editRemark', data, options)
}

