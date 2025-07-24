import { defineStore } from "pinia";

export interface Account {
  id: number;
  labels: string;
  type: 'LDAP' | 'Локальная';
  login: string;
  password: string | null;
}

function loadAccounts(): Account[] {
  const raw = localStorage.getItem('accounts');
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveAccountsToStorage(accounts: Account[]) {
  localStorage.setItem('accounts', JSON.stringify(accounts));
}

export const useUserStore = defineStore('user', {
  state: () => ({
    accounts: loadAccounts() as Account[]
  }),
  actions: {

    getAccounts(): Account[] {
      return this.accounts;
    },

    saveAccounts(accounts: Account[]) {
      this.accounts = accounts;
      saveAccountsToStorage(accounts);
    },

    addAccount(account: Account) {
      this.accounts.push(account);
      saveAccountsToStorage(this.accounts);
    },

    removeAccount(id: number) {
      this.accounts = this.accounts.filter(acc => acc.id !== id);
      saveAccountsToStorage(this.accounts);
    },

    updateAccount(updated: Account) {
      const idx = this.accounts.findIndex(acc => acc.id === updated.id);
      if (idx !== -1) {
        this.accounts[idx] = { ...updated };
        saveAccountsToStorage(this.accounts);
      }
    },

    clearAccounts() {
      this.accounts = [];
      saveAccountsToStorage(this.accounts);
    }
  }
});
