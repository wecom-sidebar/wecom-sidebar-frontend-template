import compareVersions from 'compare-versions'
export { mockWxSDK } from './utils';

/**
 * jssdk 的 config 函数的封装
 * @param setting
 */
const config = (setting: wx.Setting): Promise<wx.ConfigCallbackRes> => {
  return new Promise((resolve, reject) => {
    wx.config({ ...setting });
    wx.ready(res => resolve(res));
    wx.error(err => reject(err));
  });
};

/**
 * jssdk 的 agentConfig 函数封装
 * @param agentSetting
 */
const agentConfig = (agentSetting: Omit<wx.AgentSetting, 'success' | 'fail'>): Promise<wx.ConfigCallbackRes> => {
  return new Promise((resolve, reject) => {
    wx.agentConfig({
      ...agentSetting,
      success: resolve,
      fail: reject,
      complete: resolve,
    });
  });
};

/**
 * 根据 userAgent 检查当前企业微信版本号是否 < 3.0.24
 */
const checkDeprecated = (): boolean => {
  const DEPRECATED_VERSION = '3.0.24'

  const versionRegexp = /wxwork\/([\d.]+)/;
  const versionResult = navigator.userAgent.match(versionRegexp);

  if (!versionResult || versionResult.length < 2) {
    return true;
  }

  const [, version] = versionResult;

  // version < DEPRECATED_VERSION ?
  return compareVersions(version, DEPRECATED_VERSION) === -1
};

/**
 * 通用调用企业微信 SDK 的函数
 * @param apiName api 名称
 * @param params 传入参数
 */
const invoke = <Res = {}>(apiName: wx.Api, params = {}) => {
  return new Promise<wx.InvokeCallbackRes & Res>((resolve, reject) => {
    wx.invoke<Res>(apiName, params, res => {
      if (res.err_msg === `${apiName}:ok`) {
        resolve(res);
      } else {
        reject(res);
      }
    });
  });
};

const wecomJsSdk = {
  checkDeprecated,
  config,
  agentConfig,
  invoke,
};

export default wecomJsSdk;
