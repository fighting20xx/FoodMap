/*
 * 定义 API 接口源名称。
 * 便于在 this.$ajax(AJAX_VS) 的地方使用。
 * 
 * @since 2018-06-28
 * @version 1.0
 * @author Luowen
 */


/** 可视化接口源。 */
export const AJAX_VS = 'vs';
/** 可视化nodeServer接口源。 */
export const AJAX_VS_NODE = 'vs_node';
/** 单点登录接口源。 */
export const AJAX_OAUTH = 'oauth';
/** 工业物联网平台接口源。 */
export const AJAX_IOT = 'iot';


export default {
	AJAX_VS,
	AJAX_OAUTH,
	AJAX_VS_NODE,
};