export const isAuthenticated = (state) => {
    if (state.auth.auth.access) return true;
    return false;
};
