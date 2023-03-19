import { setAutoFreeze } from 'immer'

import useField from './hooks/useField'
import useFormProvider from './hooks/useFormProvider'
import useForm from './hooks/useForm'
import useFormContext from './hooks/useFormContext'
import useFormMeta from './hooks/useFormMeta'
import useFormValues from './hooks/useFormValues'
import useFormValidators from './hooks/useFormValidators'
import useFormErrors from './hooks/useFormErrors'

import createFormProvider from './hoc/createFormProvider'

import { splitFormProps } from './utils'

setAutoFreeze(false)

export * from './types'

export {
  useField,
  useFormProvider,
  useForm,
  useFormContext,
  useFormMeta,
  useFormValues,
  useFormValidators,
  useFormErrors,

  createFormProvider,

  splitFormProps
}
