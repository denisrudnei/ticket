import { Middleware } from '@nuxt/types';
import mergeUser from '~/graphql/mutation/auth/mergeUser';

const AdminMiddleware: Middleware = async ({ app, store, redirect }) => {
  if (store.state.auth.loggedIn) {
    if (!store.state.auth.user.role) {
      const { email, picture, name } = store.state.auth.user;

      const { data } = await app.apolloProvider.defaultClient.mutate({
        mutation: mergeUser,
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
};

export default AdminMiddleware;
