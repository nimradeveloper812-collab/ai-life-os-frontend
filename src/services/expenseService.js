import axios from 'axios'

const BASE_URL = 'https://ai-life-os-backend-cuc9.onrender.com/api/Expense'

export const getExpenses = () => axios.get(BASE_URL)
export const createExpense = (data) => axios.post(BASE_URL, data)
export const updateExpense = (id, data) => axios.put(`${BASE_URL}/${id}`, data)
export const deleteExpense = (id) => axios.delete(`${BASE_URL}/${id}`)