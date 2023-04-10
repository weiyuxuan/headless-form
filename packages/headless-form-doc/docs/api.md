---
title: API 一览
order: 5
---

# API 一览

- [useFormProvider](#useformprovider)
- [useForm](#useform)
- [useField](#usefield)
- [useFormContext](#useformcontext)

## useFormProvider

生成表单状态 Provider

```tsx | pure
import { useFormProvider } from '@weiyuxuan/headless-form'

function App () {
  const FormProvider = useFormProvider()

  return (
    <FormProvider>
      <MyForm />
    </FormProvider>
  )
}
```

## useForm

获取表单完整实例

```tsx | pure
import { useForm } from '@weiyuxuan/headless-form'

const formInstance = useForm<FormValues, FormMeta, FieldMeta>(options)
```

#### useForm Options

- defaultValues: object
  - 表单默认值
- onSubmit: (values: FormValues) => `void` | `Promise<void>`
  - 表单提交时的回调
- validate: (values: FormValues) => `string` | `false` | `undefined` | `Promise<string | false | undefined>`
  - 表单层级校验方法
- validatePristine: boolean
  - 是否在表单未修改时自动进行校验，默认为 `false`

#### Form Instance

一个表单实例，包含下列属性和方法：

- formId: string
  - 表单 id，每个表单实例的 id 唯一
- values: any
  - 表单当前值
- meta: Object
  - 表单当前元信息
  - isTouched: boolean
    - 表单是否被修改过
  - isValidating: boolean
    - 表单是否正在校验
  - isValid: boolean
    - 表单是否校验通过
  - error: string | undefined
    - 表单层级的校验错误信息
  - fieldsAreValidating: boolean
    - 表单的字段是否正在校验
  - fieldsAreValid: boolean
    - 表单的字段是否校验通过
  - isSubmitting: boolean
    - 表单是否正在提交
  - isSubmitted: boolean
    - 表单是否已经提交过
  - submissionAttempts: number
    - 表单提交次数
  - canSubmit: boolean
    - 表单是否可以提交
  - ...any
    - 其他自定义元信息，可以通过 `formInstance.setMeta` 方法设置
- fieldMeta: { [field: string]: Object }
  - 表单字段元信息
  - Object
    - isTouched: boolean
      - 字段是否被修改过
    - isValidating: boolean
      - 字段是否正在校验
    - error: string | undefined
      - 字段校验错误信息
    - ...any
      - 其他自定义元信息，可以通过 `formInstance.setFieldMeta` 设置
- setValues: (values: any) => void
  - 设置表单值
  - 参考 [setValues](/v2/use-values#setvalues)
- setMeta: (meta: Object) => void
  - 设置表单元信息
  - 使用方法类似 `setValues`
- reset: () => void
  - 重置表单值和元信息
- runValidation: () => Promise<string | false | undefined>
  - 手动运行表单层级校验
- handleSubmit: (event?: React.SyntheticEvent) => `Promise<void>`
  - 手动提交表单值
- getFieldValue: (fieldPath: string) => any
  - 获取表单字段值
  - fieldPath 是一个点分隔的字符串，例如 `a.b.c` / `a.0.b`
- getFieldMeta: (fieldPath: string) => Object
  - 获取表单字段元信息
  - fieldPath 是一个点分隔的字符串，例如 `a.b.c` / `a.0.b`
- setFieldValue: (fieldPath: string, (updater(previousValue: any) => newValue: any) | newValue: any, options: { isTouched: boolean }) => void
  - 设置表单字段值
  - 如果第二个参数传的是函数，则会将函数的返回值作为新值
  - 第三个参数中的 `isTouched` 默认为 `true`，如果设置为 `false`，则不更新 `isTouched` 状态
- setFieldMeta: (fieldPath: string, (updater(previousValue: any) => newValue: any) | newValue: any) => void
  - 设置表单字段元信息
  - 使用方法类似 `setFieldValue`
- pushFieldValue: (fieldPath: string, value: any) => void
  - 向数组类型的表单字段中添加一个值，如果字段不是数组，则会抛出异常
- insertFieldValue: (fieldPath: string, index: number, value: any) => void
  - 向数组类型的表单字段中插入一个值，如果字段不是数组，则会抛出异常
- removeFieldValue: (fieldPath: string, index: number) => void
  - 从数组类型的表单字段中移除一个值，如果字段不是数组，则会抛出异常
- swapFieldValues: (fieldPath: string, firstIndex: number, secondIndex: number) => void
  - 交换数组类型的表单字段中的两个值，如果字段不是数组，则会抛出异常

## useField

获取表单字段实例

```tsx | pure
import { useField } from '@weiyuxuan/headless-form'

const FormProvider = useField<FormValues, FormMeta, FieldMeta>(fieldPath, options)
```

#### useField Options

- fieldPath: string
  - 必填
  - 字段路径，是一个点分隔的字符串，例如 `a.b.c` / `a.0.b`
- options: Object
  - defaultValue: any
    - 字段默认值
  - defaultMeta: Object
    - 字段默认元信息
  - rules: FormRule | FormRule[]
    - 字段校验规则
    - 遵循 `async-validator` 校验规则，支持同步/异步校验
  - validatePristine: boolean
    - 是否在字段未被修改过时自动校验，默认为 false
  - scope: string
    - 字段作用域，拼接在 `fieldPath` 之前，用于区分同一个表单中的一组字段
  - valuePropKey: string
    - 字段值对应的属性名，默认为 `value`
    - 有一些特殊场景，例如 `Checkbox` / `Radio`，其值对应的属性名为 `checked`

#### Field Instance

一个表单字段实例，包含下列属性和方法：

- fieldName: string
  - 字段名称
  - 拼接自 `scope` 和 `fieldPath`
- value: any
  - 字段当前值
- meta: Object
  - 字段当前元信息
  - isTouched: boolean
    - 字段是否被修改过
  - isValidating: boolean
    - 字段是否正在校验
  - error: string
    - 字段校验错误信息
  - ...any
    - 其他自定义元信息，可以通过 `fieldInstance.setMeta` 方法设置
- runValidation: () => `Promise<ValidateResult>`
  - 手动触发字段校验
  - 返回一个 Promise，如果校验通过，则 Promise 的值为 `{isPass: true}`，否则为 `{isPass: false, errors: ValidateError[]}`
- setValue: ((updater(previousValue: any) => newValue: any) | newValue: any, options: Object { isTouched: Bool })  => void
  - 设置字段值
  - 如果第二个参数传的是函数，则会将函数的返回值作为新值
  - 第三个参数中的 `isTouched` 默认为 `true`，如果设置为 `false`，则不更新 `isTouched` 状态
- setMeta: ((updater(previousMeta: Object) => newMeta: Object) | newMeta: Object) => void
  - 设置字段元信息
  - 使用方法类似 `setValue`
- pushValue: (value: any) => void
  - 向数组类型的字段中添加一个值，如果字段不是数组，则会抛出异常
- insertValue: (index: number, value: any) => void
  - 向数组类型的字段中插入一个值，如果字段不是数组，则会抛出异常
- removeValue: (index: number) => void
  - 从数组类型的字段中移除一个值，如果字段不是数组，则会抛出异常
- swapValue: (firstIndex: number, secondIndex: number) => void
  - 交换数组类型的字段中的两个值，如果字段不是数组，则会抛出异常
- getInputProps: (props: Object {}) => enhanced props Object
  - 获取用于绑定到表单控件的 props 对象
  - value: any
    - 字段当前值
  - onChange: (e: Event) => void
    - 字段值变化时的回调函数
  - onBlur: (e: Event) => void
    - 字段失去焦点时的回调函数
  - classNames: string
    - 字段的 class 名
  - ...rest
    - 其他传入的 props

## useFormContext

获取表单上下文实例

```tsx | pure
import { useFormContext } from '@weiyuxuan/headless-form'

const formInstance = useFormContext<FormValues, FormMeta, FieldMeta>()
```

和 `useForm` 生成的实例一致，但是：

1. 不需要重复传配置参数；
2. 不返回 `handleSubmit` 和 `runValidation` 方法，这两个方法在表单组件中使用。
