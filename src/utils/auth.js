
const TokenKey = 'access_token';
const ActiveDepartmentKey = 'active_department_key';

export function getToken() {
  return localStorage.getItem(TokenKey);
}

export function setToken(token) {
  return localStorage.setItem(TokenKey, token);
}

export function removeToken() {
  return localStorage.removeItem(TokenKey);
}

// 设置当前激活的部门
export function setActiveDepartment(obj) {
  return localStorage.setItem(ActiveDepartmentKey, JSON.stringify(obj));
}

export function getActiveDepartment() {
  const a = localStorage.getItem(ActiveDepartmentKey);
  return a ? JSON.parse(a) : undefined;
}

export function removeActiveDepartment() {
  return localStorage.removeItem(ActiveDepartmentKey);
}
