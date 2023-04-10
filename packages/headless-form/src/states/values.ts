import { atom } from 'recoil'
import { FormValues } from '../types'

export const valuesState = atom<FormValues>({ key: 'values', default: {} })

export const defaultValuesState = atom<FormValues>({ key: 'defaultValues', default: {} })
