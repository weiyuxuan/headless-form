import { useCallback } from 'react'
import { useSetRecoilState } from 'recoil'
import { Draft } from 'immer'
import { valuesState, defaultValuesState } from '../states/values'
import useObjectState from './useObjectState'
import { errorsState } from '../states/errors'
import { FormValues, FormErrors } from '../types'

export default function useFormValues<Vs extends FormValues> () {
  const [values, setValues] = useObjectState<Vs>(valuesState)
  const [defaultValues, originSetDefaultValues] = useObjectState<Vs>(defaultValuesState)

  const setErrors = useSetRecoilState<FormErrors>(errorsState)

  const removeValue = useCallback((field: keyof FormValues) => {
    setValues((values) => {
      delete values[field]
    })
  }, [setValues])

  const removeValues = useCallback((fields: (keyof FormValues)[]) => {
    setValues((values) => {
      for (const field of fields) {
        delete values[field]
      }
    })
  }, [setValues])

  const resetValues = useCallback((data: FormValues = defaultValues as FormValues) => {
    setValues((values) => {
      for (const field of Object.keys({ ...values, ...data })) {
        if (data[field] !== undefined) {
          values[field as keyof Draft<Vs>] = data[field]
        } else {
          delete values[field]
        }
      }
    })

    setErrors({})
  }, [JSON.stringify(defaultValues), setValues, setErrors])

  const setDefaultValues = useCallback((data: Partial<FormValues>, isResetValues = true) => {
    originSetDefaultValues((defaultValues) => {
      for (const field of Object.keys(data)) {
        defaultValues[field as keyof Draft<Vs>] = data[field]
      }
    })

    if (isResetValues) {
      resetValues(data)
    }
  }, [originSetDefaultValues, resetValues])

  return {
    values,
    setValues,
    removeValue,
    removeValues,
    resetValues,

    defaultValues,
    setDefaultValues
  }
}
