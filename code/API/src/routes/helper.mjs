const success = (message, data) => {
  return {
    message: message,
    data: data,
  };
};

const getUniqueUserId = (users) => {
    const userIDs = users.map((user) => user.id);
    const maxId = userIDs.reduce((a, b) => Math.max(a, b));
    return maxId + 1;
    };
export { success,getUniqueUserId};