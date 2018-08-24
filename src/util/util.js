import packjson from '../../package.json';
import utiljs from './util.min';


let util = {
};
util.title = function (title) {
	title = title || packjson.siteName;
	window.document.title = title;
};


util.inOf = function (arr, targetArr) {
	let res = true;
	arr.forEach(item => {
		if (targetArr.indexOf(item) < 0) {
			res = false;
		}
	});
	return res;
};

util.oneOf = function (ele, targetArr) {
	if (targetArr.indexOf(ele) >= 0) {
		return true;
	} else {
		return false;
	}
};

util.showThisRoute = function (itAccess, currentAccess) {
	if (typeof itAccess === 'object' && Array.isArray(itAccess)) {
		return util.oneOf(currentAccess, itAccess);
	} else {
		return itAccess === currentAccess;
	}
};

util.getRouterObjByName = function (routers, name) {
	if (!name || !routers || !routers.length) {
		return null;
	}
	// debugger;
	let routerObj = null;
	for (let item of routers) {
		if (item.name === name) {
			return item;
		}
		routerObj = util.getRouterObjByName(item.children, name);
		if (routerObj) {
			return routerObj;
		}
	}
	return null;
};

util.handleTitle = function (vm, item) {
	if (typeof item.title === 'object') {
		return vm.$t(item.title.i18n);
	} else {
		return item.title;
	}
};

util.setCurrentPath = function (vm, name) {
	let title = '';
	let isOtherRouter = false;
	vm.$store.state.app.routers.forEach(item => {
		if (item.children.length === 1) {
			if (item.children[0].name === name) {
				title = util.handleTitle(vm, item);
				if (item.name === 'otherRouter') {
					isOtherRouter = true;
				}
			}
		} else {
			item.children.forEach(child => {
				if (child.name === name) {
					title = util.handleTitle(vm, child);
					if (item.name === 'otherRouter') {
						isOtherRouter = true;
					}
				}
			});
		}
	});
	let currentPathArr = [];
	if (name === 'home_index') {
		currentPathArr = [
			{
				title: util.handleTitle(vm, util.getRouterObjByName(vm.$store.state.app.routers, 'home_index')),
				path: '',
				name: 'home_index'
			}
		];
	} else if ((name.indexOf('_index') >= 0 || isOtherRouter) && name !== 'home_index') {
		currentPathArr = [
			{
				title: util.handleTitle(vm, util.getRouterObjByName(vm.$store.state.app.routers, 'home_index')),
				path: '/home',
				name: 'home_index'
			},
			{
				title: title,
				path: '',
				name: name
			}
		];
	} else {
		let currentPathObj = vm.$store.state.app.routers.filter(item => {
			if (item.children.length <= 1) {
				return item.children[0].name === name;
			} else {
				let i = 0;
				let childArr = item.children;
				let len = childArr.length;
				while (i < len) {
					if (childArr[i].name === name) {
						return true;
					}
					i++;
				}
				return false;
			}
		})[0];
		if (currentPathObj.children.length <= 1 && currentPathObj.name === 'home') {
			currentPathArr = [
				{
					title: '首页',
					path: '',
					name: 'home_index'
				}
			];
		} else if (currentPathObj.children.length <= 1 && currentPathObj.name !== 'home') {
			currentPathArr = [
				{
					title: '首页',
					path: '/home',
					name: 'home_index'
				},
				{
					title: currentPathObj.title,
					path: '',
					name: name
				}
			];
		} else {
			let childObj = currentPathObj.children.filter((child) => {
				return child.name === name;
			})[0];
			currentPathArr = [
				{
					title: '首页',
					path: '/home',
					name: 'home_index'
				},
				{
					title: currentPathObj.title,
					path: '',
					name: currentPathObj.name
				},
				{
					title: childObj.title,
					path: currentPathObj.path + '/' + childObj.path,
					name: name
				}
			];
		}
	}
	vm.$store.commit('setCurrentPath', currentPathArr);

	return currentPathArr;
};

util.openNewPage = function (vm, name, argu, query) {
	let pageOpenedList = vm.$store.state.app.pageOpenedList;
	let openedPageLen = pageOpenedList.length;
	let i = 0;
	let tagHasOpened = false;
	while (i < openedPageLen) {
		if (name === pageOpenedList[i].name) { // 页面已经打开
			vm.$store.commit('pageOpenedList', {
				index: i,
				argu: argu,
				query: query
			});
			tagHasOpened = true;
			break;
		}
		i++;
	}
	if (!tagHasOpened) {
		let tag = vm.$store.state.app.tagsList.filter((item) => {
			if (item.children) {
				return name === item.children[0].name;
			} else {
				return name === item.name;
			}
		});
		tag = tag[0];
		if (tag) {
			tag = tag.children ? tag.children[0] : tag;
			if (argu) {
				tag.argu = argu;
			}
			if (query) {
				tag.query = query;
			}
			vm.$store.commit('increateTag', tag);
		}
	}
	vm.$store.commit('setCurrentPageName', name);
};

util.toDefaultPage = function (routers, name, route, next) {
	let len = routers.length;
	let i = 0;
	let notHandle = true;
	while (i < len) {
		if (routers[i].name === name && routers[i].children && routers[i].redirect === undefined) {
			route.replace({
				name: routers[i].children[0].name
			});
			notHandle = false;
			next();
			break;
		}
		i++;
	}
	if (notHandle) {
		next();
	}
};

util.fullscreenEvent = function (vm) {
	vm.$store.commit('initCachepage');
	// 权限菜单过滤相关
	vm.$store.commit('updateMenulist');
	// 全屏相关
};


/**
 * 获取一个指定名称的组件。
 * 
 * @param {String} sName 组件名称。
 * @param {Vue} vm
 * @return {VueComponent}
 */
util.getComponentByName = (sName, vm) => {
	return search(vm.$children);

	/**
	 * 在该组队列里查找组件，并且递归。
	 * 
	 * @param {Array} aoComponents 组件列表 $children
	 * @return {VueComponent|null}
	 */
	function search(aoComponents) {
		if (aoComponents) {
			for (let i = 0, l = aoComponents.length; i < l; i++) {
				let oComponent = aoComponents[i];
				let sTag = oComponent.$vnode.tag;

				// 判断当前组件，及递归查找子组件。
				if (sTag && sTag.endsWith(sName)
					|| (oComponent = search(oComponent.$children))) {
					return oComponent;
				} else {
					// 递归查找。
					oComponent = search(oComponent.$children);
					if (oComponent) {
						return oComponent;
					}
				}
			}
		}

		return null;
	}
};


/**
 * 获取一个指定名称的组件。
 * 
 * @param {DOMElement} elElement 节点对象。
 * @param {Vue} vm
 * @return {VueComponent}
 */
util.getComponentByElement = (elElement, vm) => {
	return search(vm.$children);

	/**
	 * 在该组队列里查找组件，并且递归。
	 * 
	 * @param {Array} aoComponents 组件列表 $children
	 * @return {VueComponent|null}
	 */
	function search(aoComponents) {
		if (aoComponents) {
			for (let i = 0, l = aoComponents.length; i < l; i++) {
				let oComponent = aoComponents[i];

				// 判断当前组件，及递归查找子组件。
				if (oComponent.$el == elElement) {
					return oComponent;
				} else {
					// 递归查找。
					oComponent = search(oComponent.$children);
					if (oComponent) {
						return oComponent;
					}
				}
			}
		}

		return null;
	}
};


/**
 * 将数字里的日期时间型转换成指定字段配置的格式。
 * 
 * @param {Object} oData
 * @param {Array} aaoFields
 * @return {void}
 */
util.dateFieldFormat = (oData, aaoFields) => {
	Object.entries(oData).forEach(([sKey, oValue]) => {
		if (oValue instanceof Date) {
			let oField = getField(sKey);
			if (oField && oField.format) {
				oData[sKey] = utiljs.formatDate(oValue, oField.format);
			}
		}
	});


	function getField(sKey) {
		for (let i = 0, il = aaoFields.length; i < il; i++) {
			let aoFields = aaoFields[i];

			for (let j = 0, jl = aoFields.length; j < jl; j++) {
				let oField = aoFields[j];

				if (oField && oField.model == sKey) {
					return oField;
				}
			}
		}
	}
};


export default util;
