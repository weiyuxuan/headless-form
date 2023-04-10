import { useCallback } from 'react'
import produce, { Draft } from 'immer'
import { useRecoilState } from 'recoil'
import { Update } from '../types'

const useObjectState = <T extends object>(state) => {
  const [originState, originSet] = useRecoilState<T>(state)

  const set: Update<T> = useCallback(<K extends keyof Draft<T>>(data: any, value?: Draft<T>[K]) => {
    // key-value set
    if (typeof data === 'string') {
      originSet(produce(draft => {
        const key = data as K
        const v = value as Draft<T>[K]
        draft[key] = v
      }))
    }
    // function set
    if (typeof data === 'function') {
      originSet(produce(data as (draft: Draft<T>) => void))
    }
    // object set
    if (typeof data === 'object') {
      originSet(produce((draft: Draft<T>) => {
        const obj = data as Draft<T>
        for (const key of Object.keys(obj)) {
          const k = key as keyof Draft<T>
          draft[k] = obj[k]
        }
      }))
    }
  }, [originSet])

  return [originState, set] as [T, Update<T>]
}

export default useObjectState
