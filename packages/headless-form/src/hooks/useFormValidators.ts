import { useCallback } from 'react'
import { useRecoilValue, useSetRecoilState, useRecoilCallback } from 'recoil'
import Validator from 'async-validator'
import { formIdState } from '../states/meta'
import { rulesState, validateValuesState } from '../states/validate'
import { errorsState } from '../states/errors'
import { FormValues, FormErrors, FormRule, FormRules, Validate, ValidateResult } from '../types'

export default function useFormValidators<Vs extends FormValues> () {
  const formId = useRecoilValue(formIdState)
  const setErrors = useSetRecoilState<FormErrors>(errorsState)

  // according to performance, we don't subscribe rulesState directly
  const originSetRules = useSetRecoilState<FormRules>(rulesState)
  const setRules = useCallback((field: string, rule: FormRule | FormRule[]) => {
    originSetRules((rules) => ({ ...rules, [field]: rule }))
  }, [originSetRules])

  // validate function only validate the values which are registered in the form fields,
  // not all values in the form instance
  const originSetValidateValues = useSetRecoilState<FormValues>(validateValuesState)
  const setValidateValues = useCallback((field: string, value: any) => {
    originSetValidateValues((prev) => ({ ...prev, [field]: value }))
  }, [originSetValidateValues])

  const getRule = useRecoilCallback(({ snapshot }) => async (field: string) => {
    const rules = await snapshot.getPromise(rulesState)

    if (typeof field === 'string') {
      return rules[field]
    }
  }, [])

  const getRules = useRecoilCallback(({ snapshot }) => async (fields?: string[]) => {
    const rules = await snapshot.getPromise(rulesState)

    if (Array.isArray(fields)) {
      const tempRules = {}
      for (const key of fields) {
        tempRules[key] = rules[key]
      }
      return tempRules
    } else if (fields === undefined) {
      return { ...rules }
    }
  }, [])

  const removeRule = useCallback((field: keyof FormRules) => {
    originSetRules((rules) => {
      const newRules = { ...rules }
      delete newRules[field]
      return newRules
    })
  }, [originSetRules])

  const removeRules = useCallback((fields: (keyof FormRules)[]) => {
    originSetRules((rules) => {
      const newRules = { ...rules }
      for (const field of fields) {
        delete newRules[field]
      }
      return newRules
    })
  }, [originSetRules])

  const scrollToErrors = useCallback((errors: FormErrors = {}) => {
    const errorFields = Object.keys(errors)
    let firstErrorField
    let firstErrorFieldOffsetTop
    let firstErrorFieldEl
    if (errorFields.length === 0) return

    errorFields.forEach((field) => {
      const fieldEl = document.getElementsByClassName(`headless-form-field-${formId}-${field}`)?.[0]
      if (fieldEl && fieldEl.getBoundingClientRect) {
        const fieldOffsetTop = fieldEl.getBoundingClientRect().top
        if (!firstErrorField || fieldOffsetTop < firstErrorFieldOffsetTop) {
          firstErrorField = field
          firstErrorFieldOffsetTop = fieldOffsetTop
          firstErrorFieldEl = fieldEl
        }
      }
    })
    firstErrorFieldEl && firstErrorFieldEl.scrollIntoView({ behavior: 'smooth' })
  }, [formId])

  const validate: Validate<Vs> = useRecoilCallback(({ snapshot }) => async (option = {}) => {
    const { field, fields, fieldsValue, excludedFields, callback = () => {}, isResetError = false, isScroll = false } = option

    // when validate, get the latest validate related state asynchronously
    const validateValues = await snapshot.getPromise(validateValuesState)
    const rules = await snapshot.getPromise(rulesState)
    const errors = await snapshot.getPromise(errorsState)

    // avoid to delete the current saved values and rules when the `excludedFields` parameter is effective
    let currentValidateValues = { ...validateValues }
    let currentRules = { ...rules }

    if (field) {
      currentValidateValues = { [field]: validateValues[field] } as Vs
      currentRules = { [field]: rules[field] }
    } else if (fields) {
      const tempValidateValues = {}
      const tempRules = {}
      for (const key of fields) {
        tempValidateValues[key] = validateValues[key]
        tempRules[key] = rules[key]
      }
      currentValidateValues = tempValidateValues as Vs
      currentRules = tempRules
    } else if (fieldsValue) {
      const tempRules = {}
      for (const key in fieldsValue) {
        tempRules[key] = rules[key]
      }
      currentValidateValues = fieldsValue as Vs
      currentRules = tempRules
    }

    // clear the field values and rules in the `excludedFields` parameter
    if (excludedFields) {
      for (const key of excludedFields) {
        delete currentValidateValues[key]
        delete currentRules[key]
      }
    }

    // clear the field rules which are undefined
    for (const key in currentRules) {
      if (!currentRules[key]) {
        delete currentRules[key]
      }
    }

    const validator = new Validator(currentRules)
    const beforeErr = { ...errors }

    const validateCallback = (errors, fields) => {
      // when validate failed, save the errors
      if (errors) {
        const errs = isResetError ? {} : beforeErr
        for (const error of errors) {
          errs[error.field] = error.message
        }
        setErrors(errs)
        if (isScroll) {
          scrollToErrors(errs)
        }
      }

      // when validate passed, clear the errors if `isResetError` is true
      if (!errors && isResetError) {
        let removeErrorKeys = (!field && !fields && !fieldsValue)
          ? Object.keys(beforeErr)
          : field
            ? [field]
            : (fields || Object.keys(fieldsValue as FormValues))

        // don't clear the errors of the fields which are not validated
        if (excludedFields) {
          removeErrorKeys = removeErrorKeys.filter(key => !excludedFields.includes(key))
        }

        setErrors(errs => {
          const newErrs = { ...errs }
          for (const field of removeErrorKeys) {
            delete newErrs[field as string]
          }
          return newErrs
        })
      }

      callback(errors, fields)
    }

    const validatePassHandler = () => ({ isPass: true })
    const validateErrorHandler = (err) => {
      const { errors, fields } = err
      if (!errors && !fields) {
        throw err
      }
      return { errors, fields, isPass: !errors }
    }

    return validator
      .validate(currentValidateValues, {}, validateCallback)
      .then(validatePassHandler)
      .catch(validateErrorHandler) as Promise<ValidateResult>
  }, [scrollToErrors])

  return {
    getRule,
    getRules,
    setRules,
    removeRule,
    removeRules,
    validate,

    setValidateValues
  }
}
