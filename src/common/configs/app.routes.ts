const userRoot = 'users';
const authRoot = 'auth';

const v1 = 'v1';
export const routesV1 = {
  version: v1,
  user: {
    root: userRoot,
    getAll: `/${userRoot}/get-all`,
    getOne: `/${userRoot}/get-one/:id`,
    updateOne: `/${userRoot}/update/:id`,
  },
  auth: {
    root: authRoot,
    register: `/${authRoot}/register`,
    login: `/${authRoot}/login`,
  },
};
