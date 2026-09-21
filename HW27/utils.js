export async function readJson(req, limitBytes = 1024 * 1024) {
  let body = "";
  
  try {
    for await (const chunk of req) {
      body += chunk.toString();
      if (body.length > limitBytes) {
        req.destroy();
        throw { status: 413, message: "Превышен лимит в 1МБ" };
      }
    }
    return body ? JSON.parse(body) : {};
  } catch (err) {
    throw err.status ? err : { status: 400, message: "Некорректный JSON" };
  }
}