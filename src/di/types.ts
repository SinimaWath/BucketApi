const SERVICES_TYPES = {
    AuthService: Symbol.for('AuthService'),
    UserService: Symbol.for('UserService'),
};

const STORAGE_TYPES = {
    AuthStorage: Symbol.for('AuthStorage'),
    UserStorage: Symbol.for('UserStorage'),
};

const CONSTANT_TYPES = {
    Config: Symbol.for('Config'),
    PrivateKeyJWT: Symbol.for('PrivateKeyJWT'),
};

const MIDDLEWARE = {
    Catch: Symbol.for('Catch'),
    JSON: Symbol.for('JSON'),
    Morgan: Symbol.for('Morgan'),
};

const PROVIDERS = {
    AuthProvider: Symbol.for('AuthProvider'),
};

const THIRD_PARTY = {
    JsonWebToken: Symbol.for('JsonWebToken'),
};

export const TYPES = {
    Logger: Symbol.for('Logger'),

    ...SERVICES_TYPES,
    ...STORAGE_TYPES,
    ...CONSTANT_TYPES,
    ...MIDDLEWARE,
    ...THIRD_PARTY,
    ...PROVIDERS,
};
