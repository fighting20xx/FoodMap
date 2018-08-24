/*
 * 定义各 API 接口 URL 地址等，
 * 如单点登录、认证系统地址、可视化后台接口地址、工业网关接口地址等。
 * 
 * <strong>
 * 接口地址如果是目录或根域名的话，始终以 / 结尾。
 * </strong>
 * 
 * @since 2018-05-10
 * @version 1.0
 * @author Luowen
 */

const
	// 认证系统相关的。
	OAUTH = window.OAUTH_BASE_URL,
	OAUTH_API = OAUTH + 'api/',

	// 单点登录。
	OAUTH_LOGIN = OAUTH + 'page/login.html?redirectUrl={redirectUrl}',


	// 可视化系统相关的。
	VS = window.VS_BASE_URL,
	VS_API = VS + 'api/',
	VS_WEB = VS + '#/',

	VS_NODE_API =  window.VS_NODE_BASE_URL+'api/v1/',

	// 边缘管控平台
	IOT = window.IOT_URL
;


export default {
	OAUTH,
	OAUTH_API,
	OAUTH_LOGIN,

	VS,
	VS_API,
	VS_WEB,
	VS_NODE_API,

	IOT,
};