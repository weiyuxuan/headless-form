export function splitFormProps ({
  field,
  defaultValue,
  defaultMeta,
  rules,
  validatePristine,
  scope,
  valuePropKey,
  ...rest
}) {
  return [
    field,
    {
      defaultValue,
      defaultMeta,
      rules,
      validatePristine,
      scope,
      valuePropKey
    },
    rest
  ]
}

export function randomString (length: number): string {
  const str = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let result = ''
  for (let i = length; i > 0; --i) { result += str[Math.floor(Math.random() * str.length)] }
  return result
}
