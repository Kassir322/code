import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as authService from '@/lib/auth'

// Начальное состояние для слайса авторизации
const initialState = {
	user: null,
	token: null,
	isAuthenticated: false,
	isLoading: false,
	error: null,
}

// Асинхронный thunk для регистрации пользователя
export const registerUser = createAsyncThunk(
	'auth/register',
	async (userData, { rejectWithValue }) => {
		try {
			const response = await authService.registerUser(userData)
			return response
		} catch (error) {
			return rejectWithValue(error.message)
		}
	}
)

// Асинхронный thunk для входа пользователя
export const loginUser = createAsyncThunk(
	'auth/login',
	async (credentials, { rejectWithValue }) => {
		try {
			const response = await authService.loginUser(credentials)
			return response
		} catch (error) {
			return rejectWithValue(error.message)
		}
	}
)

// Асинхронный thunk для выхода пользователя
export const logoutUser = createAsyncThunk(
	'auth/logout',
	async (_, { rejectWithValue }) => {
		try {
			authService.logoutUser()
			return true
		} catch (error) {
			return rejectWithValue(error.message)
		}
	}
)

// Асинхронный thunk для получения текущего пользователя
export const fetchCurrentUser = createAsyncThunk(
	'auth/fetchCurrentUser',
	async (_, { rejectWithValue }) => {
		try {
			const isValid = await authService.validateToken()

			if (!isValid) {
				authService.logoutUser()
				return null
			}

			const user = authService.getCurrentUser()
			return user ? { user, token: localStorage.getItem('token') } : null
		} catch (error) {
			return rejectWithValue(error.message)
		}
	}
)

// Создаем слайс для авторизации
const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		// Сбрасываем состояние ошибки
		clearError: (state) => {
			state.error = null
		},
		// Устанавливаем состояние загрузки
		setLoading: (state, action) => {
			state.isLoading = action.payload
		},
	},
	extraReducers: (builder) => {
		// Обработка регистрации
		builder
			.addCase(registerUser.pending, (state) => {
				state.isLoading = true
				state.error = null
			})
			.addCase(registerUser.fulfilled, (state) => {
				state.isLoading = false
				// Регистрация успешна, но пользователь еще не авторизован
			})
			.addCase(registerUser.rejected, (state, action) => {
				state.isLoading = false
				state.error = action.payload
			})

		// Обработка входа
		builder
			.addCase(loginUser.pending, (state) => {
				state.isLoading = true
				state.error = null
			})
			.addCase(loginUser.fulfilled, (state, action) => {
				state.isLoading = false
				state.isAuthenticated = true
				state.user = action.payload.user
				state.token = action.payload.jwt
			})
			.addCase(loginUser.rejected, (state, action) => {
				state.isLoading = false
				state.error = action.payload
			})

		// Обработка выхода
		builder
			.addCase(logoutUser.pending, (state) => {
				state.isLoading = true
			})
			.addCase(logoutUser.fulfilled, (state) => {
				// Сбрасываем состояние до начального
				return initialState
			})
			.addCase(logoutUser.rejected, (state, action) => {
				state.isLoading = false
				state.error = action.payload
			})

		// Обработка получения текущего пользователя
		builder
			.addCase(fetchCurrentUser.pending, (state) => {
				state.isLoading = true
				state.error = null
			})
			.addCase(fetchCurrentUser.fulfilled, (state, action) => {
				state.isLoading = false

				if (action.payload) {
					state.isAuthenticated = true
					state.user = action.payload.user
					state.token = action.payload.token
				} else {
					state.isAuthenticated = false
					state.user = null
					state.token = null
				}
			})
			.addCase(fetchCurrentUser.rejected, (state, action) => {
				state.isLoading = false
				state.error = action.payload
				state.isAuthenticated = false
				state.user = null
				state.token = null
			})
	},
})

// Экспортируем действия
export const { clearError, setLoading } = authSlice.actions

// Экспортируем селекторы
export const selectCurrentUser = (state) => state.auth.user
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated
export const selectIsLoading = (state) => state.auth.isLoading
export const selectAuthError = (state) => state.auth.error

// Экспортируем редьюсер
export default authSlice.reducer
