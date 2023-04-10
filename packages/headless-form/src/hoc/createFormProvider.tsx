import React from 'react'
import { RecoilRoot } from 'recoil'
import { formIdState } from '../states/meta'
import { valuesState, defaultValuesState } from '../states/values'
import { randomString } from '../utils'

interface FormProviderProps {
  children: React.ReactNode
}

export default function createFormProvider (options: { defaultValues?: any } = {}) {
  const FormProvider = (props?: FormProviderProps) => {
    const { children } = props

    const initializeState = ({ set }) => {
      const formId = randomString(16)
      set(formIdState, formId)
      if (options?.defaultValues) {
        set(defaultValuesState, options?.defaultValues)
        set(valuesState, options?.defaultValues)
      }
    }

    return (
      <RecoilRoot initializeState={initializeState}>
        {children}
      </RecoilRoot>
    )
  }

  return FormProvider
}
