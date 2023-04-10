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
  setDefaultValues: (defaultValues: Partial<Vs>, isResetValues?: boolean) => void
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
  /** whether to reset error after validate */
  isResetError?: boolean
  /** whether to scroll to the first field dom after validate */
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
  // default meta
  error?: string
  isTouched?: boolean
  isValidating?: boolean
  isSubmitting?: boolean
  isSubmitted?: boolean
  submissionAttempts?: number
  // derived meta
  fieldsAreValidating?: boolean
  fieldsAreValid?: boolean
  isValid?: boolean
  canSubmit?: boolean
  // custom meta
  [key: string]: any
}
export interface FieldMeta {
  error?: string
  isTouched?: boolean
  isValidating?: boolean
  // custom meta
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

/** form instance */
export interface FormInstance<Vs extends FormValues, M extends FormMeta, N extends FieldMeta> {
  formId: string

  values: Vs
  setValues: Update<Vs>
  meta: M
  setMeta: Update<M>
  fieldMeta: { [key: string]: N }
  reset: () => void

  handleSubmit: (event: any) => void
  runValidation: () => Promise<string | false | undefined>

  getFieldValue: (fieldPath: string) => any
  getFieldMeta: (fieldPath: string) => N

  setFieldValue: (fieldPath: string, updater: ((previousValue: any) => any) | any, options?: { isTouched: boolean }) => void
  setFieldMeta: (fieldPath: string, updater: ((previousMeta: any) => Object) | Object) => void
  pushFieldValue: (fieldPath: string, newValue: any) => void
  insertFieldValue: (fieldPath: string, index: number, newValue: any) => void
  removeFieldValue: (fieldPath: string, index: number) => void
  swapFieldValues: (fieldPath: string, firstIndex: number, secondIndex: number) => void
}

/** form context instance */
export interface FormContextInstance<Vs extends FormValues, M extends FormMeta, N extends FieldMeta> {
  formId: string

  values: Vs
  setValues: Update<Vs>
  meta: M
  setMeta: Update<M>
  fieldMeta: { [key: string]: N }
  reset: () => void

  getFieldValue: (fieldPath: string) => any
  getFieldMeta: (fieldPath: string) => N

  setFieldValue: (fieldPath: string, updater: ((previousValue: any) => any) | any, options?: { isTouched: boolean }) => void
  setFieldMeta: (fieldPath: string, updater: ((previousMeta: any) => Object) | Object) => void
  pushFieldValue: (fieldPath: string, newValue: any) => void
  insertFieldValue: (fieldPath: string, index: number, newValue: any) => void
  removeFieldValue: (fieldPath: string, index: number) => void
  swapFieldValues: (fieldPath: string, firstIndex: number, secondIndex: number) => void
}

/** field instance */
export interface FieldInstance<N extends FieldMeta> {
  fieldName: string

  value: any
  meta: N

  runValidation: () => Promise<ValidateResult>

  setValue: (updater: ((previousValue: any) => any) | any, options?: { isTouched: boolean }) => void
  setMeta: (updater: ((previousMeta: any) => Object) | Object) => void
  pushValue: (newValue: any) => void
  insertValue: (index: number, newValue: any) => void
  removeValue: (index: number) => void
  swapValues: (firstIndex: number, secondIndex: number) => void

  getInputProps: (props?: any) => any
}
