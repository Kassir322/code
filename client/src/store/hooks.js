'use client'

import { useDispatch, useSelector, useStore } from 'react-redux'

/**
 * Хук для получения объекта dispatch из Redux хранилища
 * Используйте этот хук вместо обычного useDispatch для лучшей типизации
 * @returns {Function} dispatch функция из Redux
 */
export const useAppDispatch = () => useDispatch()

/**
 * Хук для выбора данных из Redux хранилища
 * Используйте этот хук вместо обычного useSelector для лучшей типизации и автодополнения
 * @template T
 * @param {Function} selector функция выбора данных из хранилища
 * @returns {T} выбранные данные
 */
export const useAppSelector = useSelector

/**
 * Хук для получения текущего экземпляра хранилища Redux
 * Полезен для доступа к store напрямую в клиентских компонентах
 * @returns {Object} текущий экземпляр Redux хранилища
 */
export const useAppStore = useStore
