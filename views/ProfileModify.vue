<template>
  <div class="profile-container">
    <el-card class="profile-card" shadow="hover">
      <h2 class="profile-title">个人信息修改</h2>
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="80px"
        class="profile-form"
      >
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="form.nickname" placeholder="请输入昵称" clearable />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号" clearable />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱" clearable />
        </el-form-item>
        <el-form-item label="个性签名" prop="signature">
          <el-input v-model="form.signature" type="textarea" :rows="3" placeholder="请输入个性签名" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleModify" :loading="loading">保存修改</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { getProfile, updateProfile } from '../api/user';

const formRef = ref(null);
const loading = ref(false);
const form = reactive({
  nickname: '',
  phone: '',
  email: '',
  signature: ''
});

const rules = reactive({
  nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
  phone: [{ pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }],
  email: [{ type: 'email', message: '邮箱格式不正确', trigger: 'blur' }]
});

onMounted(() => {
  // 加载用户信息
  getProfile().then(res => {
    Object.assign(form, res.data);
  }).catch(err => {
    ElMessage.error("获取信息失败");
  });
});

const handleModify = async () => {
  if (!formRef.value) return;
  await formRef.value.validate();
  loading.value = true;
  try {
    await updateProfile(form);
    ElMessage.success('修改成功');
  } catch (err) {
    ElMessage.error('修改失败');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.profile-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f7fa;
}
.profile-card {
  width: 500px;
  padding: 30px;
}
.profile-title {
  text-align: center;
  margin-bottom: 30px;
  color: #409eff;
}
</style>