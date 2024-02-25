export function generateTransactionID() {
  const randomString = Math.random().toString(36).substr(2, 10);
  const timestamp = Date.now();
  const transactionID = `${randomString}-${timestamp}`;
  return transactionID;
}
