/* eslint-disable func-names */
/* eslint-disable consistent-return */
import ggl from 'graphql-tag';
import mergeUser from '@/graphql/mutation/auth/mergeUser.graphql';

export default async function ({ app, store, redirect }) {
  if (store.state.auth.loggedIn) {
    if (!store.state.auth.user.role) {
      const { email, picture, name } = store.state.auth.user;

      const { data } = await app.$apollo.mutate({
        mutation: ggl(mergeUser),
        variables: {
          email: store.state.auth.user.email,
          user: {
            email,
            picture,
            name,
          },
        },
      });
      const user = data.MergeUser;
      store.state.auth.user = user;
    } else if (store.state.auth.user.role.name === 'user') {
      redirect('/client');
    }
  }
}
