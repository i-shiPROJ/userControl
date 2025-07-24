export interface User {
  id: number;
  labels: string; // строка, вводимая пользователем (метки через ;)
  type: 'LDAP' | 'Локальная';
  login: string;
  password: string | null;
  isValid?: boolean; // для валидации в UI
  labelsArray?: { text: string }[]; // для преобразования меток
}
