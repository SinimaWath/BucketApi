const SERVICES_TYPES = {
    AuthService: Symbol.for('AuthService'),
    UserService: Symbol.for('UserService'),
};

const STORAGE_TYPES = {
    UserStorage: Symbol.for('UserStorage'),
};

const CONSTANT_TYPES = {
    PrivateKeyJWT: Symbol.for('PrivateKeyJWT'),
};

export const TYPES = {
    Logger: Symbol.for('Logger'),
    Morgan: Symbol.for('Morgan'),

    ...SERVICES_TYPES,
    ...STORAGE_TYPES,
    ...CONSTANT_TYPES,
};
