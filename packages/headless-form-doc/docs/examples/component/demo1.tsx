import React from 'react'
import { useFormProvider, useForm, useField, splitFormProps } from '@weiyuxuan/headless-form'

interface Option {
  label: string
  value: string | number
  selected: boolean
}

const SelectField = (props) => {
  const [field, fieldOptions, { options, ...rest }] = splitFormProps(props)

  const {
    value = '',
    setValue,
    meta: { error, isValidating }
  } = useField(field, fieldOptions)

  const handleSelectChange = e => {
    setValue(e.target.value)
  }

  return (
    <>
      <select {...rest} value={value} onChange={handleSelectChange}>
        <option disabled value="" />
        {options.map(option => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>{' '}
      <span style={{ paddingLeft: 10 }}>
        {isValidating
          ? (<em>Validating...</em>)
          : error
            ? (<em style={{ color: 'red' }}>{error}</em>)
            : null}
      </span>
    </>
  )
}

const MultiSelectField = (props) => {
  const [field, fieldOptions, { options, ...rest }] = splitFormProps(props)

  const {
    value = [],
    setValue,
    meta: { error, isValidating }
  } = useField(field, fieldOptions)

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.options)
      .filter((option: Option) => option.selected)
      .map((option: Option) => option.value)

    setValue(selected)
  }

  return (
    <>
      <select {...rest} value={value} onChange={handleSelectChange} multiple>
        <option disabled value="" />
        {options.map(option => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <span style={{ paddingLeft: 10 }}>
        {isValidating
          ? (<em>Validating...</em>)
          : error
            ? (<em style={{ color: 'red' }}>{error}</em>)
            : null}
      </span>
    </>
  )
}

function MyForm () {
  const { formId, values, meta, fieldMeta, handleSubmit } = useForm({
    onSubmit: async (values) => {
      console.log(values)
    }
  })

  return (
    <>
      <div>
        <label>
          Favorite Color:{' '}
          <SelectField
            field="favoriteColor"
            options={['Red', 'Blue', 'Green', 'Yellow']}
            rules={{
              required: true,
              message: 'A color is required'
            }}
          />
        </label>
        <p style={{ color: '#ccc' }}>required</p>
      </div>

      <div>
        <label>
          Favorite Colors:{' '}
          <MultiSelectField
            field="favoriteColors"
            options={['Red', 'Blue', 'Green', 'Yellow']}
            rules={{
              validator: (rule, value) => value?.length >= 2,
              message: 'At least 2 colors are required!'
            }}
          />
        </label>
        <p style={{ color: '#ccc' }}>at least 2</p>
      </div>

      <div>
        <button onClick={handleSubmit} disabled={!meta.canSubmit}>
          {meta.canSubmit ? 'Submit' : 'Submit Disabled'}
        </button>
      </div>

      <div style={{ marginTop: 20 }}>
        Form State:
        <pre>
          {JSON.stringify({ formId, values, meta, fieldMeta }, null, 2)}
        </pre>
      </div>
    </>
  )
}

function App () {
  const Form = useFormProvider()

  return (
    <Form>
      <MyForm />
    </Form>
  )
}

export default App
