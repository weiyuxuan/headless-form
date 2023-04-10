import { atom } from 'recoil'
import { FormRules, FormValues } from '../types'

export const rulesState = atom<FormRules>({
  key: 'rules',
  default: {},
  // regex validation needs to mutate the rules object
  dangerouslyAllowMutability: true
})

export const validateValuesState = atom<FormValues>({ key: 'validateValues', default: {} })
