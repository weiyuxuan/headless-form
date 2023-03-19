import { useEffect, useCallback } from 'react'

import useFormValues from './useFormValues'
import useFormMeta from './useFormMeta'
import useFormValidators from './useFormValidators'
import useFormContext from './useFormContext'

import { FormValues, FormMeta, FieldMeta, FormInstance } from '../types'

export default function useForm<Vs extends FormValues, M extends FormMeta, N extends FieldMeta> (
  options: {
    defaultValues?: Vs
    onSubmit?: (values: Vs) => void | Promise<void>
    validate?: (values: Vs) => string | false | undefined | Promise<string | false | undefined>
    validatePristine?: boolean
  } = {}
): FormInstance<Vs, M, N> {
  const {
    defaultValues,
    onSubmit,
    validate,
    validatePristine = false
  } = options

  const { values, setValues, setDefaultValues } = useFormValues<Vs>()
  const { setFormMeta, setFieldMeta: originSetFieldMeta } = useFormMeta<M, N>()
  const { validate: originValidate } = useFormValidators<Vs>()

  const form = useFormContext<Vs, M, N>()

  const { meta } = form

  const runValidation = useCallback(async () => {
    if (!validate) return

    setFormMeta((draft) => {
      draft.isValidating = true
    })
    const error = await validate(values)
    setFormMeta((draft) => {
      draft.error = error && typeof error === 'string' ? error : ''
      draft.isValidating = false
    })
    return error
  }, [setFormMeta, validate, JSON.stringify(values)])

  const handleSubmit = useCallback(async (e?: any) => {
    if (e.persist) e.persist()
    if (e.preventDefault) e.preventDefault()

    if (!meta.isValid) {
      setFormMeta('isSubmitting', false)
      return
    }

    setFormMeta('isSubmitting', true)

    // execute field validation and form validation
    setFormMeta('isValidating', true)
    originSetFieldMeta((draft) => {
      Object.keys(draft).forEach((field) => {
        draft[field].isValidating = true
      })
    })
    const validateRes = await originValidate()
    const hasFieldError = !validateRes?.isPass
    originSetFieldMeta((draft) => {
      Object.keys(draft).forEach((field) => {
        draft[field].isValidating = false
        const fieldError = hasFieldError ? validateRes?.errors?.find((item) => item.field === field) : undefined
        if (fieldError) {
          draft[field].error = fieldError.message
        }
      })
    })

    const error = await runValidation()
    const hasFormError = error && typeof error === 'string'
    setFormMeta('isValidating', false)

    if (hasFieldError || hasFormError) {
      setFormMeta('isSubmitting', false)
      return
    }

    // execute form submit
    setFormMeta((draft) => {
      draft.isSubmitted = false
      draft.submissionAttempts += 1
    })
    onSubmit && await onSubmit(values)
    setFormMeta((draft) => {
      draft.isSubmitted = true
      draft.isSubmitting = false
    })
  }, [meta.isValid, setFormMeta, originSetFieldMeta, originValidate, runValidation, onSubmit, JSON.stringify(values)])

  // when form is touched or values changed, run validation
  useEffect(() => {
    if (!validatePristine && !meta.isTouched) {
      return
    }
    runValidation()
  }, [meta.isTouched, validatePristine, JSON.stringify(values)])

  // set form initial values
  useEffect(() => {
    if (defaultValues) {
      setDefaultValues(defaultValues)
      setValues(defaultValues)
    }
  }, [])

  return {
    runValidation,
    handleSubmit,

    ...form
  }
}
