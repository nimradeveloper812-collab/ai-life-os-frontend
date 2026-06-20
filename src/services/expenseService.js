import axios from 'axios'

const BASE_URL = 'http://localhost:5020/api/Expense'

export const getExpenses = () => axios.get(BASE_URL)
export const createExpense = (data) => axios.post(BASE_URL, data)
export const updateExpense = (id, data) => axios.put(`${BASE_URL}/${id}`, data)
export const deleteExpense = (id) => axios.delete(`${BASE_URL}/${id}`)