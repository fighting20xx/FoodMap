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
	// NODE_ROOT =  'http://localhost:7001/',
	NODE_ROOT =  'http://101.132.122.2:7001/',
	VS_NODE_API =  NODE_ROOT+'api/v1/'
;


export default {
	NODE_ROOT,
	VS_NODE_API,
};
