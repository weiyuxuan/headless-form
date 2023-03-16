import { atom } from 'recoil'
import { FormErrors } from '../types'

export const errorsState = atom<FormErrors>({ key: 'errors', default: {} })
