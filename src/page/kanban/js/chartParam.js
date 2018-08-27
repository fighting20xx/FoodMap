

// const color1 ='#D30050';
// const color2 ='#FFB508';
// const color3 ='#01B4D2';
// const color4 ='#00BCBC';
// const color5 ='#9803FD';
const COLOR_ARRY =['#D30050','#FFB508','#01B4D2','#00BCBC','#9803FD'];
const COLOR_AXIS = '';
const COLOR_splitLine = '';
const COLOR_FONT = '#000';

const ROOT_EM = 12;
const FONT_LABEL_SIZE = 0.85 * ROOT_EM;
const FONT_VALUE_SIZE = 1.25 * ROOT_EM;
const BORDER_WIDTH = 3;



const AXIS_LABEL_STYLE = {
	fontSize: FONT_LABEL_SIZE,
	color: COLOR_AXIS
};
const AXIS_LINE_STYLE = {
	lineStyle: {
		color: COLOR_AXIS
	}
};
const SPLIT_LINE_STYLE = {
	lineStyle:{
		color: COLOR_splitLine,
		opacity:0.3,
	},
};
const AXIS_X_STYLE = {
	axisLabel: AXIS_LABEL_STYLE,
	axisLine: AXIS_LINE_STYLE,
};

const AXIS_Y_STYLE = {
	axisLabel: AXIS_LABEL_STYLE,
	axisLine: AXIS_LINE_STYLE,
	splitLine:SPLIT_LINE_STYLE
};




const MarkPoint = {
	data: [
		{
			type: 'max',
			name: '最大值',
			itemStyle:{
				color:[COLOR_ARRY[0]]
			}
		},
		{
			type: 'min',
			name: '最小值',
			itemStyle:{
				color:[COLOR_ARRY[3]]
			}
		}
	],
};


const LEGENT = {
	textStyle: {
		fontSize: FONT_LABEL_SIZE,
		color:COLOR_FONT
	},
};

const GRID =  {
		left: '0%',
		right: '2%',
		bottom: '5%',
		top: '8%',
		containLabel: true
	};





export default {
	COLOR_FONT,
	COLOR_ARRY,

	FONT_LABEL_SIZE,
	FONT_VALUE_SIZE,
	BORDER_WIDTH,

	AXIS_X_STYLE,
	AXIS_Y_STYLE,
	AXIS_LABEL_STYLE,
	AXIS_LINE_STYLE,
	SPLIT_LINE_STYLE,
	MarkPoint,
	LEGENT,
	GRID,

};



