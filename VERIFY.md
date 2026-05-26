# Verifying the demo

Paste these snippets into the DevTools console after `demo/index.html` loads, with the WebMCP testing flag enabled (`chrome://flags/#enable-webmcp-testing`).

## 1. Tool is registered with the expected schema

```js
const info = navigator.modelContextTesting?.listTools() ?? [];
const tool = info.find(t => t.name === 'contact_sales');
console.assert(tool, 'contact_sales should be registered');

const schema = JSON.parse(tool.inputSchema);
for (const r of ['fullname','email','website','plan','industry','message','privacyConsent']) {
  console.assert(schema.required.includes(r), `missing required: ${r}`);
}
```

## 2. Calling the tool fills + submits the form

```js
await navigator.modelContextTesting.executeTool('contact_sales', JSON.stringify({
  fullname: 'Grace Hopper',
  email: 'grace@example.com',
  website: 'https://example.com',
  plan: 'Enterprise Plans',
  industry: 'University / Higher-Ed',
  referrer: 'Pressidium Blog',
  visits: '2.000.000',
  message: 'Migrating from a competitor; ~2M monthly visits.',
  privacyConsent: true,
}));

console.assert(document.querySelector('[name="fullname"]').value === 'Grace Hopper');
console.assert(document.getElementById('sales-form-contact').hidden === true);
console.assert(document.getElementById('thank-you').hidden === false);
```

## Notes

- Introspection lives on `navigator.modelContextTesting` (separate from `navigator.modelContext`).
- `tool.inputSchema` arrives as a JSON string, not a parsed object.
- The same checks are repeated in narrative form in `ARTICLE.md` under "A quick console smoke test".
