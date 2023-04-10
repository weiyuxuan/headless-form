import { atom } from 'recoil'
import { FormMeta, FieldMeta } from '../types'

export const DefaultFormMeta = {
  isTouched: false,
  isSubmitting: false,
  isSubmitted: false,
  submissionAttempts: 0
}

export const DefaultFieldMeta = {
  error: '',
  isTouched: false,
  isValidating: false
}

export const formIdState = atom<string>({ key: 'formId', default: '' })

export const formMetaState = atom<FormMeta>({ key: 'formMeta', default: DefaultFormMeta })

export const fieldMetaState = atom<{ [field: string]: FieldMeta }>({ key: 'fieldMeta', default: {} })
