import { useRef, useMemo, useEffect, useCallback } from 'react'
import { Draft } from 'immer'
import get from 'lodash.get'
import set from 'lodash.set'
import debounce from 'lodash.debounce'

import { DefaultFieldMeta } from '../states/meta'
import useFormContext from './useFormContext'
import useFormMeta from './useFormMeta'
import useFormValidators from './useFormValidators'
import useFormValues from './useFormValues'

import { FormValues, FormMeta, FormRule, FieldMeta, FieldInstance } from '../types'

export default function useField<Vs extends FormValues, M extends FormMeta, N extends FieldMeta> (
  fieldPath: string,
  options: {
    defaultValue?: any
    defaultMeta?: N
    rules?: FormRule | FormRule[]
    validatePristine?: boolean
    scope?: string
    valuePropKey?: string
  } = {}
): FieldInstance<N> {
  if (!fieldPath) {
    throw new Error('useField: A field is required to use this hook. eg, useField(\'myField\', options)')
  }

  const instanceRef = useRef<FieldInstance<N>>()

  const {
    defaultValue,
    defaultMeta = DefaultFieldMeta as N,
    rules,
    validatePristine = false,
    scope = '',
    valuePropKey = 'value'
  } = options

  const fieldName = scope ? `${scope}.${fieldPath}` : fieldPath

  const form = useFormContext<Vs, M, N>()

  const { setValues } = useFormValues<Vs>()
  const { setFieldMeta } = useFormMeta<M, N>()
  const { setRules, removeRule, validate, setValidateValues } = useFormValidators<Vs>()

  const value = useMemo(() => {
    return form.getFieldValue(fieldName) ?? defaultValue
  }, [form.getFieldValue, fieldName, JSON.stringify(defaultValue)])

  const meta = useMemo(() => {
    return form.getFieldMeta(fieldName)
  }, [form.getFieldMeta, fieldName])

  const instance = useMemo(() => ({
    fieldName,
    value,
    meta
  }), [fieldName, JSON.stringify(value), meta]) as FieldInstance<N>

  instanceRef.current = instance

  const setValue = useCallback((
    updater: ((previousValue: any) => any) | any,
    options: { isTouched: boolean } = { isTouched: true }
  ) => {
    form.setFieldValue(fieldName, updater, options)
  }, [form.setFieldValue, fieldName])

  const setMeta = useCallback((
    updater: ((previousMeta: any) => Object) | Object
  ) => {
    form.setFieldMeta(fieldName, updater)
  }, [form.setFieldMeta, fieldName])

  const runValidation = useCallback(debounce(async () => {
    setMeta({ isValidating: true })
    const validateRes = await validate({ field: fieldName })
    setMeta({ isValidating: false, error: validateRes?.errors?.[0]?.message || '' })
    return validateRes
  }, 200), [validate, setMeta, fieldName])

  const pushValue = useCallback((newValue: any) => {
    form.pushFieldValue(fieldName, newValue)
  }, [form.pushFieldValue, fieldName])

  const insertValue = useCallback((index: number, newValue: any) => {
    form.insertFieldValue(fieldName, index, newValue)
  }, [form.insertFieldValue, fieldName])

  const removeValue = useCallback((index: number) => {
    form.removeFieldValue(fieldName, index)
  }, [form.removeFieldValue, fieldName])

  const swapValues = useCallback((firstIndex: number, secondIndex: number) => {
    form.swapFieldValues(fieldName, firstIndex, secondIndex)
  }, [form.swapFieldValues, fieldName])

  const getInputProps = useCallback(({ onChange, onBlur, className, ...rest }: any = {}) => {
    const defaultClassName = `headless-form-field headless-form-field-${form.formId}-${fieldName}`
    return {
      value,
      onChange: (e: any) => {
        const nextValue = (e && e.target) ? e.target?.[valuePropKey] : e
        setValue(nextValue, { isTouched: true })
        if (onChange) {
          onChange(e)
        }
      },
      onBlur: (e: any) => {
        setMeta({ isTouched: true })
        if (onBlur) {
          onBlur(e)
        }
      },
      className: className ? `${defaultClassName} ${className?.trim() || ''}` : defaultClassName,
      ...rest
    }
  }, [setMeta, setValue, form.formId, fieldName, valuePropKey, JSON.stringify(value)])

  Object.assign(instance, {
    setValue,
    setMeta,
    runValidation,
    pushValue,
    insertValue,
    removeValue,
    swapValues,
    getInputProps
  })

  // when field unmount, remove field meta and rules
  useEffect(() => {
    return () => {
      setFieldMeta((draft) => {
        delete draft[fieldName]
      })
      removeRule(fieldName)
    }
  }, [setFieldMeta, removeRule])

  // if field has no meta, set default meta
  useEffect(() => {
    setFieldMeta((draft) => {
      const prevMeta = draft[fieldName]
      if (prevMeta === undefined) {
        draft[fieldName] = defaultMeta as Draft<N>
      }
    })
  }, [setFieldMeta, fieldName, defaultMeta])

  // if field has no value, set default value
  useEffect(() => {
    setValues((draft) => {
      const prevValue = get(draft, fieldName)
      if (prevValue === undefined) {
        set(draft, fieldName, defaultValue)
      }
    })
  }, [setValues, fieldName, JSON.stringify(defaultValue)])

  // when value changed, update validateValues
  useEffect(() => {
    setValidateValues(fieldName, value)
  }, [setValidateValues, fieldName, JSON.stringify(value)])

  // when rules changed, update rules
  useEffect(() => {
    setRules(fieldName, rules)
  }, [setRules, rules, fieldName])

  // when field is touched or value changed, run validation
  useEffect(() => {
    if (!validatePristine && !meta?.isTouched) {
      return
    }
    runValidation()
  }, [meta?.isTouched, validatePristine, JSON.stringify(value)])

  return instanceRef.current
}
