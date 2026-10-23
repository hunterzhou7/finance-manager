<template>
	<view class="container">
		<view class="content">
			<!-- 年份选择 -->
			<view class="year-select-wrapper">
				<picker class="year-select" :value="year" :range="years" @change="onYearChange">
					<text>{{year}}年</text>
				</picker>
			</view>

			<!-- 年度概览 -->
			<view class="overview-card">
				<view class="overview-item">
					<text class="overview-label">收入</text>
					<text class="overview-value income">¥{{yearIncomeFormatted}}</text>
				</view>
				<view class="overview-item">
					<text class="overview-label">支出</text>
					<text class="overview-value expense">¥{{yearExpenseFormatted}}</text>
				</view>
				<view class="overview-item">
					<text class="overview-label">结余</text>
					<text class="overview-value" :class="yearBalance >= 0 ? 'income' : 'expense'">¥{{yearBalanceFormatted}}</text>
				</view>
			</view>

			<!-- 支出分类饼图 -->
			<view class="section-card">
				<view class="section-title">支出分类</view>
				<view class="expense-chart">
					<view class="pie-wrapper">
						<canvas canvas-id="pieCanvas" class="pie-canvas"></canvas>
					</view>
					<view class="legend">
						<view v-for="(cat, index) in categoryStats" :key="cat.id" class="legend-item">
							<view class="legend-dot" :style="{background: getColor(index)}"></view>
							<text class="legend-name">{{cat.icon}} {{cat.name}}</text>
							<text class="legend-value">¥{{formatAmount(cat.total)}}</text>
						</view>
					</view>
				</view>
			</view>

			<!-- 趋势图 -->
			<view class="section-card">
				<view class="section-title">收支趋势</view>
				<view class="trend-header">
					<view class="trend-legend">
						<view class="trend-dot income"></view>
						<text>收入</text>
					</view>
					<view class="trend-legend">
						<view class="trend-dot expense"></view>
						<text>支出</text>
					</view>
				</view>
				<view class="trend-canvas-wrap">
					<canvas canvas-id="trendCanvas" class="trend-canvas"></canvas>
				</view>
				<view class="trend-labels">
					<text>1月</text>
					<text>2月</text>
					<text>3月</text>
					<text>4月</text>
					<text>5月</text>
					<text>6月</text>
					<text>7月</text>
					<text>8月</text>
					<text>9月</text>
					<text>10月</text>
					<text>11月</text>
					<text>12月</text>
				</view>
			</view>
		</view>

		<!-- 悬浮按钮 -->
		<view class="fab-button" @click="goToAdd">
			<text class="fab-icon">+</text>
		</view>
	</view>
</template>

<script>
import API from '../../js/api.js'

export default {
	data() {
		return {
			year: new Date().getFullYear(),
			years: ['2026', '2025', '2024', '2023', '2022', '2021', '2020'],
			yearIncome: 0,
			yearExpense: 0,
			categoryStats: [],
			monthlyData: [],
			colors: ['#FFB7C5', '#FF8FA3', '#C9B8E8', '#7DD3C0', '#FFA09B', '#FFD93D', '#6BCB77', '#FF6B6B']
		}
	},
	computed: {
		yearBalance: function() {
			return (this.yearIncome || 0) - (this.yearExpense || 0)
		},
		yearIncomeFormatted: function() {
			return this.formatAmount(this.yearIncome)
		},
		yearExpenseFormatted: function() {
			return this.formatAmount(this.yearExpense)
		},
		yearBalanceFormatted: function() {
			return this.formatAmount(this.yearBalance)
		}
	},
	onShow: function() {
		this.loadStatistics()
	},
	methods: {
		formatAmount: function(amount) {
			var num = parseFloat(amount) || 0
			return num.toLocaleString('zh-CN')
		},
		getColor: function(index) {
			return this.colors[index % this.colors.length]
		},
		loadStatistics: function() {
			var that = this
			API.getStatistics(this.year).then(function(res) {
				that.yearIncome = res.yearIncome || 0
				that.yearExpense = res.yearExpense || 0
				that.categoryStats = res.categoryStats || []
				that.monthlyData = res.monthlyData || []

				setTimeout(function() {
					that.drawPieChart()
					that.drawTrendChart()
				}, 300)
			}).catch(function(err) {
				console.error('加载统计数据失败:', err)
			})
		},
		drawPieChart: function() {
			var that = this
			var ctx = uni.createCanvasContext('pieCanvas', this)
			if (!ctx) {
				console.log('饼图Canvas上下文创建失败')
				return
			}

			var data = this.categoryStats
			if (!data || data.length === 0) {
				ctx.setFillStyle('#f0f0f0')
				ctx.arc(60, 60, 50, 0, 2 * Math.PI)
				ctx.fill()
				ctx.draw()
				return
			}

			var total = 0
			data.forEach(function(c) {
				total += parseFloat(c.total) || 0
			})

			if (total === 0) {
				ctx.setFillStyle('#f0f0f0')
				ctx.arc(60, 60, 50, 0, 2 * Math.PI)
				ctx.fill()
				ctx.draw()
				return
			}

			var cx = 60
			var cy = 60
			var radius = 50
			var startAngle = -Math.PI / 2

			data.forEach(function(cat, i) {
				var value = parseFloat(cat.total) || 0
				var sliceAngle = (value / total) * 2 * Math.PI
				var endAngle = startAngle + sliceAngle
				var color = that.colors[i % that.colors.length]

				ctx.beginPath()
				ctx.moveTo(cx, cy)
				ctx.arc(cx, cy, radius, startAngle, endAngle)
				ctx.closePath()
				ctx.setFillStyle(color)
				ctx.fill()

				startAngle = endAngle
			})

			ctx.beginPath()
			ctx.arc(cx, cy, 20, 0, 2 * Math.PI)
			ctx.setFillStyle('#ffffff')
			ctx.fill()

			ctx.draw()
		},
		drawTrendChart: function() {
			var ctx = uni.createCanvasContext('trendCanvas', this)
			if (!ctx) {
				console.log('趋势图Canvas上下文创建失败')
				return
			}

			var data = this.monthlyData
			if (!data || data.length === 0) {
				ctx.draw()
				return
			}

			var width = 280
			var height = 140
			var padding = 25

			var maxVal = 1
			data.forEach(function(m) {
				var val = Math.max(parseFloat(m.income) || 0, parseFloat(m.expense) || 0)
				if (val > maxVal) maxVal = val
			})

			var chartWidth = width - padding * 2
			var chartHeight = height - padding

			ctx.setStrokeStyle('#f0f0f0')
			ctx.setLineWidth(1)
			for (var i = 0; i <= 4; i++) {
				var y = padding + (chartHeight / 4) * i
				ctx.beginPath()
				ctx.moveTo(padding, y)
				ctx.lineTo(width - padding, y)
				ctx.stroke()
			}

			var incomePts = []
			data.forEach(function(m, i) {
				var x = padding + (i / 11) * chartWidth
				var y = padding + chartHeight - ((parseFloat(m.income) || 0) / maxVal) * chartHeight
				incomePts.push({x: x, y: y})
			})

			var expensePts = []
			data.forEach(function(m, i) {
				var x = padding + (i / 11) * chartWidth
				var y = padding + chartHeight - ((parseFloat(m.expense) || 0) / maxVal) * chartHeight
				expensePts.push({x: x, y: y})
			})

			if (incomePts.length > 0) {
				ctx.beginPath()
				ctx.moveTo(incomePts[0].x, padding + chartHeight)
				incomePts.forEach(function(p) { ctx.lineTo(p.x, p.y) })
				ctx.lineTo(incomePts[incomePts.length - 1].x, padding + chartHeight)
				ctx.closePath()
				ctx.setFillStyle('rgba(125, 211, 192, 0.2)')
				ctx.fill()

				ctx.beginPath()
				ctx.moveTo(incomePts[0].x, incomePts[0].y)
				incomePts.forEach(function(p) { ctx.lineTo(p.x, p.y) })
				ctx.setStrokeStyle('#7DD3C0')
				ctx.setLineWidth(2)
				ctx.stroke()

				incomePts.forEach(function(p) {
					ctx.beginPath()
					ctx.arc(p.x, p.y, 4, 0, 2 * Math.PI)
					ctx.setFillStyle('#7DD3C0')
					ctx.fill()
				})
			}

			if (expensePts.length > 0) {
				ctx.beginPath()
				ctx.moveTo(expensePts[0].x, padding + chartHeight)
				expensePts.forEach(function(p) { ctx.lineTo(p.x, p.y) })
				ctx.lineTo(expensePts[expensePts.length - 1].x, padding + chartHeight)
				ctx.closePath()
				ctx.setFillStyle('rgba(255, 160, 155, 0.2)')
				ctx.fill()

				ctx.beginPath()
				ctx.moveTo(expensePts[0].x, expensePts[0].y)
				expensePts.forEach(function(p) { ctx.lineTo(p.x, p.y) })
				ctx.setStrokeStyle('#FFA09B')
				ctx.setLineWidth(2)
				ctx.stroke()

				expensePts.forEach(function(p) {
					ctx.beginPath()
					ctx.arc(p.x, p.y, 4, 0, 2 * Math.PI)
					ctx.setFillStyle('#FFA09B')
					ctx.fill()
				})
			}

			ctx.draw()
		},
		onYearChange: function(e) {
			this.year = parseInt(this.years[e.detail.value])
			this.loadStatistics()
		},
		goToAdd: function() {
			uni.navigateTo({
				url: '/pages/add/add'
			})
		}
	}
}
</script>

<style>
.container {
	min-height: 100vh;
	background: #FFF9F5;
	padding-bottom: 100px;
}

.content {
	padding: 20px;
	margin-top: -20px;
}

.year-select-wrapper {
	margin-bottom: 16px;
}

.year-select {
	display: inline-block;
	padding: 8px 16px;
	background: #fff;
	border: 1px solid #E5E5E5;
	border-radius: 12px;
	font-size: 16px;
}

.overview-card {
	background: #fff;
	border-radius: 16px;
	padding: 20px;
	display: flex;
	justify-content: space-around;
	text-align: center;
	margin-bottom: 16px;
	box-shadow: 0 4px 12px rgba(255, 183, 197, 0.15);
}

.overview-item {
	flex: 1;
}

.overview-label {
	font-size: 12px;
	color: #8E8E8E;
	display: block;
}

.overview-value {
	font-size: 18px;
	font-weight: 700;
	margin-top: 4px;
	display: block;
}

.overview-value.income {
	color: #7DD3C0;
}

.overview-value.expense {
	color: #FFA09B;
}

.section-card {
	background: #fff;
	border-radius: 16px;
	padding: 16px;
	margin-bottom: 16px;
	box-shadow: 0 4px 12px rgba(255, 183, 197, 0.15);
}

.section-title {
	font-size: 16px;
	font-weight: 600;
	color: #1B1C1C;
	margin-bottom: 16px;
}

.expense-chart {
	display: flex;
	align-items: center;
}

.pie-wrapper {
	width: 120px;
	height: 120px;
	flex-shrink: 0;
}

.pie-canvas {
	width: 120px;
	height: 120px;
}

.legend {
	flex: 1;
	padding-left: 12px;
}

.legend-item {
	display: flex;
	align-items: center;
	gap: 8px;
	margin-bottom: 8px;
}

.legend-dot {
	width: 10px;
	height: 10px;
	border-radius: 2px;
}

.legend-name {
	flex: 1;
	font-size: 13px;
	color: #2D2D2D;
}

.legend-value {
	font-size: 13px;
	color: #666;
}

.trend-header {
	display: flex;
	justify-content: center;
	gap: 20px;
	margin-bottom: 12px;
}

.trend-legend {
	display: flex;
	align-items: center;
	gap: 6px;
	font-size: 12px;
	color: #666;
}

.trend-dot {
	width: 8px;
	height: 8px;
	border-radius: 50%;
}

.trend-dot.income {
	background: #7DD3C0;
}

.trend-dot.expense {
	background: #FFA09B;
}

.trend-canvas-wrap {
	height: 140px;
	width: 100%;
}

.trend-canvas {
	width: 100%;
	height: 140px;
}

.trend-labels {
	display: flex;
	justify-content: space-between;
	padding: 0 20px;
	margin-top: 4px;
}

.trend-labels text {
	font-size: 10px;
	color: #999;
}

.fab-button {
	position: fixed;
	bottom: 0px;
	left: 50%;
	transform: translateX(-50%);
	width: 56px;
	height: 56px;
	background: linear-gradient(135deg, #FFB7C5 0%, #FF8FA3 100%);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 8px 20px rgba(255, 143, 163, 0.4);
	z-index: 100;
}

.fab-icon {
	font-size: 28px;
	color: #fff;
	font-weight: 300;
}
</style>