<template>
  <div class="user-controller">
    <el-button type="primary" @click="addAccount">Добавить учетную запись</el-button>
    <div v-for="(account, idx) in accounts" :key="account.id" class="account-form">
      <el-form :model="account" ref="forms" label-width="120px" @change="onChange(idx)">
        <el-form-item label="Метка" prop="labels"
          :error="account.isValid === false && !validateLabels(account.labels) ? 'Максимум 50 символов, разделяйте ;' : ''">
          <el-input v-model="account.labels" :maxlength="50" placeholder="Введите метки через ;" @blur="onBlur(idx)" />
        </el-form-item>
        <el-form-item label="Тип записи" prop="type">
          <el-select v-model="account.type" @change="onTypeChange(idx)">
            <el-option label="LDAP" value="LDAP" />
            <el-option label="Локальная" value="Локальная" />
          </el-select>
        </el-form-item>
        <el-form-item label="Логин" prop="login"
          :error="account.isValid === false && !validateLogin(account.login) ? 'Обязательное поле, максимум 100 символов' : ''">
          <el-input v-model="account.login" :maxlength="100" @blur="onBlur(idx)" />
        </el-form-item>
        <el-form-item v-if="account.type === 'Локальная'" label="Пароль" prop="password"
          :error="account.isValid === false && !validatePassword(account.password) ? 'Обязательное поле, максимум 100 символов' : ''">
          <el-input v-model="account.password" :maxlength="100" show-password @blur="onBlur(idx)" />
        </el-form-item>
        <el-button type="danger" @click="removeAccount(idx)">Удалить</el-button>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useUserStore } from '@/stores/usercontrol';
import type { User } from '@/types/user.interface';

const userStore = useUserStore();
const accounts = ref<User[]>([]);

onMounted(() => {
  const loaded = userStore.getAccounts();
  accounts.value = loaded.filter(acc => isAccountValid(acc));
});

watch(accounts, (newVal) => {
  // Сохраняем только валидные аккаунты
  const validAccounts = newVal.filter(acc => isAccountValid(acc));
  userStore.saveAccounts(validAccounts);
}, { deep: true });

function addAccount() {
  accounts.value.push({
    id: Date.now(),
    labels: '',
    type: 'LDAP',
    login: '',
    password: null,
    isValid: true,
  });
}

function removeAccount(idx: number) {
  accounts.value.splice(idx, 1);
}

function onTypeChange(idx: number) {
  if (accounts.value[idx].type === 'LDAP') {
    accounts.value[idx].password = null;
  }
  validateAndSave(idx);
}

function onBlur(idx: number) {
  validateAndSave(idx);
}

function onChange(idx: number) {
  validateAndSave(idx);
}

function validateLabels(labels: string) {
  return labels.length <= 50;
}
function validateLogin(login: string) {
  return !!login && login.length <= 100;
}
function validatePassword(password: string | null) {
  return password !== null && password.length > 0 && password.length <= 100;
}

function isAccountValid(acc: User) {
  if (!validateLogin(acc.login)) return false;
  if (acc.type === 'Локальная' && !validatePassword(acc.password)) return false;
  if (!validateLabels(acc.labels)) return false;
  return true;
}

function validateAndSave(idx: number) {
  const acc = accounts.value[idx];
  const valid = isAccountValid(acc);
  acc.isValid = valid;
  if (valid) {
    acc.labelsArray = acc.labels.split(';').map(l => l.trim()).filter(Boolean).map(text => ({ text }));
    // Сохраняем только валидные аккаунты
    const validAccounts = accounts.value.filter(a => isAccountValid(a));
    userStore.saveAccounts(validAccounts);
  }
}
</script>

<style scoped>
.user-controller {
  margin-top: 5px;

  .account-form {
    margin: 24px 0px;
    border: 1px solid #eee;
    padding: 16px;
    border-radius: 8px;
  }
}
</style>
