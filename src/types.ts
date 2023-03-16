import { Draft } from 'immer'
import { RuleItem, Rules, ErrorList, FieldErrorList } from 'async-validator'

export { Draft }

/** form state update function */
export interface Update<T extends object> {
  <K extends keyof Draft<T>> (key: K, value: Draft<T>[K]): void
  (data: Partial<T>): void
  (f: (draft: Draft<T>) => void | T): void
}

/** form value state */
export interface FormValues { [field: string]: any }
export type UseFormValues<Vs extends FormValues> = () => ({
  values: Vs
  setValues: Update<Vs>
  removeValue: (key: keyof Vs) => void
  removeValues: (keys: (keyof Vs)[]) => void
  resetValues: (data?: Vs) => void
  defaultValues: Partial<Vs>
  setDefaultValues: (defaultValues: Partial<Vs>, isReset?: boolean) => void
})

/** form validate rules */
export type FormRule = RuleItem
export type FormRules = Rules
export type Validator = FormRule['validator']
export type AsyncValidator = FormRule['asyncValidator']
export type ValidateCallback<Vs> = (errors?: ErrorList, values?: Vs) => void
export interface ValidateResult { errors?: ErrorList, fields?: FieldErrorList, isPass: boolean }
export interface ValidateOption<Vs> {
  /** validate single field */
  field?: string
  /** validate multiple fields */
  fields?: string[]
  /** validate multiple fields and their values */
  fieldsValue?: FormValues
  /** excluded fields */
  excludedFields?: string[]
  /** callback after validate */
  callback?: ValidateCallback<Vs>
  /** if reset error after validate */
  isResetError?: boolean
  /** if scroll to the first field dom after validate */
  isScroll?: boolean
}
export type Validate<Vs> = (option?: ValidateOption<Vs>) => Promise<ValidateResult>
export type UseFormValidators<Vs extends FormValues> = () => ({
  getRule: (field: string) => Promise<FormRule | FormRule[]>
  getRules: (fields?: string[]) => Promise<FormRules>
  setRules: (field: string, value: FormRule | FormRule[]) => void
  removeRule: (field: keyof FormRules) => void
  removeRules: (fields: (keyof FormRules)[]) => void
  validate: Validate<Vs>

  setValidateValues: (field: string, value: any) => void
})

/** form error state */
export interface FormErrors { [field: string]: string }
export type UseFormErrors = () => ({
  errors: FormErrors
  setErrors: Update<FormErrors>
  removeError: (key: keyof FormErrors) => void
  removeErrors: (keys: (keyof FormErrors)[]) => void
  resetErrors: () => void
})

/** form meta state */
export interface FormMeta {
  // default status
  error?: string
  isTouched?: boolean
  isValidating?: boolean
  isSubmitting?: boolean
  isSubmitted?: boolean
  submissionAttempts?: number
  // derived status
  fieldsAreValidating?: boolean
  fieldsAreValid?: boolean
  isValid?: boolean
  canSubmit?: boolean
  // custom status
  [key: string]: any
}
export interface FieldMeta {
  error?: string
  isTouched?: boolean
  isValidating?: boolean
  // custom status
  [key: string]: any
}
export type UseFormMeta<M extends FormMeta, N extends FieldMeta> = () => ({
  formId: string
  formMeta: M
  setFormMeta: Update<M>
  resetFormMeta: (data?: M) => void
  fieldMeta: { [field: string]: N }
  setFieldMeta: Update<{ [field: string]: N }>
})