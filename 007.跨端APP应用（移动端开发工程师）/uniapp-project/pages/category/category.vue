<template>
	<view class="container">
		<view class="content">
			<!-- 类型切换 -->
			<view class="type-tabs">
				<view class="type-tab" :class="{active: currentType === 'expense'}" @click="currentType = 'expense'">
					<text>支出分类</text>
				</view>
				<view class="type-tab" :class="{active: currentType === 'income'}" @click="currentType = 'income'">
					<text>收入分类</text>
				</view>
			</view>

			<!-- 分类列表 -->
			<view class="category-list" v-if="categories.length > 0">
				<view v-for="cat in categories" :key="cat.id" class="category-item">
					<text class="category-icon">{{cat.icon}}</text>
					<text class="category-name">{{cat.name}}</text>
					<view class="category-actions">
						<text class="action-btn" @click="editCategory(cat)">编辑</text>
						<text class="action-btn delete" @click="confirmDelete(cat.id)">删除</text>
					</view>
				</view>
			</view>
			<view v-else class="empty">
				<text>暂无分类，点击下方添加</text>
			</view>

			<!-- 添加按钮 -->
			<button class="add-btn" @click="showAddModal = true">
				<text>添加分类</text>
			</button>
		</view>

		<!-- 添加/编辑弹窗 -->
		<view class="modal-overlay" v-if="showAddModal" @click="closeModal">
			<view class="modal" @click.stop>
				<view class="modal-header">
					<text class="modal-title">{{editingCategory ? '编辑分类' : '添加分类'}}</text>
					<text class="modal-close" @click="closeModal">×</text>
				</view>
				<view class="modal-body">
					<view class="form-item">
						<text class="form-label">图标</text>
						<input class="form-input" type="text" v-model="formData.icon" placeholder="如: 🍔" />
					</view>
					<view class="form-item">
						<text class="form-label">名称</text>
						<input class="form-input" type="text" v-model="formData.name" placeholder="如: 餐饮" />
					</view>
					<view class="form-item">
						<text class="form-label">类型</text>
						<view class="type-selector">
							<view class="type-option" :class="{active: formData.type === 'expense'}" @click="formData.type = 'expense'">支出</view>
							<view class="type-option" :class="{active: formData.type === 'income'}" @click="formData.type = 'income'">收入</view>
						</view>
					</view>
				</view>
				<view class="modal-actions">
					<button class="cancel-btn" @click="closeModal">取消</button>
					<button class="save-btn" @click="saveCategory">保存</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import API from '../../js/api.js'

export default {
	data() {
		return {
			currentType: 'expense',
			categories: [],
			showAddModal: false,
			editingCategory: null,
			formData: {
				icon: '',
				name: '',
				type: 'expense'
			}
		}
	},
	onShow() {
		this.loadCategories()
	},
	methods: {
		async loadCategories() {
			try {
				const data = await API.getCategories(this.currentType)
				this.categories = data || []
			} catch (err) {
				console.error('加载分类失败:', err)
			}
		},
		editCategory(cat) {
			this.editingCategory = cat
			this.formData = {
				icon: cat.icon,
				name: cat.name,
				type: cat.type
			}
			this.showAddModal = true
		},
		confirmDelete(id) {
			uni.showModal({
				title: '确认删除',
				content: '确定要删除该分类吗？',
				success: (res) => {
					if (res.confirm) {
						this.deleteCategory(id)
					}
				}
			})
		},
		async deleteCategory(id) {
			try {
				await API.deleteCategory(id)
				uni.showToast({
					title: '删除成功',
					icon: 'success'
				})
				this.loadCategories()
			} catch (err) {
				uni.showToast({
					title: '删除失败',
					icon: 'none'
				})
			}
		},
		closeModal() {
			this.showAddModal = false
			this.editingCategory = null
			this.formData = {
				icon: '',
				name: '',
				type: 'expense'
			}
		},
		async saveCategory() {
			if (!this.formData.name) {
				uni.showToast({
					title: '请填写名称',
					icon: 'none'
				})
				return
			}

			try {
				if (this.editingCategory) {
					await API.updateCategory(this.editingCategory.id, this.formData)
				} else {
					await API.addCategory(this.formData)
				}
				uni.showToast({
					title: '保存成功',
					icon: 'success'
				})
				this.closeModal()
				this.loadCategories()
			} catch (err) {
				uni.showToast({
					title: '保存失败',
					icon: 'none'
				})
			}
		}
	},
	watch: {
		currentType() {
			this.loadCategories()
		}
	}
}
</script>

<style>
.container {
	min-height: 100vh;
	background: #FFF9F5;
}

.content {
	padding: 20px;
	margin-top: -20px;
}

.type-tabs {
	display: flex;
	gap: 12px;
	margin-bottom: 16px;
}

.type-tab {
	flex: 1;
	padding: 12px;
	text-align: center;
	border-radius: 8px;
	background: #fff;
	font-size: 14px;
	color: #999;
}

.type-tab.active {
	background: linear-gradient(135deg, #FFB7C5, #FF8FA3);
	color: #fff;
}

.category-list {
	background: #fff;
	border-radius: 16px;
	overflow: hidden;
	margin-bottom: 16px;
}

.category-item {
	display: flex;
	align-items: center;
	padding: 16px;
	border-bottom: 1px solid #f5f5f5;
}

.category-item:last-child {
	border-bottom: none;
}

.category-icon {
	font-size: 24px;
	margin-right: 12px;
}

.category-name {
	flex: 1;
	font-size: 15px;
	color: #2D2D2D;
}

.category-actions {
	display: flex;
	gap: 12px;
}

.action-btn {
	font-size: 13px;
	color: #FF8FA3;
}

.action-btn.delete {
	color: #FF6B6B;
}

.empty {
	padding: 40px;
	text-align: center;
	color: #ccc;
}

.add-btn {
	width: 100%;
	padding: 14px;
	background: linear-gradient(135deg, #FFB7C5, #FF8FA3);
	color: #fff;
	font-weight: 600;
	border-radius: 12px;
	border: none;
	font-size: 16px;
}

.modal-overlay {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.5);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 999;
}

.modal {
	background: #fff;
	border-radius: 16px;
	width: 85%;
	max-width: 300px;
}

.modal-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 16px;
	border-bottom: 1px solid #eee;
}

.modal-title {
	font-size: 16px;
	font-weight: 600;
}

.modal-close {
	font-size: 24px;
	color: #999;
}

.modal-body {
	padding: 16px;
}

.form-item {
	margin-bottom: 16px;
}

.form-label {
	font-size: 14px;
	color: #999;
	display: block;
	margin-bottom: 8px;
}

.form-input {
	width: 100%;
	padding: 12px;
	background: #f5f5f5;
	border-radius: 8px;
	font-size: 15px;
}

.type-selector {
	display: flex;
	gap: 8px;
}

.type-option {
	flex: 1;
	padding: 10px;
	text-align: center;
	border-radius: 8px;
	background: #f5f5f5;
	font-size: 14px;
	color: #999;
}

.type-option.active {
	background: #FF8FA3;
	color: #fff;
}

.modal-actions {
	display: flex;
	gap: 12px;
	padding: 16px;
	border-top: 1px solid #eee;
}

.cancel-btn {
	flex: 1;
	padding: 12px;
	background: #f5f5f5;
	color: #999;
	border-radius: 8px;
	border: none;
	font-size: 15px;
}

.save-btn {
	flex: 1;
	padding: 12px;
	background: linear-gradient(135deg, #FFB7C5, #FF8FA3);
	color: #fff;
	border-radius: 8px;
	border: none;
	font-size: 15px;
}
</style>