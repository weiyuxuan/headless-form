import { setAutoFreeze } from 'immer'

import useFormProvider from './hooks/useFormProvider'
import createFormProvider from './hoc/createFormProvider'

setAutoFreeze(false)

export * from './types'

export {
  useFormProvider,

  createFormProvider
}
