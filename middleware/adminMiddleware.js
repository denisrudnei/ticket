/* eslint-disable func-names */
/* eslint-disable consistent-return */
export default function ({ store, redirect }) {
  if (store.state.auth.loggedIn && store.state.auth.user.role.name === 'user') {
    return redirect('/client');
  }
}
