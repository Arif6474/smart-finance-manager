export const isAdmin = (userLevel?: string): boolean => {
    return userLevel === 'admin' || userLevel === 'superAdmin';
};

export const isSuperAdmin = (userLevel?: string): boolean => {
    return userLevel === 'superAdmin';
};
