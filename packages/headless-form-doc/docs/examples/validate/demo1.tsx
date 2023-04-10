import React from 'react'
import { useFormProvider, useForm, useField, splitFormProps } from '@weiyuxuan/headless-form'

const InputField = React.forwardRef((props: any, ref) => {
  const [field, fieldOptions, rest] = splitFormProps(props)

  const {
    meta: { error, isValidating },
    getInputProps
  } = useField(field, fieldOptions)

  return (
    <>
      <input {...getInputProps({ ref, ...rest })} />
      <span style={{ paddingLeft: 10 }}>
        {isValidating
          ? (<em>Validating...</em>)
          : error
            ? (<em style={{ color: 'red' }}>{error}</em>)
            : null}
      </span>
    </>
  )
})

function MyForm () {
  const { formId, values, meta, fieldMeta, removeFieldValue, pushFieldValue, handleSubmit } = useForm({
    defaultValues: {
      name: 'tanner',
      age: 29,
      email: 'tanner@gmail.com',
      other: { notes: 'hello' },
      friends: ['jaylen']
    },
    validate: values => {
      if (values.name === 'tanner' && +values.age !== 29) {
        return "This is not tanner's correct age"
      }
      return false
    },
    onSubmit: async (values) => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log(values)
    }
  })

  return (
    <>
      <div>
        <label>
          Name:{' '}
          <InputField
            field="name"
            rules={{
              required: true,
              message: 'A name is required'
            }}
          />
        </label>
        <p style={{ color: '#ccc' }}>required</p>
      </div>

      <div>
        <label>
          Age:{' '}
          <InputField
            field="age"
            type="number"
            min="1"
            rules={{
              validator: (rule, value) => {
                return value >= 10
              },
              message: 'You must be at least 10 years old'
            }}
          />
        </label>
        <p style={{ color: '#ccc' }}>{'>= 10'}</p>
      </div>

      <div>
        <label>
          Email:{' '}
          <InputField
            field="email"
            rules={[
              {
                required: true,
                message: 'An email is required'
              },
              {
                pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                message: 'Invalid email address'
              },
              {
                asyncValidator: async (rule, value, cb) => {
                  await new Promise(resolve => setTimeout(resolve, 1000))
                  if (value === 'alexyxwei@tencent.com') {
                    return cb('This email is already taken')
                  }
                  return cb()
                }
              }
            ]}
          />
        </label>
        <p style={{ color: '#ccc' }}>required, valid email, not alexyxwei@tencent.com</p>
      </div>

      <div>
        <label>
          Notes:{' '}
          <InputField field="other.notes" />
        </label>
        <p style={{ color: '#ccc' }}>no validate</p>
      </div>

      <div>
        Friends
        <div
          style={{
            width: 500,
            border: '1px solid black',
            padding: '1rem',
            marginBottom: '1rem'
          }}
        >
          {values?.friends?.map((friend, i) => (
            <div key={i}>
              <label>
                Friend:{' '}
                <InputField
                  field={`friends.${i}`}
                  rules={{
                    required: true,
                    message: 'A friend Name is required'
                  }}
                />{' '}
                <button onClick={() => removeFieldValue('friends', i)}>
                  del
                </button>
              </label>
            </div>
          ))}
          <button onClick={() => pushFieldValue('friends', '')}>
              Add Friend
          </button>
        </div>
      </div>

      <div>
        <button onClick={handleSubmit} disabled={!meta.canSubmit}>
          {meta.canSubmit ? 'Submit' : 'Submit Disabled'}
        </button>
        {meta.error && <em style={{ marginLeft: 10, color: 'red' }}>{meta.error}</em>}
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
