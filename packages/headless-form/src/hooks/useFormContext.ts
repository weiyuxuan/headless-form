import { useRef, useMemo, useCallback } from 'react'
import get from 'lodash.get'
import set from 'lodash.set'

import useFormValues from './useFormValues'
import useFormMeta from './useFormMeta'

import { FormValues, FormMeta, FieldMeta, FormContextInstance } from '../types'

export default function useFormContext<Vs extends FormValues, M extends FormMeta, N extends FieldMeta> (): FormContextInstance<Vs, M, N> {
  const { values, setValues, resetValues } = useFormValues<Vs>()
  const { formId, formMeta, setFormMeta, resetFormMeta, fieldMeta, setFieldMeta: originSetFieldMeta } = useFormMeta<M, N>()

  const instanceRef = useRef<FormContextInstance<Vs, M, N>>()

  const meta = useMemo(() => {
    const fieldsAreValidating = Object.keys(fieldMeta || {})?.some(field => field && fieldMeta[field].isValidating)
    const fieldsAreValid = Object.keys(fieldMeta || {})?.every(field => field && !fieldMeta[field].error)
    const isValid = fieldsAreValid && !fieldsAreValidating && !formMeta.error
    const canSubmit = isValid && !formMeta.isValidating && !formMeta.isSubmitting

    return {
      ...formMeta,
      fieldsAreValidating,
      fieldsAreValid,
      isValid,
      canSubmit
    }
  }, [formMeta, fieldMeta])

  const instance = useMemo(() => ({
    formId,
    values,
    meta,
    fieldMeta
  }), [formId, JSON.stringify(values), meta, fieldMeta]) as FormContextInstance<Vs, M, N>

  // keep instance reference unchanged, but update it in real time
  instanceRef.current = instance

  const reset = useCallback(() => {
    resetValues()
    resetFormMeta()
  }, [resetValues, resetFormMeta])

  const getFieldValue = useCallback((fieldPath: string) => {
    return get(values, fieldPath)
  }, [JSON.stringify(values)])

  const getFieldMeta = useCallback((fieldPath: string) => {
    return fieldMeta[fieldPath] || {} as N
  }, [fieldMeta])

  const setFieldMeta = useCallback((
    fieldPath: string,
    updater: ((previousMeta: any) => Object) | Object
  ) => {
    originSetFieldMeta((draft) => {
      draft[fieldPath] = typeof updater === 'function'
        ? updater(draft[fieldPath])
        : { ...(draft[fieldPath] || {}), ...updater }
    })
  }, [originSetFieldMeta])

  const resetArrayFieldMeta = useCallback((fieldPath: string) => {
    originSetFieldMeta((draft) => {
      const arrKeys = Object.keys(draft).filter(key => key.startsWith(`${fieldPath}.`))
      arrKeys.forEach(key => {
        draft[key].error = ''
        draft[key].isValidating = false
        draft[key].isTouched = false
      })
    })
  }, [originSetFieldMeta])

  const setFieldValue = useCallback((
    fieldPath: string,
    updater: ((previousValue: any) => any) | any,
    options: { isTouched: boolean } = { isTouched: true }
  ) => {
    setValues((draft) => {
      set(draft, fieldPath, typeof updater === 'function' ? updater(get(draft, fieldPath)) : updater)
    })
    if (options?.isTouched) {
      setFieldMeta(fieldPath, { isTouched: true })
      setFormMeta('isTouched', true)
    }
  }, [setValues, setFieldMeta, setFormMeta])

  const pushFieldValue = useCallback((fieldPath: string, newValue: any) => {
    setFieldValue(fieldPath, (previousValue: any) => {
      if (!Array.isArray(previousValue)) {
        return [newValue]
      }
      return [...previousValue, newValue]
    })
  }, [setFieldValue])

  const insertFieldValue = useCallback((fieldPath: string, index: number, newValue: any) => {
    setFieldValue(fieldPath, (previousValue: any) => {
      if (!Array.isArray(previousValue)) {
        throw Error('can\'t use insertFieldValue on non-array field')
      }
      return [...previousValue.slice(0, index), newValue, ...previousValue.slice(index)]
    })
    resetArrayFieldMeta(fieldPath)
  }, [setFieldValue, resetArrayFieldMeta])

  const removeFieldValue = useCallback((fieldPath: string, index: number) => {
    setFieldValue(fieldPath, (previousValue: any) => {
      if (!Array.isArray(previousValue)) {
        throw Error('can\'t use removeFieldValue on non-array field')
      }
      return [...previousValue.slice(0, index), ...previousValue.slice(index + 1)]
    })
    resetArrayFieldMeta(fieldPath)
  }, [setFieldValue])

  const swapFieldValues = useCallback((fieldPath: string, firstIndex: number, secondIndex: number) => {
    setValues((draft) => {
      const previousValue = get(draft, fieldPath)
      if (!Array.isArray(previousValue)) {
        throw Error('can\'t use swapFieldValues on non-array field')
      }
      const firstValue = previousValue[firstIndex]
      const secondValue = previousValue[secondIndex]
      previousValue[secondIndex] = firstValue
      previousValue[firstIndex] = secondValue
    })
    resetArrayFieldMeta(fieldPath)
  }, [setValues])

  Object.assign(instance, {
    setValues,
    setMeta: setFormMeta,
    reset,

    getFieldValue,
    getFieldMeta,

    setFieldValue,
    setFieldMeta,
    pushFieldValue,
    insertFieldValue,
    removeFieldValue,
    swapFieldValues
  })

  return instanceRef.current
}
