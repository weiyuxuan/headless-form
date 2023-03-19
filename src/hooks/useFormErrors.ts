import { useCallback } from 'react'
import { errorsState } from '../states/errors'
import useObjectState from './useObjectState'
import { FormErrors } from '../types'

export default function useFormErrors () {
  const [errors, setErrors] = useObjectState<FormErrors>(errorsState)

  const removeError = useCallback((field: keyof FormErrors) => {
    setErrors((errs) => {
      delete errs[field]
    })
  }, [setErrors])

  const removeErrors = useCallback((fields: (keyof FormErrors)[]) => {
    setErrors((errs) => {
      for (const field of fields) {
        delete errs[field]
      }
    })
  }, [setErrors])

  const resetErrors = useCallback(() => {
    setErrors((errs) => {
      for (const key of Object.keys(errs)) {
        delete errs[key]
      }
    })
  }, [setErrors])

  return {
    errors,
    setErrors,
    removeError,
    removeErrors,
    resetErrors
  }
}
