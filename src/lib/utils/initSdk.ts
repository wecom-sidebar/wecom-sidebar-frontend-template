import apis from '../jsSdk/apis';
import {jsSdk} from "../../index";

export interface Config {
  corpId: string;
  agentId: string;
}

export type GetSignatures = () => Promise<TicketRes>

/**
 * 初始化企业微信 SDK 库
 * config: 基础信息配置
 * getSignatures: 获取签名函数
 */
const initSdk = async (config: Config, getSignatures: GetSignatures) => {
  const { corpId, agentId } = config;

  // 获取 ticket
  const signaturesRes = await getSignatures();

  await jsSdk.agentConfig({
    corpid: corpId,
    agentid: agentId,
    timestamp: signaturesRes.meta.timestamp,
    nonceStr: signaturesRes.meta.nonceStr,
    signature: signaturesRes.app.signature,
    jsApiList: apis,
  }).catch(e => {
    console.error(e)
  });
};

export default initSdk