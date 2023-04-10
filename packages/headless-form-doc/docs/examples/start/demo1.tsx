import React from 'react'
import { useFormProvider, useForm, useField } from '@weiyuxuan/headless-form'

function NameField () {
  const {
    meta: { error, isValidating },
    getInputProps
  } = useField('name', {
    defaultValue: '',
    rules: [{
      required: true,
      message: 'A name is required'
    }, {
      validator: (rule, value) => {
        if (value?.length < 2 || value?.length > 4) {
          return false
        }
        return true
      },
      message: 'Name length must be between 2 and 4'
    }]
  })

  return (
    <>
      <input {...getInputProps()} />
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

function AddressStreetField () {
  const {
    meta: { error, isValidating },
    getInputProps
  } = useField('address.street', {
    defaultValue: '',
    rules: [{
      required: true,
      message: 'A street is required'
    }, {
      asyncValidator: async (rule, value, cb) => {
        await new Promise(resolve => setTimeout(resolve, 1000))
        return cb()
      },
      message: 'Fake Async Validator'
    }]
  })

  return (
    <>
      <input {...getInputProps()} />
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
    onSubmit: (values) => { console.log(values) }
  })

  return (
    <>
      <div>
        <label>
          Name: <NameField />
        </label>
        <p style={{ color: '#ccc' }}>required, length 2- 4</p>
      </div>
      <div>
        <label>
          Address Street: <AddressStreetField />
        </label>
        <p style={{ color: '#ccc' }}>required, fake async validate</p>
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
