import axios from 'axios'

const BASE_URL = 'https://ai-life-os-backend-cuc9.onrender.com/api'

const getHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
})

const userId = () => localStorage.getItem('userId')

export const getExpenses = () => axios.get(`${BASE_URL}/Expense/user/${userId()}`, getHeaders())
export const createExpense = (data) => axios.post(`${BASE_URL}/Expense`, { ...data, userId: Number(userId()) }, getHeaders())
export const updateExpense = (id, data) => axios.put(`${BASE_URL}/Expense/${id}`, data, getHeaders())
export const deleteExpense = (id) => axios.delete(`${BASE_URL}/Expense/${id}`, getHeaders())

export const getTasks = () => axios.get(`${BASE_URL}/Task/user/${userId()}`, getHeaders())
export const createTask = (data) => axios.post(`${BASE_URL}/Task`, { ...data, userId: Number(userId()) }, getHeaders())
export const updateTask = (id, data) => axios.put(`${BASE_URL}/Task/${id}`, data, getHeaders())
export const deleteTask = (id) => axios.delete(`${BASE_URL}/Task/${id}`, getHeaders())

export const getGoals = () => axios.get(`${BASE_URL}/Goal/user/${userId()}`, getHeaders())
export const createGoal = (data) => axios.post(`${BASE_URL}/Goal`, { ...data, userId: Number(userId()) }, getHeaders())
export const updateGoal = (id, data) => axios.put(`${BASE_URL}/Goal/${id}`, data, getHeaders())
export const deleteGoal = (id) => axios.delete(`${BASE_URL}/Goal/${id}`, getHeaders())