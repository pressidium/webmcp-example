/**
 * Verification (paste into DevTools console after page load):
 *
 *   const f = document.getElementById('sales-form-contact');
 *   f.fullname.value = 'Ada Lovelace';
 *   f.email.value    = 'ada@example.com';
 *   f.website.value  = 'https://example.com';
 *   f.plan.value     = 'Standard Plans';
 *   f.industry.value = 'Agency';
 *   f.message.value  = 'Looking to migrate from a competitor.';
 *   f.privacyConsent.checked = true;
 *   f.requestSubmit();
 *   // Expected:
 *   //   - the form is hidden
 *   //   - #thank-you is visible
 *   f.hidden === true && document.getElementById('thank-you').hidden === false
 */

(function () {
  const form = document.getElementById('sales-form-contact');
  if (!form) return;

  const thankYou = document.getElementById('thank-you');

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const payload = Object.fromEntries(data.entries());
    payload.followup       = form.followup.checked;
    payload.privacyConsent = form.privacyConsent.checked;

    console.info('[demo] sales-form-contact payload', payload);

    form.hidden = true;
    if (thankYou) thankYou.hidden = false;
  });
})();
