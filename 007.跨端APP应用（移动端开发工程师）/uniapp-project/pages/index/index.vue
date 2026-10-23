<template>
	<view class="container">
		<!-- 顶部渐变区域 -->
		<view class="header-gradient">
			<view class="header-decor-circle top-right"></view>
			<view class="header-decor-circle bottom-left"></view>

			<view class="header-content">
				<text class="current-date">{{currentDate}}</text>
			</view>

			<!-- 概览卡片 -->
			<view class="overview-grid">
				<view class="overview-card">
					<text class="overview-label">本月收入</text>
					<text class="overview-amount income">¥{{monthIncomeFormatted}}</text>
				</view>
				<view class="overview-card">
					<text class="overview-label">本月支出</text>
					<text class="overview-amount expense">¥{{monthExpenseFormatted}}</text>
				</view>
				<view class="overview-card balance">
					<text class="overview-label">本月结余</text>
					<text class="overview-amount" :class="monthBalance >= 0 ? 'income' : 'expense'">¥{{monthBalanceFormatted}}</text>
				</view>
			</view>
		</view>

		<!-- 分类支出 -->
		<view class="section">
			<view class="section-title">分类支出</view>
			<view class="category-list" v-if="categorySummary.length > 0">
				<view v-for="cat in categorySummary" :key="cat.id" class="category-item">
					<text class="category-icon">{{cat.icon || '📦'}}</text>
					<text class="category-name">{{cat.name}}</text>
					<text class="category-amount">-¥{{formatAmount(cat.amount)}}</text>
				</view>
			</view>
			<view v-else class="empty-tip">
				<text>暂无支出数据</text>
			</view>
		</view>

		<!-- 最近记账 -->
		<view class="section">
			<view class="section-title">最近记账</view>
			<view class="transaction-list" v-if="recentTransactions.length > 0">
				<view v-for="tx in recentTransactions" :key="tx.id" class="transaction-item">
					<view class="tx-icon-wrapper">
						<text class="tx-icon">{{tx.categoryIcon || '📦'}}</text>
					</view>
					<view class="tx-info">
						<text class="tx-category">{{tx.categoryName}}</text>
						<text class="tx-date">{{tx.date}}</text>
					</view>
					<text class="tx-amount" :class="tx.type">{{tx.type === 'income' ? '+' : '-'}}¥{{formatAmount(tx.amount)}}</text>
				</view>
			</view>
			<view v-else class="empty-tip">
				<text>暂无记账记录</text>
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
			currentDate: '',
			monthIncome: 0,
			monthExpense: 0,
			monthBalance: 0,
			categorySummary: [],
			recentTransactions: []
		}
	},
	computed: {
		monthIncomeFormatted() {
			return this.formatAmount(this.monthIncome)
		},
		monthExpenseFormatted() {
			return this.formatAmount(this.monthExpense)
		},
		monthBalanceFormatted() {
			return this.formatAmount(this.monthBalance)
		}
	},
	onShow() {
		this.loadData()
	},
	methods: {
		formatAmount(amount) {
			const num = parseFloat(amount) || 0
			return num.toLocaleString('zh-CN')
		},
		async loadData() {
			try {
				const data = await API.getHomeData()
				console.log('首页数据:', JSON.stringify(data))

				const now = new Date()
				this.currentDate = now.getFullYear() + '年' + (now.getMonth() + 1) + '月'

				this.monthIncome = data.income || 0
				this.monthExpense = data.expense || 0
				this.monthBalance = (data.income || 0) - (data.expense || 0)

				// 分类汇总（支出最多的3个分类）
				if (data.topCategories && data.topCategories.length > 0) {
					this.categorySummary = data.topCategories.slice(0, 5).map(c => ({
						id: c.id,
						name: c.name,
						icon: c.icon,
						amount: c.total || 0
					}))
				} else {
					this.categorySummary = []
				}

				// 最近交易
				if (data.recentTransactions && data.recentTransactions.length > 0) {
					this.recentTransactions = data.recentTransactions.map(tx => ({
						id: tx.id,
						categoryName: tx.category_name,
						categoryIcon: tx.category_icon,
						amount: tx.amount,
						type: tx.type_name,
						date: tx.transaction_date ? tx.transaction_date.split('-')[1] + '/' + tx.transaction_date.split('-')[2] : ''
					}))
				} else {
					this.recentTransactions = []
				}
			} catch (err) {
				console.error('加载数据失败:', err)
			}
		},
		goToAdd() {
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

.header-gradient {
	background: linear-gradient(135deg, #FFB7C5 0%, #FF8FA3 50%, #C9B8E8 100%);
	padding: 60px 20px 40px;
	border-radius: 0 0 30px 30px;
	position: relative;
	overflow: hidden;
}

.header-decor-circle {
	position: absolute;
	background: rgba(255, 255, 255, 0.3);
	border-radius: 50%;
}

.header-decor-circle.top-right {
	width: 120px;
	height: 120px;
	top: -40px;
	right: -20px;
}

.header-decor-circle.bottom-left {
	width: 80px;
	height: 80px;
	bottom: 0px;
	left: -10px;
	background: rgba(255, 255, 255, 0.2);
}

.header-content {
	position: relative;
	z-index: 1;
	margin-bottom: 20px;
}

.current-date {
	font-size: 14px;
	color: rgba(255, 255, 255, 0.8);
	margin-top: 4px;
	display: block;
}

.overview-grid {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 12px;
	position: relative;
	z-index: 1;
}

.overview-card {
	background: #fff;
	border-radius: 16px;
	padding: 16px;
}

.overview-card.balance {
	grid-column: span 2;
}

.overview-label {
	font-size: 12px;
	color: #8E8E8E;
}

.overview-amount {
	font-size: 20px;
	font-weight: 700;
	margin-top: 4px;
	display: block;
}

.overview-card.balance .overview-amount {
	font-size: 24px;
}

.overview-amount.income {
	color: #7DD3C0;
}

.overview-amount.expense {
	color: #FFA09B;
}

.section {
	padding: 0 20px;
	margin-top: 24px;
}

.section-title {
	font-size: 18px;
	font-weight: 600;
	color: #1B1C1C;
	margin-bottom: 12px;
}

.category-list, .transaction-list {
	background: #fff;
	border-radius: 16px;
	padding: 8px;
}

.category-item {
	display: flex;
	align-items: center;
	gap: 12px;
	padding: 10px 12px;
	background: #FFF0F3;
	border-radius: 12px;
	margin-bottom: 8px;
}

.category-item:last-child {
	margin-bottom: 0;
}

.category-icon {
	font-size: 20px;
}

.category-name {
	flex: 1;
	font-size: 14px;
}

.category-amount {
	font-size: 14px;
	font-weight: 600;
	color: #FFA09B;
}

.transaction-item {
	display: flex;
	align-items: center;
	padding: 14px 0;
	border-bottom: 1px solid #EFEDED;
}

.transaction-item:last-child {
	border-bottom: none;
}

.tx-icon-wrapper {
	width: 40px;
	height: 40px;
	background: #FFF0F3;
	border-radius: 12px;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 12px;
}

.tx-icon {
	font-size: 20px;
}

.tx-info {
	flex: 1;
}

.tx-category {
	font-size: 14px;
	font-weight: 500;
}

.tx-date {
	font-size: 12px;
	color: #8E8E8E;
	margin-top: 2px;
	display: block;
}

.tx-amount {
	font-size: 14px;
	font-weight: 600;
}

.tx-amount.income {
	color: #7DD3C0;
}

.tx-amount.expense {
	color: #FFA09B;
}

.empty-tip {
	padding: 40px;
	text-align: center;
	color: #ccc;
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