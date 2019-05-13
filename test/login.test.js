import request from './request'

test('Teste', () => {
  request('http://localhost:3000/auth/login').then(response => {
    expect(response).toBeTruthy()
  })
})
