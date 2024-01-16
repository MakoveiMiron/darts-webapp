import { jwtDecode } from 'jwt-decode';
import { API_URL } from '../constans/constans'

export default {
  userLogin(formData) {
    console.log(formData);
    return fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    }).then((resp) => resp.json());
  },
  userRegister(formData) {
    return fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
  },
};

export const createAuthInit = () => {
    const token = localStorage.getItem('accessToken');
  try {
    const user = jwtDecode(token);
    return { accessToken: token, user };
  } catch {
    return { accessToken: null };
  }
}