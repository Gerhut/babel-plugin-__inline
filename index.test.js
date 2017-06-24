/* eslint-env jest */

const { readFileSync } = require('fs')
const babel = require('babel-core')
const __inline = require('.')

it('should inline text file into string.', () => {
  const { code } = babel.transformFileSync('fixtures/text/index.js', {
    plugins: [__inline]
  })
  expect(code).toBe(readFileSync('fixtures/text/expect.js', 'utf8'))
})

it('should inline binary file into string.', () => {
  const { code } = babel.transformFileSync('fixtures/binary/index.js', {
    plugins: [__inline]
  })
  expect(code).toBe(readFileSync('fixtures/binary/expect.js', 'utf8'))
})

it('should throws when inline file not exists.', () => {
  expect(() => {
    babel.transformFileSync('fixtures/not-exists/index.js', {
      plugins: [__inline]
    })
  }).toThrow()
})

it('should keep not standard inline as it is', () => {
  const { code } = babel.transformFileSync('fixtures/not-standard/index.js', {
    plugins: [__inline]
  })
  expect(code).toBe(readFileSync('fixtures/not-standard/expect.js', 'utf8'))
})
