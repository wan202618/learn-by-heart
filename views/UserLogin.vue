<template>
  <div class="auth-container">
    <el-card class="auth-card" shadow="hover">
      <h2 class="auth-title">用户登录</h2>
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="80px"
        class="auth-form"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" clearable />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" type="password" placeholder="请输入密码" show-password clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="auth-btn" @click="handleLogin" :loading="loading">
            登录
          </el-button>
          <el-button class="auth-btn-secondary" @click="goToRegister">
            没有账号？去注册
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { login } from '../api/user.js'

const router = useRouter()
const formRef = ref(null)
const loading = ref(false)

const form = reactive({
  username: '',
  password: ''
})

const rules = reactive({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
})

const handleLogin = async () => {
  if (!formRef.value) return
  await formRef.value.validate()
  loading.value = true
  try {
    const res = await login(form)
    localStorage.setItem('token', res.data.token)
    ElMessage.success('登录成功')
    router.push('/profile')
  } catch (err) {
    ElMessage.error(err.message || '登录失败')
  } finally {
    loading.value = false
  }
}

const goToRegister = () => {
  router.push('/register')
}
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f7fa;
}
.auth-card {
  width: 420px;
  padding: 30px;
}
.auth-title {
  text-align: center;
  margin-bottom: 30px;
  color: #409eff;
}
.auth-form {
  margin-top: 20px;
}
.auth-btn {
  width: 100%;
  margin-bottom: 15px;
}
.auth-btn-secondary {
  width: 100%;
  color: #409eff;
  background-color: transparent;
  border: 1px solid #409eff;
}
</style>