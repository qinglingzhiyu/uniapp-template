<template>
	<view class="w-picker">
		<view class="mask" :class="{'show':showPicker}" @tap="maskTap" @touchmove.stop.prevent catchtouchmove="true"></view>
		<view class="w-picker-cnt" :class="{'show':showPicker}">
			<view class="w-picker-hd" @touchmove.stop.prevent catchtouchmove="true">
				<view class="w-picker-btn" @tap="pickerCancel">取消</view>
				<view class="w-picker-btn" :style="{'color':themeColor}" @tap="pickerConfirm">确定</view>
			</view>
			<view class="w-picker-view" v-if="mode=='region'">
				<picker-view :indicator-style="itemHeight" :value="pickVal" @change="bindChange" @touchstart="touchStart" @touchend="touchEnd">
					<picker-view-column>
						<view class="w-picker-item" v-for="(item,index) in data.provinces" :key="index">{{item.label}}</view>
					</picker-view-column>
					<picker-view-column>
						<view class="w-picker-item" v-for="(item,index) in data.citys" :key="index">{{item.label}}</view>
					</picker-view-column>
					<picker-view-column v-if="!hideArea">
						<view class="w-picker-item" v-for="(item,index) in data.areas" :key="index">{{item.label}}</view>
					</picker-view-column>
				</picker-view>
			</view>
		</view>
	</view>
</template>

<script>
	import provinces from './city-data/province.js';
	import citys from './city-data/city.js';
	import areas from './city-data/area.js';
	import initPicker from "./picker.js";
	import { oneOf } from "@/utils/util"

	export default {
		name: 'wpicker',
		props: {
			mode: {
				type: String,
				validator(mode) {
					let modeList = ['half', 'date', 'dateTime', 'yearMonth', 'time', 'region', 'selector', 'limit', 'limitHour',
						'range', 'linkage'
					]; //过滤无效mode;
					return oneOf(mode, modeList);
				},
				default () {
					return "date"
				}
			},
			themeColor: {
				type: String,
				default () {
					return "#EB0909"
				}
			},
			timeout: {
				type: Boolean,
				default: false
			},
			areaCode: {
				type: Array,
				default () {
					return null
				}
			},
			defaultVal: {
				type: [Array, String],
				default: ""
			},
			hideArea: { //隐藏省市区三级联动   地区列
				type: Boolean,
				default: false
			},
		},
		data() {
			return {
				data: {},
				itemHeight: `height: ${uni.upx2px(88)}px;`,
				pickVal: [],
				showPicker: false,
				confirmFlag:true
			};
		},
		mounted() {
			this.initData();
		},
		methods: {
			// 初始化数据
			initData() {
				if (this.mode === 'region') return this.initDataByRegion()
			},
			// 初始化地区选择器
			initDataByRegion() {
				let data = {}
				let dVal = []
				let province, city, area;
				let checkArr = this.checkArr;
				if (this.areaCode) {
					dVal = this.getRegionVal(this.areaCode, true);
				} else {
					dVal = this.getRegionVal(this.defaultVal);
				}
				if (this.hideArea) {
					data = {
						provinces: provinces,
						citys: citys[dVal[0]]
					};
				} else {
					data = {
						provinces: provinces,
						citys: citys[dVal[0]],
						areas: areas[dVal[0]][dVal[1]]
					};
				};
				this.data = data;
				province = data.provinces[dVal[0]];
				city = data.citys[dVal[1]];
				if (!this.hideArea) {
					area = data.areas[dVal[2]];
					this.checkArr = [province.label, city.label, area.label];
					this.checkValue = [province.value, city.value, area.value];
					this.resultStr = `${province.label} ${city.label} ${area.label}` ;
				} else {
					this.checkArr = [province.label, city.label];
					this.checkValue = [province.value, city.value];
					this.resultStr = `${province.label} ${city.label}`;
				}

				this.$nextTick(() => {
					this.pickVal = [...dVal];
				})
			},

			getRegionVal(value, useCode) {
				let province = value[0];
				let city = value[1];
				let a = 0,
					b = 0,
					c = 0,
					dval = [];
				let _this = this;
				provinces.map((v, k) => {
					if (useCode ? v.value == province : v.label == province) {
						a = k;
					}
				})
				citys[a].map((v, k) => {
					if (useCode ? v.value == city : v.label == city) {
						b = k;
					}
				})
				if (!_this.hideArea) {
					let area = value[2];
					areas[a][b].map((v, k) => {
						if (useCode ? v.value == area : v.label == area) {
							c = k;
						}
					})
					dval = [a, b, c];
				} else {
					dval = [a, b];
				}
				return dval;
			},
			touchStart() {
				if (this.timeout) {
					this.confirmFlag = false;
				}
			},
			touchEnd() {
				if (this.timeout) {
					setTimeout(() => {
						this.confirmFlag = true;
					}, 500)
				}
			},
			bindChange(val) {
				switch (this.mode) {
					case "region":
						this.processingDataByRegion(val.detail.value)
						break;
				}
			},
			// region
			processingDataByRegion(arr) {
				let province, city, area;
				let checkArr = this.checkArr;
				province = this.data.provinces[arr[0]] || this.data.provinces[0];
				city = this.data.citys[arr[1]] || this.data.citys[0];
				if (!this.hideArea) {
					area = this.data.areas[arr[2]] || this.data.areas[0];
				}

				if (province.label != checkArr[0]) {
					this.data.citys = citys[arr[0]] || citys[0];
					if (!this.hideArea) {
						this.data.areas = areas[arr[0]][0] || areas[0][0];
					}
					arr[1] = 0;
					arr[2] = 0;
					city = this.data.citys[arr[1]] || this.data.citys[0];
					if (!this.hideArea) {
						area = this.data.areas[arr[2]] || this.data.areas[0];
					}
				};
				if (city.label != checkArr[1] && !this.hideArea) {
					this.data.areas = areas[arr[0]][arr[1]] || areas[0][0];
					arr[2] = 0;
					area = this.data.areas[arr[2]] || this.data.areas[0];
				};
				if (!this.hideArea) {
					this.checkArr = [province.label, city.label, area.label];
					this.checkValue = [
						this.data.provinces[arr[0]] ? this.data.provinces[arr[0]].value : this.data.provinces[0].value,
						this.data.citys[arr[1]] ? this.data.citys[arr[1]].value : this.data.citys[0].value,
						this.data.areas[arr[2]] ? this.data.areas[arr[2]].value : this.data.areas[0].value
					];
					this.resultStr = `${province.label} ${city.label} ${area.label}`;
				} else {
					this.checkArr = [province.label, city.label];
					this.checkValue = [
						this.data.provinces[arr[0]] ? this.data.provinces[arr[0]].value : this.data.provinces[0].value,
						this.data.citys[arr[1]] ? this.data.citys[arr[1]].value : this.data.citys[0].value
					];
					this.resultStr = `${province.label} ${city.label}}`;
				};
				
				this.$nextTick(() => {
					this.pickVal = arr;
				})
			},
			maskTap(){
				this.$emit("cancel",{
					checkArr:this.checkArr,
					defaultVal:this.pickVal
				});
				this.showPicker = false;
			},
			show() {
				console.log(this.showPicker)
				this.showPicker = true;
			},
			hide() {
				this.showPicker = false;
			},
			pickerCancel() {
				this.$emit("cancel", {
					checkArr: this.checkArr,
					defaultVal: this.pickVal
				});
				this.showPicker = false;
			},
			pickerConfirm(e) {
				if (!this.confirmFlag) {
					return;
				}
				if (this.mode === 'region') {
					this.$emit("confirm", {
						checkArr: [...this.checkArr],
						checkValue: [...this.checkValue],
						defaultVal: [...this.pickVal],
						result: this.resultStr
					});
				}
				this.showPicker = false;
			},
		}
	}
</script>

<style>
	.w-picker {
		position: relative;
		z-index: 888;
	}

	.mask {
		position: fixed;
		z-index: 1000;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.6);
		visibility: hidden;
		opacity: 0;
		transition: all 0.3s ease;
	}

	.mask.show {
		visibility: visible;
		opacity: 1;
	}

	.w-picker-cnt {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		transition: all 0.3s ease;
		transform: translateY(100%);
		z-index: 3000;
	}

	.w-picker-cnt.show {
		transform: translateY(0);
	}

	.w-picker-hd {
		display: flex;
		align-items: center;
		padding: 0 30upx;
		height: 88upx;
		background-color: #fff;
		position: relative;
		text-align: center;
		font-size: 32upx;
		justify-content: space-between;
	}

	.w-picker-btn {
		font-size: 30upx;
	}

	.w-picker-hd:after {
		content: ' ';
		position: absolute;
		left: 0;
		bottom: 0;
		right: 0;
		height: 1px;
		border-bottom: 1px solid #e5e5e5;
		color: #e5e5e5;
		transform-origin: 0 100%;
		transform: scaleY(0.5);
	}

	.w-picker-item {
		text-align: center;
		width: 100%;
		height: 88upx;
		line-height: 88upx;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 30upx;
	}

	.w-picker-view {
		width: 100%;
		height: 476upx;
		overflow: hidden;
		background-color: rgba(255, 255, 255, 1);
		z-index: 666;
	}

	picker-view {
		height: 100%;
	}
</style>
