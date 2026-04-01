<template>
  <div class="pwd-container">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">修改密码</div>
      </template>

      <el-form ref="pwdFormRef" :model="pwdForm" :rules="pwdRules" label-width="100px">
        <!-- 原密码 → 改为 手机号 -->
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="pwdForm.phone" placeholder="请输入绑定的手机号" />
        </el-form-item>

        <el-form-item label="新密码" prop="newPwd">
          <el-input type="password" v-model="pwdForm.newPwd" placeholder="请输入新密码" />
        </el-form-item>

        <el-form-item label="确认新密码" prop="confirmPwd">
          <el-input type="password" v-model="pwdForm.confirmPwd" placeholder="请再次输入新密码" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSubmit">提交修改</el-button>
          <el-button @click="$router.back()">返回</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'

const pwdFormRef = ref()
const pwdForm = reactive({
  phone: '',
  newPwd: '',
  confirmPwd: ''
})

// 校验规则
const validateConfirmPwd = (rule, value, callback) => {
  if (value !== pwdForm.newPwd) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const pwdRules = reactive({
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
  ],
  newPwd: [
    { required: true, min: 6, message: '密码至少6位', trigger: 'blur' }
  ],
  confirmPwd: [
    { required: true, validator: validateConfirmPwd, trigger: 'blur' }
  ]
})

// 提交修改（验证手机号 + 更新密码）
const handleSubmit = async () => {
  await pwdFormRef.value.validate()
  try {
    await axios.put('http://127.0.0.1:5000/api/user/password', {
      phone: pwdForm.phone,
      newPassword: pwdForm.newPwd
    })
    ElMessage.success('密码修改成功，请重新登录')
    $router.push('/login')
  } catch (err) {
    ElMessage.error('修改失败：' + err.response?.data?.msg || err.message)
  }
}
</script>

<style scoped>
.pwd-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
}
.box-card {
  width: 480px;
}
</style>
