export async function handleResponsePromise(promise, ctx) {
  return promise
    .then((data) => (ctx.body = data))
    .catch((err) => {
      ctx.status = 422;
      ctx.body = { errors: { body: [err.toString()] } };
    });
}
