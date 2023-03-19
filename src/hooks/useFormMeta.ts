import { useCallback } from 'react'
import { useRecoilValue } from 'recoil'
import { Draft } from 'immer'
import { formIdState, formMetaState, fieldMetaState, DefaultFormMeta } from '../states/meta'
import useObjectState from './useObjectState'
import { FormMeta, FieldMeta } from '../types'

export default function useFormMeta<M extends FormMeta, N extends FieldMeta> () {
  const formId = useRecoilValue(formIdState)

  const [formMeta, setFormMeta] = useObjectState<M>(formMetaState)
  const [fieldMeta, setFieldMeta] = useObjectState<{ [field:string]: N }>(fieldMetaState)

  const resetFormMeta = useCallback((data: FormMeta = DefaultFormMeta as FormMeta) => {
    setFormMeta((meta) => {
      for (const field of Object.keys({ ...meta, ...data })) {
        if (data[field] !== undefined) {
          meta[field as keyof Draft<M>] = data[field]
        } else {
          delete meta[field]
        }
      }
    })
  }, [setFormMeta])

  return {
    formId,

    formMeta,
    setFormMeta,
    resetFormMeta,

    fieldMeta,
    setFieldMeta
  }
}
